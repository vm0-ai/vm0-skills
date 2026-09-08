# QA: accept or reject against the brief

A provider `completed` status, a rendered file, or a passing lint is a candidate, not acceptance. Compare the output with the brief, keep the evidence, and never repeat a billed job automatically.

## Inspect

- Probe the file: container, duration, dimensions, frame rate, audio tracks, decodability.
- Extract frames from the opening, the closing, each scene transition, every presenter shot, and every text-dense scene. Use `okou video frames --at ...` on the managed artifact URL or a local decode.
- Transcribe when wording, language, or silence matters: `okou video transcribe` gives timestamped segments. Verbatim mode and non-default languages always transcribe.
- Read the recorded request: `style_id`, `avatar_id`, `voice_id`, `orientation`, script mode, and the prompt actually submitted.

## Native gate

Reject when any item fails materially:

| Check | Pass condition |
| --- | --- |
| Duration | approximate: within about 30% of the target; flag anything above 1.5× because billing follows output seconds. Verbatim: within about 20% of the estimate made before submission |
| Presenter presence | matches the brief: on camera where the recipe says, or absent for `presenter: none` |
| Presenter framing | complete head with clear margin in every representative frame; no cropped face; no unsafe framing |
| Presenter scene | a real integrated background when the brief or style expects one; not an accidental isolated cutout or blank stage |
| Style | style-bearing scenes visibly reflect the selected style; the recorded `style_id` matches the selection (a matching ID alone does not prove adherence) |
| On-screen text | every `on_screen_text` string appears literally; text is readable at delivery size; no unreadable or clipped captions |
| Narration | in the brief's language; no long silences (transcript gaps or silent stretches over a few seconds); verbatim mode: the transcript matches the script sentence by sentence apart from pronunciation |
| Facts | numbers, names, and claims match the verified brief; nothing invented |
| Output | requested orientation and 1080p-class resolution; audio and video decode cleanly |

## Controlled gate

Everything above that applies, plus: every required page or segment present, in order, unstretched and uncropped; no covered text; no duplicate audio from a presenter take; original audio retained when required; the transparent presenter take has real alpha and fits without cropping essential content.

## When it fails

Retain the generation, session, and video IDs and the artifact as evidence. Report the unmet requirements in plain words and what would change on a retry. Do not deliver it as polished, do not submit another paid job, and do not switch routes; obtain the user's direction and, for a materially different or paid retry, their authorization. A retry never reuses the identical prompt.
