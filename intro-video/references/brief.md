# The brief: one structure for every input

Every request, whether a one-line prompt or a folder of mixed files, is normalized into this brief before routing. The prompt compiler reads only the brief; nothing is inferred twice.

```yaml
intent: product-launch          # one recipe id from recipes.md
audience: ""                    # who watches, in the user's words
language: zh-CN                 # narration and on-screen text
duration:
  target_seconds: 60
  tolerance: approximate        # approximate | exact (exact selects the controlled route)
tone: ""                        # two to four plain adjectives or a comparison ("like a founder demoing to a peer")
frame:                          # narrative frame; fill or waive each with a reason
  claim: ""                     # the one sentence the video exists to say
  conflict: ""                  # why it matters now / what is wrong today
  turn: ""                      # what changes
  proof: ""                     # the verifiable evidence (numbers, names, sources)
  ask: ""                       # the one action the viewer takes
key_messages: []                # verified facts only, each traceable to the request or a source
on_screen_text: []              # strings that must appear literally (numbers, quotes, URLs, CTA)
script:
  mode: adapt                   # adapt | verbatim
  text: ""                      # user-supplied script when present
presenter: { avatar_id: "", group_id: "", preview: { width: 0, height: 0, background: real } }   # or none
voice: default                  # default | { voice_id } | auto | original | none
orientation: landscape          # landscape | portrait
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
| duration | a number in the request | the recipe default | the volume of verified material, capped by the recipe range |
| language | language of the request text | language of the source material | account locale |
| orientation | explicit `16:9` / `9:16` | destination named in the request (Reels, TikTok, Shorts → portrait; YouTube, web, LinkedIn, sales, internal → landscape) | landscape |
| tone | user wording | recipe default | "confident and conversational" |
| audience | user wording | inferred from material | the recipe's audience |

Duration is written into the prompt as an approximate target. In verbatim mode the duration follows the script: estimate it from the script length with the calibration values below, record the estimate, and do not state a different target.

| Narration language | Initial pace for estimates |
| --- | --- |
| English | about 150 words per minute |
| Chinese | about 220 characters per minute |

These are starting values. Re-calibrate from real transcripts of accepted outputs rather than tuning the prompt.

## Mapping the entry form

The form's configuration block maps one-to-one onto the brief:

| Form line | Brief |
| --- | --- |
| `HeyGen style: <name> (<id>)` | `style.style_id` exact; `style.aspect_ratio` from the metadata line |
| `HeyGen style: Let Okou choose` | resolve a concrete public style through catalogs.md; record the reason |
| `Avatar: <name> (<look id>)` plus group / default voice lines | `presenter.avatar_id`, `presenter.group_id`; preview dimensions and background from the catalog preflight |
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

## Script mode cues

Set `script.mode: verbatim` only when the user says the wording must not change: 逐字, 照读, 一字不改, "word for word", "exactly as written", "approved copy", "legal text", or pastes a script and asks to "use this script" without inviting edits. A pasted draft with "something like", "based on", "polish", or 参考 stays `adapt`.

## Attachment roles

Decide each file's role from its content and the request, then prepare it per [input preparation](input-preparation.md):

- `show`: the viewer must see it (screenshots, logo, product photos, charts, chosen slides). Prepare a supported reference and write its usage into the brief (`usage: "B-roll when describing the dashboard"`).
- `context`: the information matters, not the pixels (documents, transcripts, web pages, spreadsheets). Extract verified facts into `key_messages`; do not attach.
- `both`: long visual documents; attach the PDF and extract the key points.

A request to keep pages, frames, footage, audio, or timing exactly sets `preservation` and therefore the controlled route. Never fabricate content for an inaccessible source; name the gap instead.
