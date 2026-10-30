# Style Packs — Drawing Libraries

Use when selecting or producing a film with a named visual style, especially
finance data stories, mechanisms, research and news. This supplements the
existing pipeline; it does not select a provider, renderer, or approval policy.

## Mandatory planning entry

Every video run first follows `../meta/style-confirmation.md`, including
when no named pack has yet been selected. Catalog discovery and comparison
must precede a visual recommendation; a previously approved episode is one
candidate, not the default. Record comparison and approval in the planning
checkpoint's `style_confirmation` artifact. Explicit user choices do not
need another confirmation. Then use the selection mechanics below.

## Select and lock

Discover `style_pack` through the tool registry. `operation: catalog` lists
all 59 published Lemo styles and their content fit. The original 12 in groups
1–3 remain finance-priority choices; the 47 additions in group 4 are supporting
illustrative styles or specialist evidence treatments. Do not rank every
style equally for finance. `finance_fit`, `evidence` and `requires` describe
the additions' boundaries. See [full index](../../style-packs/CATALOG.md).
`inspect` returns the original
style directory, native engine entry, required evidence/runtime dependencies,
and versioned `selection`. Read that pack's `STYLE.md`, `FINANCE.md` and
`TECHNIQUES.md`. Recommend by content fit before checking availability.

Show the user a small shortlist with actual visual references when available.
The public upstream gallery is https://lemomo-ai.github.io/lemo-opuscar/;
our engineering specimens are not proof of final production quality.
Keep `playbook` for generic tokens, but don't flatten the selected pack into
palette YAML. Check every entry in `requires`; catalogue availability means
the library exists, not that imagery, GPU or dependencies are ready.

Copy the returned selection object to
`proposal_packet.production_plan.style_pack`. Record the choice in
`decision_log`, category `style_selection`, subject `Visual style pack`.
For changes append a decision using that same pair, update the approval
artifacts coherently, and obtain the existing gate's approval. Record any
palette, sound, layout or motion variants as explicit `overrides` on the
selection. Preserve it unchanged in `scene_plan.style_pack`,
`asset_manifest.style_pack`, `edit_decisions.style_pack`, and
`render_report.style_pack`. The renderer verifies identity/digest and rejects
silent changes. It cannot determine human approval or artistic quality.

## Plan pictures, then study the demo

Keep the existing research and script. Translate each beat into an actual
visual subject, change, framing, camera reason and transition in the pack's
language. First form your own treatment/shot plan; then consult
`reference/DEMO.md` and `reference/source/` only for techniques. Do not execute
the upstream film or substitute text into its timeline. Story, layout and
camera path belong to this film. Do not force a diagram film to use four
camera moves merely to meet a generic camera checklist.

Approved style engines, materials, projection and motion grammar are reusable
in atelier; finished film scenes and demo narratives are not. The selected
style takes precedence over generic scene presets: Swiss does not get spring
motion, a blueprint is not a glowing 3D HUD, a continuous diagram need not
switch subject every shot. Preserve coherence and avoid repeated layouts
that merely change the text.

## Author using the real engine

`materialize` copies ONLY the chosen engine, shared mechanics, guides and
licence and declared vendor support into a new project-local directory, e.g.
`projects/<id>/composition/drawing-library/`. It refuses to overwrite a
previous library. Pass `selection` to verify the approved digest. Reference
stories, sample media, score and voices are not included. Add the MIT notice
to the project's credits; third-party fonts and assets keep their licences.

Hand-author the project's own scene entry. Provide
`create(canvas) -> {render(seconds), dispose?}`, preload local fonts/assets
inside create, and make render seek-safe. See shared adapters:

- Remotion: `shared/RemotionDrawing.tsx`; pass a stable module-level create
  function; the component blocks rendering while initialization finishes.
- HyperFrames: `shared/hyperframes.js`; load GSAP locally and call
  `registerDrawing(gsap, compositionId, duration, draw)` **synchronously**.
  Register the timeline before async loading; redraw after assets are ready.
  Keep sized roots, clip/timing attributes and HF lint/validate/inspect.
- FFmpeg: consumes already rendered motion footage. A library does not
  change its capabilities into Canvas/WebGL composition.

Runtime comparison/approval remains the existing pipeline decision. No
automatic runtime switch or new production renderer is introduced here.
For bare `three` imports install `style-packs/package.json` dependencies in
the project or provide a local import map; do not rely on the donor checkout.

## Prove appearance and motion

At the existing scene/assets gates: render three key frames using FINAL
drawing code plus a 6–10 second continuous motion sample. Use the real
Chinese text, actual data and intended output dimensions. A portrait film
gets a new composition, not a scaled landscape canvas. Enforce the shared
social-ui-safe caption lane. For whiteboard Chinese, provide licensed stroke
data or explicitly use typeset annotations; a wipe is not handwriting.

Technical fixtures live under `style-packs/examples/`, not production. They
are always labelled synthetic. Archive, satellite, investigation and
photographic-board styles also need a real-source test before production
approval. Missing evidence is a blocker for that treatment, not permission
to generate fake historical scans or satellite pictures.

Review style fidelity AND originality separately. Judge material, type,
motion and camera against STYLE; judge structure/opening/signature/camera/
ending against the film's own purpose and the upstream example. Reject
generic cards in place of the selected visual techniques. Report adapter
limitations honestly (flat archive loupe lacks upstream photograph depth;
physical stacks currently lack HDRI/DOF). Respect persistent voice/no-BGM
defaults and the existing cover policy and finance ending sentence.

Engineering commands and acceptance evidence:
[Finance Style Packs](../../docs/FINANCE_STYLE_PACKS.md).
