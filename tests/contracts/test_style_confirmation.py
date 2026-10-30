"""The style gate records human intent, not an automatic creative ranking."""
import copy
import json

import pytest

from lib.checkpoint import CheckpointValidationError, init_project, read_checkpoint, write_checkpoint
from lib.pipeline_loader import list_pipelines, load_pipeline
from lib.style_confirmation import validate_confirmation
from lib.style_packs import reference
from tests.contracts.test_phase0_contracts import sample_artifact


def confirmation(project_id="film", approved=False):
    return {
        "version": "1.0", "project_id": project_id, "mode": "comparison",
        "content_basis": "Explain costs borne by factory and neighbors using an unchanged script.",
        "catalog_review": {"sources": ["style-packs/catalog.json", "styles/"], "reviewed_count": 59},
        "candidates": [
            {"id": name, "name": name, "kind": "custom", "reference": "project/style.md",
             "fit": "Makes the third party visible", "tradeoff": "Needs bespoke layouts",
             "visual_grammar": ["Spatial causal diagram"], "beat_examples": ["80 + 20 = 100"],
             "runtime_requirements": ["Canvas 2D"]}
            for name in ["isometric", "whiteboard", "paper"]
        ],
        "recommendation": {"candidate_id": "isometric", "reason": "Shows transaction boundaries"},
        "format": {"aspect_ratio": "9:16", "width": 1080, "height": 1920, "fps": 30,
                   "container": "mp4", "basis": "Explicitly presented to the user",
                   "status": "approved" if approved else "proposed",
                   **({"approval_evidence": "Fixture: approve portrait 1080x1920"} if approved else {})},
        "approval": {"status": "approved", "candidate_id": "isometric", "evidence": "Fixture: choose isometric"}
                    if approved else {"status": "pending"},
    }


def plan(style):
    return {"proposal_packet": sample_artifact("proposal_packet"), "style_confirmation": style}


def test_new_video_requires_comparison_and_approval_before_production(tmp_path):
    init_project("film", title="Film", pipeline_type="animated-explainer", pipeline_dir=tmp_path)
    kwargs = {"pipeline_type": "animated-explainer"}
    with pytest.raises(CheckpointValidationError, match="style_confirmation"):
        write_checkpoint(tmp_path, "film", "proposal", "awaiting_human", plan(None), **kwargs)
    pending = confirmation()
    write_checkpoint(tmp_path, "film", "proposal", "awaiting_human", plan(pending), **kwargs)
    with pytest.raises(CheckpointValidationError, match="not been confirmed"):
        write_checkpoint(tmp_path, "film", "proposal", "completed", plan(pending), human_approved=True, **kwargs)
    with pytest.raises(CheckpointValidationError, match="approve the idea/proposal"):
        write_checkpoint(tmp_path, "film", "assets", "in_progress", {}, **kwargs)
    approved = confirmation(approved=True)
    write_checkpoint(tmp_path, "film", "proposal", "completed", plan(approved), human_approved=True, **kwargs)
    write_checkpoint(tmp_path, "film", "assets", "in_progress", {}, **kwargs)
    assert read_checkpoint(tmp_path, "film", "assets")["status"] == "in_progress"


def test_new_run_cannot_reuse_another_projects_style_approval(tmp_path):
    init_project("film", title="Film", pipeline_type="animated-explainer", pipeline_dir=tmp_path)
    with pytest.raises(CheckpointValidationError, match="different project"):
        write_checkpoint(tmp_path, "film", "proposal", "completed", plan(confirmation("old-episode", True)),
                         pipeline_type="animated-explainer", human_approved=True)


def test_format_approval_is_independent_of_style(tmp_path):
    init_project("film", title="Film", pipeline_type="animated-explainer", pipeline_dir=tmp_path)
    style = confirmation(approved=True)
    style["format"] = confirmation()["format"]
    with pytest.raises(CheckpointValidationError, match="format separately"):
        write_checkpoint(tmp_path, "film", "proposal", "completed", plan(style),
                         pipeline_type="animated-explainer", human_approved=True)


@pytest.mark.parametrize("mutation,error", [
    (lambda c: c["recommendation"].update(candidate_id="missing"), "compared candidate"),
    (lambda c: c["candidates"].append(copy.deepcopy(c["candidates"][0])), "duplicate"),
    (lambda c: c["format"].update(width=1920), "aspect_ratio"),
    (lambda c: c["approval"].update(evidence=" "), "explicit confirmation"),
])
def test_invalid_confirmation_rejected(mutation, error):
    style = confirmation(approved=True)
    mutation(style)
    with pytest.raises(ValueError, match=error):
        validate_confirmation(style)


def test_explicit_user_choice_does_not_force_three_options():
    style = confirmation(approved=True)
    style["mode"] = "explicit_choice"
    style["candidates"] = style["candidates"][:1]
    validate_confirmation(style)


def test_pending_proposal_does_not_pretend_the_runtime_is_already_locked():
    from schemas.artifacts import validate_artifact
    from jsonschema import ValidationError

    proposal = sample_artifact("proposal_packet")
    proposal["approval"]["status"] = "pending"
    proposal["production_plan"].pop("render_runtime")
    validate_artifact("proposal_packet", proposal)
    proposal["approval"]["status"] = "approved"
    with pytest.raises(ValidationError):
        validate_artifact("proposal_packet", proposal)


def test_selected_pack_must_match_inspected_identity_and_proposal(tmp_path):
    init_project("film", title="Film", pipeline_type="animated-explainer", pipeline_dir=tmp_path)
    style = confirmation(approved=True)
    style["candidates"][0].update(id="lemo-iso-infographic", kind="style_pack", selection=reference("lemo-iso-infographic"))
    style["recommendation"]["candidate_id"] = "lemo-iso-infographic"
    style["approval"]["candidate_id"] = "lemo-iso-infographic"
    artifacts = plan(style)
    with pytest.raises(CheckpointValidationError, match="does not match"):
        write_checkpoint(tmp_path, "film", "proposal", "completed", artifacts,
                         pipeline_type="animated-explainer", human_approved=True)
    artifacts["proposal_packet"]["production_plan"]["style_pack"] = style["candidates"][0]["selection"]
    write_checkpoint(tmp_path, "film", "proposal", "completed", artifacts,
                     pipeline_type="animated-explainer", human_approved=True)


def test_legacy_runs_and_non_video_derivatives_remain_compatible(tmp_path):
    write_checkpoint(tmp_path, "legacy", "assets", "in_progress", {}, pipeline_type="cinematic")
    init_project("legacy", title="Legacy", pipeline_type="cinematic", pipeline_dir=tmp_path)
    marker = json.loads((tmp_path / "legacy/project.json").read_text())
    # Initializing an existing run must not silently re-gate it.
    # Here no project marker existed, so this was a new initialization.
    assert marker["style_confirmation_required"] is True
    marker.pop("style_confirmation_required")
    (tmp_path / "legacy/project.json").write_text(json.dumps(marker))
    init_project("legacy", title="Legacy", pipeline_type="cinematic", pipeline_dir=tmp_path)
    assert "style_confirmation_required" not in json.loads((tmp_path / "legacy/project.json").read_text())
    write_checkpoint(tmp_path, "legacy", "assets", "in_progress", {}, pipeline_type="cinematic")
    init_project("article", title="Article", pipeline_type="finance-wechat-article", pipeline_dir=tmp_path)
    assert "style_confirmation_required" not in json.loads((tmp_path / "article/project.json").read_text())


def test_every_video_planning_manifest_declares_the_style_contract():
    for name in list_pipelines():
        manifest = load_pipeline(name)
        if manifest.get("deliverable_type", "video") != "video":
            continue
        planning = next((s for s in manifest["stages"] if s["name"] in {"idea", "proposal"}), None)
        if planning is None:
            continue
        assert "meta/style-confirmation" in manifest["required_skills"], name
        assert "style_confirmation" in planning["produces"], name
        assert planning.get("primary_artifact") != "style_confirmation", name
        assert "style_pack" in planning["tools_available"], name
