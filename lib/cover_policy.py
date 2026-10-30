"""Dual-cover delivery checks. Historical 1.0/1.1 packages remain readable."""
from pathlib import Path


def validate_cover_metadata(package: dict) -> None:
    if package.get("version") != "1.2":
        return
    assets = [package["primary_cover"], *package["variants"]]
    for field in ("id", "path", "aspect_ratio"):
        values = [asset[field] for asset in assets]
        if len(values) != len(set(values)):
            raise ValueError(f"Cover package needs distinct {field} values for each deliverable")
    for asset in assets:
        numerator, denominator = map(int, asset["aspect_ratio"].split(":"))
        if asset["width"] * denominator != asset["height"] * numerator:
            raise ValueError(f"Cover {asset['id']} dimensions do not match {asset['aspect_ratio']}")


def validate_cover_files(package: dict, project_dir: Path) -> None:
    if package.get("version") != "1.2":
        return
    from PIL import Image

    validate_cover_metadata(package)
    root = project_dir.resolve()

    def local_file(value: str) -> Path:
        file = (root / value).resolve()
        if not file.is_relative_to(root) or not file.is_file():
            raise ValueError(f"Cover file must exist inside project: {value}")
        return file

    for asset in [package["primary_cover"], *package["variants"]]:
        file = local_file(asset["path"])
        with Image.open(file) as image:
            if image.size != (asset["width"], asset["height"]):
                raise ValueError(f"Cover {asset['id']} actual dimensions differ from declared dimensions")
            image.verify()
        local_file(asset["visual_source"]["path"])
    local_file(package["visual_source"]["path"])
