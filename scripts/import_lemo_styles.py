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


def formal_slugs(source: Path) -> list[str]:
    """The published index, excluding _template and unpublished directories."""
    listed = re.findall(r"\]\(([a-z0-9-]+)/STYLE\.md\)", (source / "styles/README.md").read_text())
    if len(listed) != len(set(listed)) or not listed:
        raise ValueError("Invalid published style index")
    return listed


def import_sources(source: Path, destination: Path, *, all_styles: bool = False) -> None:
    revision = subprocess.check_output(
        ["git", "-C", str(source), "rev-parse", "HEAD"], text=True
    ).strip()
    slugs = formal_slugs(source) if all_styles else list(SLUGS)
    old_lock = destination / "upstream-lock.json"
    previous = json.loads(old_lock.read_text()) if old_lock.exists() else {}
    if previous and previous["revision"] != revision:
        raise ValueError("Review the upstream revision change before replacing the existing source lock")
    records = {row["path"]: row for row in previous.get("files", [])}
    extra_engines = json.loads((destination / "native-sources.json").read_text())

    def copy(src: Path, dst: Path, adapted: bool = False) -> None:
        if src.is_symlink():
            raise ValueError(f"Refusing symlink: {src}")
        dst.parent.mkdir(parents=True, exist_ok=True)
        raw = src.read_bytes()
        changes = []
        if adapted:
            depth = len(dst.relative_to(destination).parts) - 1
            helper = "../" * depth + "shared/lib.js"
            raw = raw.replace(b"../../../core/lib.js", helper.encode())
            raw = raw.replace(b"/core/lib.js", helper.encode())
            post = "../" * depth + "vendor/core/three/post.js"
            raw = raw.replace(b"/core/three/post.js", post.encode())
            if src.name == "board.js":
                raw = raw.replace(b"const KIT = new URL('.', import.meta.url).pathname;", b"let KIT = new URL('.', import.meta.url).href;\n// OpenMontage: project-owned public asset root (objects/, fonts/).\nexport function setAssetBase(url) { KIT = new URL(url.endsWith('/') ? url : url + '/', location.href).href; }")
            changes.append("portable helper imports; board supports project-owned asset base")
            if src.parent.name == "watercolor" or (src.name == "engine.js" and src.parent.parent.name == "watercolor"):
                raw += b"\n// OpenMontage ES-module export of the original classic-script engine.\nexport {W,H,mulberry,withSeed,rnd,clamp,lerp,seg,ss,eio,eo,hash,vnoise,monotone,mk,drawS,drawList,sprite,clump,edgeOf};\n"
                changes.append("classic watercolor engine exposed as ES module")
            if src.name == "engine.js" and src.parent.parent.name == "pictogram-motion":
                raw += b"\n// OpenMontage ES-module access to the original G engine.\nexport default window.G;\n"
                changes.append("classic pictogram engine exposed as ES module")
        if src.suffix == ".txt":
            cleaned = re.sub(rb"[ \t]+(?=\r?$)", b"", raw, flags=re.MULTILINE)
            if cleaned != raw:
                changes.append("trailing whitespace trimmed; licence wording unchanged")
            raw = cleaned
        dst.write_bytes(raw)
        records[dst.relative_to(destination).as_posix()] = {
            "source": src.relative_to(source).as_posix(),
            "path": dst.relative_to(destination).as_posix(),
            "source_sha256": hashlib.sha256(src.read_bytes()).hexdigest(),
            "sha256": hashlib.sha256(raw).hexdigest(),
            "modification": "; ".join(changes) or "none",
        }

    copy(source / "LICENSE", destination / "LICENSE.lemo")
    copy(source / "core/lib.js", destination / "shared/lib.js")
    if all_styles:
        copy(source / "core/three/post.js", destination / "vendor/core/three/post.js")
    for slug in slugs:
        base = source / "styles" / slug
        pack = destination / slug
        copy(base / "STYLE.md", pack / "STYLE.md")
        copy(base / "DEMO.md", pack / "reference/DEMO.md")
        copy(base / "demo/CREDITS", pack / "reference/CREDITS")
        # Follow local ES imports so native drawing modules remain executable.
        pending = list(ENGINES.get(slug, extra_engines.get(slug, [])))
        seen = set()
        while pending:
            name = pending.pop()
            if name in seen:
                continue
            seen.add(name)
            src = base / "demo" / name
            if not src.resolve().is_relative_to((base / "demo").resolve()):
                raise ValueError(f"Engine import escapes demo: {slug}/{name}")
            copy(src, pack / "engine" / name, adapted=True)
            body = src.read_text()
            specs = re.findall(r'''(?m)^import\s+(?:[^;]*?from\s*)?["']([^"']+)["']''', body)
            specs += re.findall(r'''(?m)^export\s+(?:\*|\{[^}]*\})\s+from\s*["']([^"']+)["']''', body)
            for spec in specs:
                if spec.startswith(".") and "core/" not in spec:
                    dep = (src.parent / spec).resolve()
                    pending.append(dep.relative_to(base / "demo").as_posix())
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
        "formal_styles": formal_slugs(source),
        "files": sorted(records.values(), key=lambda row: row["path"]),
    }
    (destination / "upstream-lock.json").write_text(json.dumps(lock, ensure_ascii=False, indent=2) + "\n")
    print(f"Imported {len(slugs)} style packs, {len(records)} tracked source files at {revision}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--all", action="store_true", help="Import every published style, excluding _template")
    args = parser.parse_args()
    import_sources(args.source.resolve(), ROOT / "style-packs", all_styles=args.all)
