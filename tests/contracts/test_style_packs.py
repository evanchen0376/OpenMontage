"""Behavioral contracts for visual-library integration and legacy compatibility."""
from __future__ import annotations

import copy
import json
from pathlib import Path

import jsonschema
import pytest

from lib.style_packs import (
    PACKS, catalog, load_pack, materialize, reference,
    validate_render_binding, verify_reference, verify_upstream,
)
from tools.graphics.style_pack import StylePack
from tools.video.video_compose import VideoCompose


@pytest.mark.parametrize("pack", catalog(), ids=lambda p: p["id"])
def test_materialization_is_self_contained_and_has_no_demo_story(pack, tmp_path):
    selection = reference(pack["id"])
    destination = tmp_path / "drawing-library"
    result = materialize(pack["id"], destination, selection=selection)
    assert result["rendered"] is False
    assert Path(result["entry"]).is_file()
    assert json.loads((destination / "selection.json").read_text()) == selection
    assert (destination / "LICENSE.lemo").is_file()
    assert not list(destination.rglob("reference"))
    assert not list(destination.rglob("DEMO.md"))
    assert not list(destination.rglob("*.mp3"))
    assert not list(destination.rglob("*.mp4"))
    if pack["slug"] == "paper-popup":
        assert "coverCanvases" not in (destination / "paper-popup/engine/book.js").read_text()
    # Native helper imports must resolve inside the copied library, not donor checkout.
    import re
    for file in destination.rglob("*.js"):
        # Some native material engines are legitimately named film.js (grain
        # and scratches). Reject actual demo entry code, not that filename.
        assert not re.search(r"window\.render\s*=", file.read_text()), file
        for spec in re.findall(r"from\s+['\"]([^'\"]+)['\"]", file.read_text()):
            assert not spec.startswith("/core/"), (file, spec)
            if spec.startswith("."):
                target = (file.parent / spec).resolve()
                assert target.is_relative_to(destination.resolve())
                assert target.is_file(), (file, spec)


def test_unknown_style_and_path_traversal_are_rejected(tmp_path):
    with pytest.raises(ValueError, match="Unknown"):
        materialize("../../.env", tmp_path / "bad")
    from lib.style_packs import _inside
    with pytest.raises(ValueError, match="escapes"):
        _inside(PACKS, "../config.yaml")


def test_materialize_never_overwrites_or_leaves_partial_output(tmp_path):
    target = tmp_path / "existing"
    target.mkdir()
    (target / "film.tsx").write_text("original film")
    with pytest.raises(ValueError, match="already exists"):
        materialize("lemo-dataviz", target)
    assert (target / "film.tsx").read_text() == "original film"
    ref = reference("lemo-dataviz")
    ref["digest"] = "0" * 64
    with pytest.raises(ValueError, match="drift"):
        materialize("lemo-dataviz", tmp_path / "partial", selection=ref)
    assert not (tmp_path / "partial").exists()


def test_source_integrity_and_font_licence():
    assert verify_upstream()["passed"]
    font = json.loads((PACKS / "whiteboard/engine/fonts/EMSTech.json").read_text())
    assert "Open Font License" in font["meta"]
    assert load_pack("lemo-whiteboard")["requires"] == []


def test_binding_rejects_drift_and_silent_overrides_but_leaves_legacy_runs_alone():
    assert validate_render_binding({"edit_decisions": {"render_runtime": "ffmpeg"}}) is None
    selected = reference("lemo-dataviz")
    inputs = {
        "proposal_packet": {"production_plan": {"style_pack": selected}},
        "edit_decisions": {"style_pack": copy.deepcopy(selected)},
        "asset_manifest": {"style_pack": copy.deepcopy(selected)},
    }
    assert validate_render_binding(inputs) == selected
    inputs["edit_decisions"]["style_pack"]["overrides"] = ["Add spring motion"]
    with pytest.raises(ValueError, match="changed"):
        validate_render_binding(inputs)
    inputs["edit_decisions"]["style_pack"] = selected
    inputs["asset_manifest"] = {}
    with pytest.raises(ValueError, match="asset_manifest"):
        validate_render_binding(inputs)


def test_render_checks_style_before_starting_a_runtime(monkeypatch):
    selected = reference("lemo-dataviz")
    changed = {**selected, "id": "lemo-swiss-motion"}
    result = VideoCompose().execute({
        "operation": "render",
        "edit_decisions": {"render_runtime": "remotion", "style_pack": changed},
        "proposal_packet": {"production_plan": {"style_pack": selected}},
    })
    assert result.success is False
    assert "Style-pack contract" in result.error


def test_schema_accepts_versioned_selection_and_rejects_unversioned():
    schema = json.loads((PACKS.parent / "schemas/artifacts/scene_plan.schema.json").read_text())
    ref_schema = schema["properties"]["style_pack"]
    jsonschema.validate(reference("lemo-dataviz"), ref_schema)
    with pytest.raises(jsonschema.ValidationError):
        jsonschema.validate({"id": "lemo-dataviz"}, ref_schema)


@pytest.mark.parametrize("name", ["proposal_packet", "scene_plan", "asset_manifest", "edit_decisions", "render_report"])
def test_selection_survives_real_canonical_artifact_validation(name):
    from tests.contracts.test_phase0_contracts import sample_artifact
    from schemas.artifacts import validate_artifact

    artifact = sample_artifact(name)
    if name == "edit_decisions":
        artifact["render_runtime"] = "hyperframes"
    node = artifact["production_plan"] if name == "proposal_packet" else artifact
    node["style_pack"] = reference("lemo-swiss-motion")
    validate_artifact(name, artifact)


def test_registry_discovers_drawing_library_without_enabling_a_generator():
    from tools.tool_registry import ToolRegistry

    registry = ToolRegistry()
    registry.discover()
    info = registry._tools["style_pack"].get_info()
    assert info["capability"] == "graphics"
    assert registry._tools["style_pack"].execute({"operation": "inspect", "pack_id": "lemo-dataviz"}).success


def test_tool_reports_materialization_errors_without_a_fake_success(tmp_path):
    tool = StylePack()
    assert len(tool.execute({"operation": "catalog"}).data["packs"]) == 59
    failed = tool.execute({"operation": "materialize", "pack_id": "lemo-dataviz"})
    assert not failed.success
    assert not list(tmp_path.iterdir())


def test_catalog_matches_the_entire_published_index_without_template():
    lock = json.loads((PACKS / "upstream-lock.json").read_text())
    assert len(lock["formal_styles"]) == 59
    assert {p["slug"] for p in catalog()} == set(lock["formal_styles"])
    assert "_template" not in lock["formal_styles"]
    assert len([p for p in catalog() if p["group"] == 4]) == 47


def test_first_wave_selections_keep_their_approved_identity():
    baseline = json.loads((Path(__file__).parent / "fixtures/style_pack_first_wave.json").read_text())
    assert len(baseline) == 12
    assert {key: reference(key) for key in baseline} == baseline


def test_declared_support_code_is_hashed_and_copied(monkeypatch, tmp_path):
    import shutil
    import lib.style_packs as library

    mirror = tmp_path / "packs"
    mirror.mkdir()
    for name in ("shared", "vendor", "microscope"):
        shutil.copytree(PACKS / name, mirror / name)
    for name in ("catalog.json", "upstream-lock.json", "package.json", "LICENSE.lemo"):
        shutil.copy2(PACKS / name, mirror / name)
    monkeypatch.setattr(library, "PACKS", mirror)
    before = reference("lemo-microscope")
    target = tmp_path / "materialized"
    result = materialize("lemo-microscope", target, selection=before)
    assert (target / "vendor/microscope.js").is_file()
    assert Path(result["entry"]).is_file()
    support = mirror / "vendor/microscope.js"
    support.write_text(support.read_text() + "\n// changed calibration mechanics\n")
    assert reference("lemo-microscope")["digest"] != before["digest"]
    with pytest.raises(ValueError, match="drift"):
        verify_reference(before)
