# Production Style Confirmation

Apply inside the first `idea` or `proposal` stage of every video production.
This is part of the existing planning gate, not an extra pipeline stage.
Article derivatives and infrastructure smoke tests do not use this contract.

## Separate the decisions

Treat these as independent: visual style (materials, drawing, typography,
camera and motion), coverage (composition/hybrid/footage), output format
(ratio, resolution, fps, container), authoring mode, and rendering runtime.
Remotion and HyperFrames are not visual styles. An old project establishes
history, not approval for a new run. Inherit persistent voice/no-BGM choices
from config; do not silently inherit an episode's visual style or ratio.

## Discover before recommending

1. Read the current brief/script and identify the main visual responsibility:
   relationships, physical actions, numerical reasoning, evidence, or mood.
   A locked script stays locked; style exploration does not reopen its wording.
2. Read `core/style-packs.md`; discover `style_pack` in the registry and call
   `catalog`. Consider the complete current catalog, not just compatible
   playbooks, installed engines or styles used before.
3. Also inspect relevant `styles/*.visual-style.md`, series references and
   user-supplied choices. Distinguish approved styles from unapproved specimens.
4. Form a shortlist by content fit BEFORE checking runtime/provider readiness.
   For an open choice compare at least three materially different visual
   grammars. For an explicit user choice or a source-preserving edit, honor it
   and record `mode: explicit_choice` or `preserve_source`; do not force an
   unrelated redesign or another selection round.
5. For shortlisted packs call `inspect`, then read STYLE, FINANCE and
   TECHNIQUES. Explain both the benefit and the limitation for THIS script.
   Show how each candidate handles real beats, not merely a palette change.
   Link actual references when available; label existing examples and static
   specimens accurately. Do not call an engineering fixture a finished sample.
6. Recommend one principal visual grammar, then check its evidence, font and
   runtime needs. Keep unavailable high-fit choices visible. Do not choose
   whatever happens to run first or silently mix incompatible styles.

## Record and confirm at the existing gate

Write `artifacts/style_confirmation.json` against
`schemas/artifacts/style_confirmation.schema.json`, and embed it alongside
the canonical `brief`/`proposal_packet` in the planning checkpoint.

Record discovery sources/count, comparison candidates, references, concrete
beat examples, limitations, runtime requirements and recommendation. Save
the versioned `selection` returned by `inspect` in each pack candidate.
Recommendation is not approval: `approval.status` stays `pending` until the
user chooses. Record the actual confirmation quote and candidate ID when
approved. An explicit choice in the incoming request already counts; do not
ask again. Record format and its approval evidence separately. A single
reply can approve the complete presented proposal, style and format.

Log `category: style_selection`, `subject: Visual style pack` with the real
shortlist. Set `user_approved` truthfully. On a change append the decision
using the same category/subject pair. After approval carry the selected
pack's version identity through the existing canonical artifacts, following
`core/style-packs.md`. Do not lock the recommendation into `style_pack` while
approval is pending. For series/custom styles retain the file reference and
the approved material/motion rules rather than inventing a pack identity.

New projects are marked `style_confirmation_required` by `init_project`.
Checkpoint writing refuses a reviewable planning result without a comparison,
completion without style/format approval, and downstream work before that
planning checkpoint is approved. Legacy projects are not retroactively
re-gated; when the user requests a visual redesign, explicitly set that
project marker to true and return to planning, preserving historical outputs.

## Downstream proof

After planning approval, follow the existing scene/assets gates: three actual
key frames and a 6–10 second continuous sample from the final drawing code,
using real project text and intended dimensions. A full render waits for
the existing assets approval. A style assessment request alone does not
authorize batch generation. Preserve audio defaults and exact-text policies.

Reviewer checks: discovery happened; comparison uses actual script beats;
new libraries were considered; approval is project-specific; format is not
inferred from the style/renderer; selected grammar survives implementation.
