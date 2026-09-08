# Prompt compiler: from brief to one native prompt

The prompt is HeyGen Video Agent's whole content interface. `style_id`, `avatar_id`, `voice_id`, and `orientation` travel as parameters; everything else below is prompt text. Assemble it once from the cached brief, in this order, and keep it under 10,000 characters. This file is the only home of the fixed English literals.

## Assembly order

1. **Format line** (English, one sentence): kind of video, target length, orientation, narration language, audience. Example: `Create a 60-second landscape (16:9) product launch video. Narration language: Simplified Chinese. Audience: operations managers at small and mid-sized companies.` In verbatim mode replace the length with `The narration length follows the script below.`
2. **Content** (narration language): the script, or the key messages in arc order. Adapt mode labels the block `Key messages (the narrative to convey, not a verbatim script):`. Verbatim mode labels it `Script (narrate exactly as written):`.
3. **Tone line** (English): `Tone: ...` using the brief's tone.
4. **Presenter line** (English): `The selected presenter ...` describing delivery and where the presenter appears in the arc, or the voice-over-only line. Never describe the presenter's appearance.
5. **Attachment anchoring** (English), one sentence per `show` attachment: `Use the attached <what> as B-roll when <topic>.` `Display the attached logo in the intro and the end card.` An attachment without a usage sentence is ignored by the agent.
6. **`CRITICAL ON-SCREEN TEXT (display literally):`** followed by one quoted string per line from `on_screen_text`. Without this block the agent rephrases numbers and quotes.
7. **Production guidance** (English, only lines that change the result): media types by content (`Use motion graphics for the statistics; use the attached screenshot rather than stock footage for the product; use stock footage for the office scene.`), brand colors as hex, logo placement, and always the text legibility line below. With a `style_id` there is no style paragraph; add a style paragraph only for a user-requested override, using the anatomy below.
8. **Directives block** (English literals, verbatim): the script-mode directive (the source-only variant when `facts: source-only`); the translation-ready framing when the user plans to translate or asked for a direct-to-camera message; the pronunciation hint for brand names that a transcript is likely to misspell.
9. **Presenter corrections** (English literals, verbatim, always last), chosen by the look's classification: a `photo_avatar` with a real environment gets no BACKGROUND NOTE and a FRAMING NOTE only when its orientation does not match the output; a `studio_avatar`, a `digital_twin`, or any transparent, solid, or empty preview gets the BACKGROUND NOTE, plus the FRAMING NOTE when `cropRisk` is high.

## Fixed literals

**Script-freedom directive** (adapt mode, exactly once):

```text
This script is a concept and theme to convey — not a verbatim transcript. You have full creative freedom to expand, elaborate, add examples, and fill the duration naturally. Do not pad with silence or pauses.
```

**Source-only expansion directive** (adapt mode with `facts: source-only`; replaces the script-freedom directive, because "add examples" invites invented details):

```text
This script is a concept and theme to convey — not a verbatim transcript. Expand it only by restating or connecting the facts above, and fill the duration naturally. Every number, name, label, example, and interface detail on screen must come from the key messages or the CRITICAL ON-SCREEN TEXT list. Do not pad with silence or pauses.
```

**Text legibility line** (production guidance, every prompt with on-screen text):

```text
Place every on-screen text on a solid or semi-opaque high-contrast panel, dark text on a light panel or white text on a dark panel, large enough to read at the delivery size.
```

**Pronunciation hint** (experimental; one line per brand term, in the directives block):

```text
Pronounce "Okou" as "oh-koh".
```

**Verbatim directive** (verbatim mode, exactly once; never together with the freedom directive):

```text
SCRIPT MODE: verbatim. Narrate the script above exactly as written, sentence by sentence and in order, without adding, removing, or rephrasing sentences. Let the video's length follow the script and keep the pacing natural.
```

**Voice-over-only line** (`presenter: none`):

```text
Voice-over narration only, with no on-screen presenter. Carry the story with motion graphics, the attached material, and footage.
```

**Translation-ready framing** (when the video will be translated or the user wants a direct-to-camera message):

```text
This is a direct-to-camera message. Think of it like a FaceTime call — one person, one camera, sincere eye contact throughout. The presenter should be visible and speaking for the entire video.
```

**BACKGROUND NOTE** (preview is transparent, solid, or visually empty):

```text
BACKGROUND NOTE: The selected avatar has no background or a transparent backdrop. Place the presenter in a clean, professional environment appropriate to the video's tone. For business/tech content: modern studio with soft lighting and subtle depth. For casual content: bright, minimal space with natural light. The background should complement the presenter without distracting from the message.
```

**FRAMING NOTE, square or portrait look → landscape output** (write `square (1:1)` or `portrait` for the source):

```text
FRAMING NOTE: The selected avatar image is in square (1:1) orientation but this video is landscape (16:9). Frame the presenter from the chest up, centered in the landscape canvas. Use AI Image tool to generative fill to extend the scene horizontally with a complementary background environment that matches the video's tone (studio, office, or contextually appropriate setting). Do NOT add black bars or pillarboxing. The avatar should feel natural in the 16:9 frame.
```

**FRAMING NOTE, square or landscape look → portrait output** (write `square (1:1)` or `landscape` for the source):

```text
FRAMING NOTE: The selected avatar image is in square (1:1) orientation but this video is portrait (9:16). Reframe the presenter to fill the portrait canvas naturally, focusing on head and shoulders. Use AI Image tool to generative fill to extend vertically if needed. Do NOT add letterboxing. The avatar should fill the portrait frame comfortably.
```

A look is near-square when `max(width, height) < 1.10 × min(width, height)`; treat it as square. These notes guide the agent; `POST /v3/video-agents` has no background, crop, scale, position, or safe-area fields, so never claim deterministic control. On 2026-09-08 they did not change the result for `studio_avatar` looks: three styles placed the cutout on a plain white stage and two near-square looks were still cropped, which is why the presenter capability check runs before submission and QA treats these outcomes as provider-control gaps.

## Hard rules

- Positive framing. Describe what to show; do not list what to avoid. Restrictive instructions make the agent play safe.
- No per-scene timestamps and no layout coordinates; both degrade delivery or produce blank frames. Describe B-roll with motion verbs (counts up, slides in, draws itself) when a description is needed at all.
- With `avatar_id`, say "the selected presenter"; never describe hair, clothing, gender, or age.
- One topic per video. Split multi-topic requests into separate videos rather than one long prompt.
- Narration and on-screen strings in the brief's language; every directive, note, and production line in English.
- Do not restate the style in prose when a `style_id` is passed. Do not duplicate the duration in verbatim mode.
- Keep each CRITICAL string to at most 6 words or one figure plus a label. Long strings were split across several cards in a real run; short ones rendered literally. Source citations and full sentences belong to narration, not to the literal list.
- Over 10,000 characters: compress key messages and attachment sentences first; never drop directives, on-screen text, or a verbatim script. If a verbatim script alone exceeds the limit, the request is a controlled-route job.

## Style paragraph anatomy (overrides only)

When the user asks for a look beyond the selected style (brand colors, a named treatment), add one short paragraph after the production guidance: a name for the look, the exact palette as hex codes, the art direction, how things move, the transitions, and one closing line for the mood. Five or six sentences; the agent follows it literally because scenes are built in code.

House defaults for any authored override: colors derived from the subject or brand rather than a fixed accent; text large enough to read at the delivery size with no small caption strings; every text-over-background pair at contrast ratio 4.5 or higher; composition and color varied across scenes so the video does not read as one card repeated.

## Worked example

Brief: `product-launch`, 60 s, landscape, zh-CN narration, adapt mode with `facts: open`, selected style and a `studio_avatar` look (square, transparent preview), one dashboard screenshot and one logo attached. The look classification adds both notes at the end.

```text
Create a 60-second landscape (16:9) product launch video. Narration language: Simplified Chinese. Audience: operations managers at small and mid-sized companies.

Key messages (the narrative to convey, not a verbatim script):
- 每周一早上，运营负责人要花两小时从五个系统里拼一份周报。
- Okou 智能周报把这两小时变成两分钟：连上你的表格和看板，自动生成可直接发送的周报。
- 上线首月，试用团队平均每周省下 1.8 小时。
- 现在可以免费试用 14 天。

Tone: confident and conversational, like a founder demoing to a peer.

The selected presenter opens and closes on camera and hands off to product visuals in the middle.

Use the attached dashboard screenshot as B-roll when describing the automatic report. Display the attached logo in the intro and the end card.

CRITICAL ON-SCREEN TEXT (display literally):
- "两小时 → 两分钟"
- "每周省下 1.8 小时"
- "免费试用 14 天"
- "okou.ai"

Use motion graphics for the time-saving statistics and the end card. Use the attached screenshot rather than stock footage for the product. Place every on-screen text on a solid or semi-opaque high-contrast panel, dark text on a light panel or white text on a dark panel, large enough to read at the delivery size.

This script is a concept and theme to convey — not a verbatim transcript. You have full creative freedom to expand, elaborate, add examples, and fill the duration naturally. Do not pad with silence or pauses.

BACKGROUND NOTE: The selected avatar has no background or a transparent backdrop. Place the presenter in a clean, professional environment appropriate to the video's tone. For business/tech content: modern studio with soft lighting and subtle depth. For casual content: bright, minimal space with natural light. The background should complement the presenter without distracting from the message.

FRAMING NOTE: The selected avatar image is in square (1:1) orientation but this video is landscape (16:9). Frame the presenter from the chest up, centered in the landscape canvas. Use AI Image tool to generative fill to extend the scene horizontally with a complementary background environment that matches the video's tone (studio, office, or contextually appropriate setting). Do NOT add black bars or pillarboxing. The avatar should feel natural in the 16:9 frame.
```
