"""Versioned drawing libraries. Creative selection remains the agent's job."""
from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import tempfile
from pathlib import Path
from typing import Any

import jsonschema

ROOT = Path(__file__).resolve().parents[1]
PACKS = ROOT / "style-packs"


def _inside(root: Path, relative: str) -> Path:
    path = (root / relative).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError(f"Path escapes style library: {relative}")
    return path


def catalog() -> list[dict[str, Any]]:
    data = json.loads((PACKS / "catalog.json").read_text())
    schema = json.loads((ROOT / "schemas/styles/style_pack_catalog.schema.json").read_text())
    jsonschema.validate(data, schema)
    ids = [p["id"] for p in data["packs"]]
    if len(set(ids)) != len(ids):
        raise ValueError("Duplicate style-pack id")
    return data["packs"]


def load_pack(pack_id: str) -> dict[str, Any]:
    pack = next((p for p in catalog() if p["id"] == pack_id), None)
    if pack is None:
        raise ValueError(f"Unknown style pack: {pack_id}")
    base = _inside(PACKS, pack["slug"])
    for name in ["STYLE.md", "FINANCE.md", "TECHNIQUES.md", pack["native_entry"]]:
        if not _inside(base, name).is_file():
            raise ValueError(f"Incomplete style pack {pack_id}: {name}")
    return {**pack, "directory": str(base)}


def reference(pack_id: str) -> dict[str, str]:
    pack = load_pack(pack_id)
    lock = json.loads((PACKS / "upstream-lock.json").read_text())
    digest = hashlib.sha256()
    # Shared mechanics and metadata affect the rendered result too.
    digest.update(json.dumps({k: v for k, v in pack.items() if k != "directory"}, sort_keys=True).encode())
    paths = [*sorted((PACKS / "shared").rglob("*")),
             *sorted(Path(pack["directory"]).rglob("*"))]
    for path in paths:
        if path.is_file() and "reference" not in path.relative_to(PACKS).parts:
            digest.update(path.relative_to(PACKS).as_posix().encode())
            digest.update(path.read_bytes())
    return {"id": pack_id, "upstream_revision": lock["revision"], "digest": digest.hexdigest()}


def verify_reference(ref: dict[str, Any]) -> None:
    current = reference(ref["id"])
    if any(ref.get(key) != current[key] for key in current):
        raise ValueError("Style-pack version drift: review and log an explicit style revision")


def validate_render_binding(inputs: dict[str, Any]) -> dict[str, Any] | None:
    """Check the selected drawing library before a renderer spends any work.

    Old runs without a style_pack keep their existing behavior. This checks
    identity and explicit overrides, not artistic suitability or visual quality.
    """
    proposal = (inputs.get("proposal_packet") or {}).get("production_plan") or {}
    edit = inputs.get("edit_decisions") or {}
    selected = proposal.get("style_pack") or edit.get("style_pack")
    if selected is None:
        return None
    if not proposal.get("style_pack") or not edit.get("style_pack"):
        raise ValueError("style_pack requires matching proposal_packet and edit_decisions selections")
    if proposal["style_pack"] != edit["style_pack"]:
        raise ValueError("Style-pack selection/overrides changed between proposal and edit")
    verify_reference(selected)
    for name in ("scene_plan", "asset_manifest"):
        artifact = inputs.get(name)
        if artifact is not None and artifact.get("style_pack") != selected:
            raise ValueError(f"{name}.style_pack does not match the approved selection")
    return selected


def verify_upstream() -> dict[str, Any]:
    lock = json.loads((PACKS / "upstream-lock.json").read_text())
    failures = []
    for row in lock["files"]:
        path = _inside(PACKS, row["path"])
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != row["sha256"]:
            failures.append(row["path"])
    return {"passed": not failures, "files_checked": len(lock["files"]), "failures": failures}


def materialize(pack_id: str, output_path: Path, *, selection: dict[str, Any] | None = None) -> dict[str, Any]:
    """Copy a drawing library into a NEW directory, never a finished scene.

    Engines keep their relative paths. No demo stories, downloaded assets,
    TTS, BGM or reference media enter a production workspace.
    """
    pack = load_pack(pack_id)
    ref = reference(pack_id)
    if selection is not None:
        verify_reference(selection)
        if selection["id"] != pack_id:
            raise ValueError("Selected style does not match requested pack")
    output_path = output_path.absolute()
    if output_path.exists() or output_path.is_symlink():
        raise ValueError("Output already exists; use a new versioned directory")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    # Stage on the same filesystem. Failure must not leave a half-library.
    with tempfile.TemporaryDirectory(prefix=".style-pack-", dir=output_path.parent) as temp:
        staged = Path(temp) / "library"
        staged.mkdir()
        shutil.copytree(PACKS / "shared", staged / "shared")
        base = staged / pack["slug"]
        base.mkdir()
        for name in ["STYLE.md", "FINANCE.md", "TECHNIQUES.md"]:
            shutil.copy2(Path(pack["directory"]) / name, base / name)
        shutil.copytree(Path(pack["directory"]) / "engine", base / "engine")
        shutil.copy2(PACKS / "LICENSE.lemo", staged / "LICENSE.lemo")
        shutil.copy2(PACKS / "package.json", staged / "package.json")
        (staged / "selection.json").write_text(json.dumps(ref, indent=2) + "\n")
        staged.rename(output_path)
    return {"style_pack": ref, "library_path": str(output_path),
            "entry": str(output_path / pack["slug"] / pack["native_entry"]),
            "requires": pack["requires"], "rendered": False}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="operation", required=True)
    sub.add_parser("list")
    sub.add_parser("verify")
    inspect = sub.add_parser("inspect")
    inspect.add_argument("pack_id")
    args = parser.parse_args()
    if args.operation == "list":
        result = catalog()
    elif args.operation == "verify":
        result = verify_upstream()
    else:
        result = {**load_pack(args.pack_id), "selection": reference(args.pack_id)}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if args.operation == "verify" and not result["passed"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
