"""Import the approved visual sources, without audio, credentials or demo assets.

Run explicitly after reviewing an upstream revision. Normal production never
reads the source checkout. The lock records every imported byte for attribution
and reproducibility; upstream demo stories remain reference-only.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUGS = (
    "dataviz", "swiss-motion", "iso-infographic", "news-package",
    "blueprint", "whiteboard", "halftone-dossier", "visual-investigation",
    "data-physical", "briefing-board", "archive-lighttable", "satellite-briefing",
)
# Only independent drawing engines. Film-specific source is archived separately.
ENGINES = {
    "dataviz": ["engine.js"], "swiss-motion": ["ease.js"],
    "iso-infographic": ["engine.js"], "blueprint": ["draw.js", "paper.js"],
    "whiteboard": ["engine/wb.js"], "briefing-board": ["kit/board.js"],
    "satellite-briefing": ["engine.js", "overlay.js"],
}


def import_sources(source: Path, destination: Path) -> None:
    revision = subprocess.check_output(
        ["git", "-C", str(source), "rev-parse", "HEAD"], text=True
    ).strip()
    records = []

    def copy(src: Path, dst: Path, adapted: bool = False) -> None:
        if src.is_symlink():
            raise ValueError(f"Refusing symlink: {src}")
        dst.parent.mkdir(parents=True, exist_ok=True)
        raw = src.read_bytes()
        changes = []
        if adapted:
            depth = len(dst.relative_to(destination).parts) - 1
            helper = "../" * depth + "shared/lib.js"
            raw = raw.replace(b"/core/lib.js", helper.encode())
            if src.name == "board.js":
                raw = raw.replace(b"const KIT = new URL('.', import.meta.url).pathname;", b"let KIT = new URL('.', import.meta.url).href;\n// OpenMontage: project-owned public asset root (objects/, fonts/).\nexport function setAssetBase(url) { KIT = new URL(url.endsWith('/') ? url : url + '/', location.href).href; }")
            changes.append("portable helper imports; board supports project-owned asset base")
        if src.suffix == ".txt":
            cleaned = re.sub(rb"[ \t]+(?=\r?$)", b"", raw, flags=re.MULTILINE)
            if cleaned != raw:
                changes.append("trailing whitespace trimmed; licence wording unchanged")
            raw = cleaned
        dst.write_bytes(raw)
        records.append({
            "source": src.relative_to(source).as_posix(),
            "path": dst.relative_to(destination).as_posix(),
            "source_sha256": hashlib.sha256(src.read_bytes()).hexdigest(),
            "sha256": hashlib.sha256(raw).hexdigest(),
            "modification": "; ".join(changes) or "none",
        })

    copy(source / "LICENSE", destination / "LICENSE.lemo")
    copy(source / "core/lib.js", destination / "shared/lib.js")
    for slug in SLUGS:
        base = source / "styles" / slug
        pack = destination / slug
        copy(base / "STYLE.md", pack / "STYLE.md")
        copy(base / "DEMO.md", pack / "reference/DEMO.md")
        copy(base / "demo/CREDITS", pack / "reference/CREDITS")
        for name in ENGINES.get(slug, []):
            copy(base / "demo" / name, pack / "engine" / name, adapted=True)
        if slug == "whiteboard":
            copy(base / "demo/fonts/EMSTech.json", pack / "engine/fonts/EMSTech.json")
            copy(base / "demo/fonts/OFL-ArchitectsDaughter.txt", pack / "engine/fonts/OFL-ArchitectsDaughter.txt")
        # Code only: no binary pictures, voices, fonts, score, downloaded data,
        # generated images, vendored dependencies, or executable maintenance tools.
        for src in sorted((base / "demo").rglob("*")):
            rel = src.relative_to(base / "demo")
            if any(p in {"node_modules", "tools", "render", "audio", "music", "voices", "vo", "tts", "fonts"} for p in rel.parts):
                continue
            if src.is_file() and src.suffix in {".js", ".html"}:
                copy(src, pack / "reference/source" / rel)
    lock = {
        "repository": "https://github.com/lemomo-ai/lemo-opuscar",
        "revision": revision, "code_license": "MIT",
        "reference_media_license": "CC-BY-4.0 (no reference media imported)",
        "files": records,
    }
    (destination / "upstream-lock.json").write_text(json.dumps(lock, ensure_ascii=False, indent=2) + "\n")
    print(f"Imported {len(SLUGS)} style packs, {len(records)} files at {revision}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    args = parser.parse_args()
    import_sources(args.source.resolve(), ROOT / "style-packs")
