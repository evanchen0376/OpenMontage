# Visual drawing libraries

All 59 published visual style packs adapted from
[Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar), pinned by
`upstream-lock.json`. Code/docs: MIT, original copyright notice in
`LICENSE.lemo`. Upstream example videos/stills use CC BY 4.0; none were
imported. Original per-demo `reference/CREDITS` describe the donor film,
not assets used by a new film. EMS Tech stroke font is OFL and carries its
metadata and licence under whiteboard/engine/fonts.

The first 12 (catalog groups 1–3) remain finance-priority choices. The other
47 (group 4) extend painting, print, cartoon, pixel, paper, 3D and documentary
techniques; `_template` is excluded. See [complete index](CATALOG.md) for
content fit, evidence requirements and native/adapted implementation status.

Each pack contains the original STYLE, a finance overlay, technique notes,
an executable drawing engine, and isolated reference-only demo code.
`catalog.json` is the discovery index. Never run reference demo code as a
user deliverable. `examples/` are synthetic engineering specimens, not
finished reusable scenes or factual finance videos.

Read [integration guide](../skills/core/style-packs.md) and
[validation/limitations](../docs/FINANCE_STYLE_PACKS.md). Runtime adapters
are in `shared/`. A project keeps its own story and drawing entry; the
library supplies mechanics and visual grammar.

`native-sources.json` lists the independently reusable native modules.
`vendor/` holds extracted inline techniques and shared Three postprocessing;
declared support is copied and hashed with the selected library. Full
reference films remain isolated. Canvas/WebGL fixture captures prove the
technique interface, not all original shots, licensed media or finished films.
