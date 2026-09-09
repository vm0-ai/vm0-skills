# QA: accept or reject against the brief

A provider `completed` status, a rendered file, or a passing lint is a candidate, not acceptance. Compare the output with the brief, keep the evidence, and never repeat a billed job automatically.

## Inspect

- Probe the file: container, duration, dimensions, frame rate, audio tracks, decodability.
- Extract frames from the opening, the closing, each scene transition, every presenter shot, and every text-dense scene. Use `okou video frames --at ...` on the managed artifact URL or a local decode.
- Transcribe when wording, language, silence, or brand names matter: `okou video transcribe` gives timestamped segments. Verbatim mode, non-default languages, and briefs with brand terms always transcribe.
- Read the recorded request: `style_id`, `avatar_id`, `voice_id`, `orientation`, script mode, the look classification from the capability check, and the prompt actually submitted.

## Two tiers

**Tier A, brief violations.** Something the prompt or route controls went wrong. Reject the output and report what a corrected prompt or route would change.

**Tier B, provider-control gaps.** The requirement was met as far as the prompt can carry it, and HeyGen's API has no field to enforce it. Deliver the file with an explicit warning, the frames as evidence, and the sentence "a retry with the same prompt will not change this"; offer the concrete alternatives (another look, the controlled route, or acceptance). Never call it polished. If the brief had marked the property as a hard requirement, the capability check should have routed away before payment; report it as an accepted risk that materialized, not as a skill defect.

## Native gate

| Check | Pass condition | Tier on failure |
| --- | --- | --- |
| Narration language | in the brief's language | A |
| Facts | numbers, names, labels, headings, counts, and interface details match the verified brief; an invented statistic or label is a failure even when the narration is right | A |
| On-screen text | every `on_screen_text` string appears literally; readable at delivery size on a contrasting panel | A |
| Brand names | the transcript spells brand terms correctly or the mispronunciation is recorded in the report | A when a hint was omitted, B when the hint was present |
| Presenter presence | matches the brief: on camera where the recipe says, or absent for `presenter: none` | A |
| Orientation | requested landscape or portrait | A |
| Decode | audio and video decode cleanly; no long silences (transcript gaps over a few seconds) | A |
| Duration, approximate | 0.8× to 1.4× the target passes; 1.4× to 1.75× is B with the billing impact stated; above 1.75× or below 0.8× is A | A or B as stated |
| Duration, verbatim | within about 20% of the pre-submission estimate | A |
| Resolution | at least 1280×720 landscape or 720×1280 portrait; record the actual value. 1080p is a gate only on the controlled route or when the provider exposes a resolution field | B when below the baseline |
| Presenter scene | a real integrated background when the brief or style expects one | A when the prompt lacked the presenter sentences, the script-freedom directive, or the BACKGROUND NOTE; B when the full prompt was present and the look is transparent, solid, or empty (`scene: any`); A for a `photo_avatar` with an environment |
| Presenter framing | complete head with clear margin in every representative frame | A when the prompt lacked the head sentence, the directive, or the FRAMING NOTE; B when the full prompt was present and `cropRisk` was high (`framing: any`) |
| Style | style-bearing scenes visibly reflect the selected style; the recorded `style_id` matches the selection (a matching ID alone does not prove adherence) | A |

## Controlled gate

Everything above that applies, plus: every required page or segment present, in order, unstretched and uncropped; no covered text; no duplicate audio from a presenter take; original audio retained when required; the transparent presenter take has real alpha and fits without cropping essential content; the composition renders at the resolved 1920×1080 or 1080×1920. On this route presenter scene, framing, and resolution are Tier A because Okou controls them.

## When it fails

Retain the generation, session, and video IDs and the artifact as evidence. Report each failed check with its tier and what would change on a retry. Do not deliver a Tier A failure as polished, do not submit another paid job, and do not switch routes; obtain the user's direction and, for a materially different or paid retry, their authorization. A retry never reuses the identical prompt.
