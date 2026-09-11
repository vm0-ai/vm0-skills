# The brief: one structure for every input

Every request, whether a one-line prompt or a folder of mixed files, is normalized into this brief before routing. The prompt compiler reads only the brief; nothing is inferred twice.

```yaml
intent: product-launch          # one recipe id from recipes.md
audience: ""                    # who watches, in the user's words
language: zh-CN                 # narration and on-screen text
duration:
  narration_seconds: 47         # the drafted narration measured at the calibrated pace
  target_seconds: 50            # derived from narration_seconds, rounded, inside the recipe band
  tolerance: approximate        # approximate | exact (exact selects the controlled route)
tone: ""                        # two to four plain adjectives or a comparison ("like a founder demoing to a peer")
frame:                          # narrative frame; fill or waive each with a reason
  claim: ""                     # the one sentence the video exists to say
  conflict: ""                  # why it matters now / what is wrong today
  turn: ""                      # what changes
  proof: ""                     # the verifiable evidence (numbers, names, sources)
  ask: ""                       # the one action the viewer takes
key_messages: []                # verified facts only, each traceable to the request or a source
on_screen_text: []              # strings that must appear literally; each at most 6 words or one figure plus a label
script:
  mode: adapt                   # adapt | verbatim
  text: ""                      # user-supplied script when present
presenter:                      # or none
  avatar_id: ""
  group_id: ""
  avatar_type: studio_avatar    # studio_avatar | photo_avatar | digital_twin, from the form or the catalog
  preview: { width: 0, height: 0, environment: real }   # environment: real | transparent | solid | empty
  scene: any                    # any | integrated (a real environment behind the presenter is a hard requirement)
  framing: safe                 # safe (default: the complete head with margin is always required) | any (only when the user explicitly accepts cropping)
facts: open                     # open | source-only (only facts from the request and sources may appear)
voice: default                  # default | { voice_id } | auto | original | none
orientation: landscape          # landscape | portrait
output:
  min_resolution: 720p          # 720p (native baseline) | 1080p (hard; selects the controlled route)
style: { style_id: "", aspect_ratio: "" }   # always concrete on the native route
brand: { colors: [], fonts: [], logo_file: null }
attachments:
  - { file: "", role: show, usage: "" }     # role: show | context | both
preservation: none              # none | pages | frames | audio | timeline
```

## Inference order

The entry form never asks for intent, duration, language, tone, or CTA. Infer each in this order and record the source of the value; never leave a field for HeyGen to guess.

| Field | 1st | 2nd | 3rd |
| --- | --- | --- | --- |
| intent | explicit words in the request ("launch video", "介绍公司", "onboarding") | dominant attachment (deck of a product → launch; syllabus → course) | `explainer` |
| duration | a number in the request | the drafted narration measured at the calibrated pace, rounded to the nearest 5 seconds and kept inside the recipe range | the recipe default |
| duration.tolerance | "正好", "恰好", "精确", "exactly", "must be", or a length tied to a slot, platform cap, or contract → exact, which selects the controlled route | | approximate; a round number the user named is still approximate |
| language | language of the request text | language of the source material | account locale |
| orientation | explicit `16:9` / `9:16` | destination named in the request (Reels, TikTok, Shorts → portrait; YouTube, web, LinkedIn, sales, internal → landscape) | landscape |
| tone | user wording | recipe default | "confident and conversational" |
| audience | user wording | inferred from material | the recipe's audience |
| presenter.scene | "必须有背景", "真实环境", "不要抠像", "in an office/studio" → integrated | | any |
| presenter.framing | always safe unless the user explicitly accepts cropping ("裁一点没关系", "crop is fine") → any | | safe |
| facts | "只用给定事实", "不要补充", "source only", attached report as the sole source → source-only | | open |
| output.min_resolution | "1080p", "full HD", broadcast use → 1080p | | 720p |

Duration and narration are decided together, in both modes: draft the narration first, measure it with the calibration below, record the result as `narration_seconds`, and derive `target_seconds` from it. A recipe's duration entry is the band the finished video should land in, not a menu to pick from; never fix the target at a band's low end and then write more narration than that target holds. A number the user actually asked for is the one exception, and then the narration is cut to fit it.

| Narration language | Initial pace for estimates | Narration budget per 60 seconds of target |
| --- | --- | --- |
| English | about 150 words per minute | about 120–130 words |
| Chinese | about 220 characters per minute | about 175–190 characters |

The budget is below the raw pace on purpose: the opening, the scene changes, the pauses, and the end card consume roughly a fifth of the timeline, and narration written to the raw pace has nowhere to land.

In adapt mode the drafted narration must fit within the budget for `target_seconds`. When it does not, cut key messages until it does, or raise the target if the recipe band allows; a brief whose narration exceeds its target is never submitted. HeyGen resolves that conflict itself by compressing and cutting, and the sentence it drops is the last one — the ask or the recap.

The budget is a band, not a ceiling, so a narration well short of it is also a mismatch. With a target you derived, lower it to the narration. With a duration the user fixed, the material has to cover it: `facts: open` lets the agent expand to fill the length, but under `facts: source-only` it may only restate the source, so a thin source cannot reach a long target. Say that before submitting — the material supports about this many seconds, so either shorten the duration or allow facts beyond the source — and let the user choose. Do not pad, invent facts, or submit a narration you already know is short: it renders under the QA duration floor with the ending intact but the video hollow.

In verbatim mode the duration follows the script: estimate it from the script length at the pace above, record the estimate as both `narration_seconds` and the expected length, and do not state a different target.

These are starting values. Re-calibrate from real transcripts of accepted outputs rather than tuning the prompt.

## Mapping the entry form

The form's configuration block maps one-to-one onto the brief:

| Form line | Brief |
| --- | --- |
| `HeyGen style: <name> (<id>)` | `style.style_id` exact; `style.aspect_ratio` from the metadata line |
| `HeyGen style: Let Okou choose` | resolve a concrete public style through catalogs.md; record the reason |
| `Avatar: <name> (<look id>)` plus group / default voice lines | `presenter.avatar_id`, `presenter.group_id`; `avatar_type`, preview size, and preferred orientation from the form's `HeyGen avatar type` / `preview size` / `preferred orientation` lines when present, otherwise from the catalog preflight |
| `Avatar: No avatar` | `presenter: none`; native prompt carries the voice-over-only line |
| `Avatar: Auto` (older form revision) | resolve to one concrete public look; never submit without `avatar_id` |
| `Voice: Default — follow <avatar> (<voice id>)` | `voice: default` → that look's actual default voice ID |
| `Voice: <name> (<id>)` | exact `voice_id` |
| `Voice: Let Okou choose` | a public voice filtered by `language` |
| `Voice: Original audio` | `voice: original`, `preservation: audio` → controlled route |
| `Voice: No voiceover` | `voice: none` → controlled route (no added narration; source audio kept unless the user asks to mute) |
| `Aspect ratio: 16:9` / `9:16` | `orientation` |
| `Aspect ratio: Auto` | infer per the table above |
| `Source: <file> (<kind>)` | one `attachments[]` entry after inspection; `kind` is a hint, not the role |
| `User request:` | intent, audience, language, duration, tone, key messages, on-screen text, script, preservation, brand |

`silent` anywhere in the request means no audio track at all and also selects the controlled route.

A hard `scene: integrated`, `framing: safe`, or `min_resolution: 1080p` is resolved before any paid submission by the presenter capability check in SKILL.md; it never becomes a post-render surprise.

## Script mode cues

Set `script.mode: verbatim` only when the user says the wording must not change: 逐字, 照读, 一字不改, "word for word", "exactly as written", "approved copy", "legal text", or pastes a script and asks to "use this script" without inviting edits. A pasted draft with "something like", "based on", "polish", or 参考 stays `adapt`.

## Attachment roles

Decide each file's role from its content and the request, then prepare it per [input preparation](input-preparation.md):

- `show`: the viewer must see it (screenshots, logo, product photos, charts, chosen slides). Prepare a supported reference and write its usage into the brief (`usage: "B-roll when describing the dashboard"`).
- `context`: the information matters, not the pixels (documents, transcripts, web pages, spreadsheets). Extract verified facts into `key_messages`; do not attach.
- `both`: long visual documents; attach the PDF and extract the key points.

A request to keep pages, frames, footage, audio, or timing exactly sets `preservation` and therefore the controlled route. Never fabricate content for an inaccessible source; name the gap instead.
