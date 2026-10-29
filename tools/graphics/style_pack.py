"""Discover and materialize visual techniques; never choose a style or render a film."""
from pathlib import Path

from lib.style_packs import catalog, load_pack, materialize, reference, verify_upstream
from tools.base_tool import BaseTool, ToolResult, ToolStability, ToolStatus


class StylePack(BaseTool):
    name = "style_pack"
    version = "1.1.0"
    capability = "graphics"
    provider = "openmontage"
    stability = ToolStability.BETA
    capabilities = ["style_pack_catalog", "style_pack_inspect", "style_pack_materialize", "style_pack_verify"]
    dependencies = []
    agent_skills = ["visual-style"]
    related_skills = ["skills/core/style-packs.md"]
    usage_location = "skills/core/style-packs.md"
    best_for = ["Finance-priority and supporting visual libraries, native/adapted Canvas/WebGL techniques"]
    not_good_for = ["Automatic scene or story generation", "Rendering a final film"]
    side_effects = ["materialize writes a new drawing library under output_path"]
    input_schema = {
        "type": "object", "required": ["operation"], "additionalProperties": False,
        "properties": {
            "operation": {"enum": ["catalog", "inspect", "materialize", "verify"]},
            "pack_id": {"type": "string"},
            "output_path": {"type": "string"},
            "selection": {"type": "object"},
        },
    }

    def get_status(self):
        try:
            catalog()
            return ToolStatus.AVAILABLE
        except (ValueError, OSError):
            return ToolStatus.UNAVAILABLE

    def execute(self, inputs):
        try:
            op = inputs["operation"]
            if op == "catalog":
                data = {"packs": catalog()}
            elif op == "inspect":
                data = {**load_pack(inputs["pack_id"]), "selection": reference(inputs["pack_id"])}
            elif op == "verify":
                data = verify_upstream()
                return ToolResult(success=data["passed"], data=data)
            elif op == "materialize":
                data = materialize(inputs["pack_id"], Path(inputs["output_path"]), selection=inputs.get("selection"))
            else:
                raise ValueError(f"Unknown operation: {op}")
            return ToolResult(success=True, data=data, cost_usd=0)
        except (ValueError, KeyError, OSError) as exc:
            return ToolResult(success=False, error=str(exc))
