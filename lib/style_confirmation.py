"""Validate recorded style choices; creative ranking remains the agent's job."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from schemas.artifacts import validate_artifact


def validate_confirmation(confirmation: dict[str, Any]) -> None:
    validate_artifact("style_confirmation", confirmation)
    candidates = confirmation["candidates"]
    ids = [item["id"] for item in candidates]
    if len(set(ids)) != len(ids):
        raise ValueError("Style confirmation has duplicate candidate IDs")
    if confirmation["recommendation"]["candidate_id"] not in ids:
        raise ValueError("Recommended style must reference a compared candidate")
    approval = confirmation["approval"]
    if approval.get("candidate_id") is not None and approval["candidate_id"] not in ids:
        raise ValueError("Approved style must reference a compared candidate")
    if approval["status"] == "approved" and not approval["evidence"].strip():
        raise ValueError("Style approval requires the user's explicit confirmation")
    fmt = confirmation["format"]
    x, y = map(int, fmt["aspect_ratio"].split(":"))
    if fmt["width"] * y != fmt["height"] * x:
        raise ValueError("Style confirmation format dimensions disagree with aspect_ratio")
    if fmt["status"] == "approved" and not fmt["approval_evidence"].strip():
        raise ValueError("Format approval requires explicit confirmation")


def enforce_style_confirmation(
    project_dir: Path, pipeline_type: str | None, stage: str, status: str,
    artifacts: dict[str, Any], *, human_approved: bool,
) -> None:
    """Enforce the planning gate for new runs, without re-gating legacy checkpoints.

    Pending comparisons can be reviewed at idea/proposal. Downstream writes
    require a completed, approved planning checkpoint, including for in-progress
    asset work. Standalone JSON and another project's approval are not authority.
    """
    marker_path = project_dir / "project.json"
    marker = json.loads(marker_path.read_text()) if marker_path.exists() else {}
    supplied = artifacts.get("style_confirmation")
    if not marker.get("style_confirmation_required") and supplied is None:
        # A legacy project can explicitly adopt the gate without rewriting its marker.
        active = False
        for name in ("idea", "proposal"):
            path = project_dir / f"checkpoint_{name}.json"
            if path.exists() and json.loads(path.read_text()).get("artifacts", {}).get("style_confirmation"):
                active = True
        if not active:
            return
    if not pipeline_type or pipeline_type == "unknown":
        raise ValueError("Style confirmation requires a known video pipeline")
    from lib.pipeline_loader import get_stage_order, load_pipeline_readonly

    stages = get_stage_order(load_pipeline_readonly(pipeline_type))
    planning = next((name for name in stages if name in {"idea", "proposal"}), None)
    if planning is None or stages.index(stage) < stages.index(planning):
        return
    if stage == planning and status in {"in_progress", "failed"}:
        return
    if stage != planning and status == "failed":
        return
    if stage == planning:
        confirmation = supplied
        planning_artifacts = artifacts
    else:
        path = project_dir / f"checkpoint_{planning}.json"
        prior = json.loads(path.read_text()) if path.exists() else {}
        if prior.get("status") != "completed" or not prior.get("human_approved"):
            raise ValueError("STYLE GATE: approve the idea/proposal before downstream production")
        confirmation = prior.get("artifacts", {}).get("style_confirmation")
        planning_artifacts = prior.get("artifacts", {})
        if supplied is not None and supplied != confirmation:
            raise ValueError("STYLE GATE: revise and approve the planning style before changing it downstream")
    if not isinstance(confirmation, dict):
        raise ValueError("STYLE GATE: idea/proposal must include a style_confirmation comparison")
    validate_confirmation(confirmation)
    if confirmation["project_id"] != project_dir.name:
        raise ValueError("STYLE GATE: approval belongs to a different project")
    if status == "completed" or stage != planning:
        if confirmation["approval"]["status"] != "approved":
            raise ValueError("STYLE GATE: the recommended style has not been confirmed by the user")
        if confirmation["format"]["status"] != "approved":
            raise ValueError("STYLE GATE: confirm the output format separately from visual style")
        if stage == planning and not human_approved:
            raise ValueError("STYLE GATE: completing style confirmation requires human_approved=True")
        selected = next(c for c in confirmation["candidates"] if c["id"] == confirmation["approval"]["candidate_id"])
        if selected["kind"] == "style_pack":
            from lib.style_packs import verify_reference

            selection = selected.get("selection")
            if not isinstance(selection, dict) or selection.get("id") != selected["id"]:
                raise ValueError("STYLE GATE: the approved pack requires its inspected version identity")
            verify_reference(selection)
            proposal = planning_artifacts.get("proposal_packet")
            if proposal is not None and proposal.get("production_plan", {}).get("style_pack") != selection:
                raise ValueError("STYLE GATE: proposal style_pack does not match the confirmed style")
