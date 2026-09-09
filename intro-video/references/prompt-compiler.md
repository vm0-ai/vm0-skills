# Prompt compiler: from brief to one native prompt

The prompt is HeyGen Video Agent's whole content interface. `style_id`, `avatar_id`, `voice_id`, and `orientation` travel as parameters; everything below is prompt text. Assemble it once from the cached brief, in this order, and keep it short: a presenter video stays under about 1,700 characters, any prompt under 10,000. This file is the only home of the fixed English literals.

## Skeleton

```text
<brief paragraph>
<presenter adaptation directive, for any look without a baked-in environment>

Narration:
“<script, or one narration paragraph written from the key messages, in the narration language>”

CRITICAL ON-SCREEN TEXT (display literally):
- "<at most 6 words or one figure plus a label>"

<one usage sentence per attached file the viewer must see>
<production lines that change the result, ending with the text legibility line>

<script-mode directive>
<pronunciation hints>
<translation-ready framing, only when requested>

<FRAMING NOTE, only when triggered>
<BACKGROUND NOTE, only when triggered>
```

## Why the skeleton looks like this

- A controlled ablation on the direct video endpoint isolated the mechanism behind a cropped head: a raw near-square studio look fitted to the frame width (`cover`) loses the top of the head, the same look fitted inside the frame (`contain`) keeps it, a landscape look with a baked-in environment keeps it under either fit, the environment always comes from the look image, and switching the engine between Avatar III and Avatar IV changes nothing. Video Agent exposes no fit field. Its scene composition (`GET /v3/videos/{id}/scenes`) shows that good presenter scenes used a landscape look the agent derived during planning, and bad ones used the raw studio look on a plain color background filled to the width. The presenter sentences make the agent plan that derivation; the adaptation directive asks for it by name and tells the agent to keep the presenter inside the frame.
- The script-mode directive keeps the agent composing instead of assembling; prompts without it, and long scene-by-scene prompts with `Media:` blocks, revert to the cutout, the cropped head, and invented on-screen details.
- The FRAMING NOTE and BACKGROUND NOTE describe the correction the agent should make; on their own they are ignored, together with the sentences and the directive they are followed.
- One narration paragraph, one length, one topic: every extra structure is a chance for the agent to fall back to templates.

## Slots

1. **Brief paragraph** (English). One format sentence: kind of video, one approximate length, orientation, narration language, audience; in verbatim mode say `The narration length follows the script below.` instead of a length. Then, for a presenter run, the three presenter sentences below in that order; for `presenter: none`, the voice-over-only line. Optionally one placement sentence (`The selected presenter opens and closes on camera.`). Never describe the presenter's appearance. For any look without a baked-in environment (`studio_avatar`, `digital_twin`, or a transparent, solid, or empty preview) add the presenter adaptation directive as its own paragraph right after the brief paragraph, with the output orientation filled in.
2. **Narration** (narration language). Adapt mode: `Narration:` followed by the script or one flowing paragraph composed from the key messages in arc order, in quotation marks; no scene labels or timestamps below 60 seconds, one short line per scene above 60 seconds. Verbatim mode: `Script (narrate exactly as written):` followed by the script unchanged.
3. **CRITICAL ON-SCREEN TEXT** block: one quoted string per line from `on_screen_text`. Without it the agent rephrases numbers and quotes; long strings get split across cards.
4. **Attachment sentences** (English), one per `show` attachment: `Use the attached <what> as B-roll when <topic>.` `Display the attached logo in the intro and the end card.` An attached file without a usage sentence is ignored.
5. **Production lines** (English, only what changes the result): media types by content (`Use motion graphics for the statistics; use the attached screenshot rather than stock footage for the product.`), brand colors as hex, logo placement, then always the text legibility line. No style paragraph when a `style_id` is passed; the style is named once in the brief paragraph.
6. **Directives** (English literals, verbatim): the script-mode directive (adapt, source-only, or verbatim), one pronunciation hint per brand term a transcript would misspell, and the translation-ready framing when the user plans to translate or asked for a direct-to-camera message.
7. **Presenter notes** (English literals, verbatim, always last, FRAMING before BACKGROUND), chosen from the look classification in [catalogs](catalogs.md): `photo_avatar` with a real environment gets no BACKGROUND NOTE and a FRAMING NOTE only when its orientation does not match the output; `studio_avatar`, `digital_twin`, or any transparent, solid, or empty preview gets the FRAMING NOTE when `cropRisk` is high, then the BACKGROUND NOTE.

## Fixed literals

**Presenter sentences** (brief paragraph, every presenter run; fill the placeholders, keep the wording):

```text
The selected presenter delivers the narration in a <tone> tone. Use the selected <style name> style. Keep the entire head and hair visible in every presenter shot.
```

**Presenter adaptation directive** (own paragraph after the brief paragraph; every look that is not already a landscape or portrait image with a real environment; fill in `16:9 landscape` or `9:16 portrait`; never name an engine):

```text
Before building any scene, adapt the selected presenter into a natural <16:9 landscape> studio framing: create an AI-extended <16:9> version of the selected presenter with the entire head, hair, and shoulders inside the image and a complementary professional environment behind them, wait until that extended presenter is ready, and use it in every presenter scene. Fit the presenter entirely inside the frame; never fill the frame width with the original cutout or place it on a plain background.
```

**Voice-over-only line** (`presenter: none`):

```text
Voice-over narration only, with no on-screen presenter. Carry the story with motion graphics, the attached material, and footage.
```

**Text legibility line** (last production line, every prompt with on-screen text):

```text
Place every on-screen text on a solid or semi-opaque high-contrast panel, dark text on a light panel or white text on a dark panel, large enough to read at the delivery size.
```

**Script-freedom directive** (adapt mode with `facts: open`, exactly once):

```text
This script is a concept and theme to convey — not a verbatim transcript. You have full creative freedom to expand, elaborate, add examples, and fill the duration naturally. Do not pad with silence or pauses.
```

**Source-only expansion directive** (adapt mode with `facts: source-only`, exactly once, instead of the freedom directive):

```text
This script is a concept and theme to convey — not a verbatim transcript. Expand it only by restating or connecting the facts above, and fill the duration naturally. Every number, name, label, example, and interface detail on screen must come from the key messages or the CRITICAL ON-SCREEN TEXT list. Do not pad with silence or pauses.
```

**Verbatim directive** (verbatim mode, exactly once, never with either directive above):

```text
SCRIPT MODE: verbatim. Narrate the script above exactly as written, sentence by sentence and in order, without adding, removing, or rephrasing sentences. Let the video's length follow the script and keep the pacing natural.
```

**Pronunciation hint** (one line per brand term):

```text
Pronounce "Okou" as "oh-koh".
```

**Translation-ready framing** (only when the video will be translated or the user wants a direct-to-camera message):

```text
This is a direct-to-camera message. Think of it like a FaceTime call — one person, one camera, sincere eye contact throughout. The presenter should be visible and speaking for the entire video.
```

**FRAMING NOTE, look narrower than the landscape output** (source wording `square (1:1)` for any `cropRisk: high` look, `portrait` only for a genuinely portrait look):

```text
FRAMING NOTE: The selected avatar image is in square (1:1) orientation but this video is landscape (16:9). Frame the presenter from the chest up, centered in the landscape canvas. Use AI Image tool to generative fill to extend the scene horizontally with a complementary background environment that matches the video's tone (studio, office, or contextually appropriate setting). Do NOT add black bars or pillarboxing. The avatar should feel natural in the 16:9 frame.
```

**FRAMING NOTE, look wider than the portrait output** (source wording `square (1:1)` for any `cropRisk: high` look, `landscape` only for a genuinely landscape look):

```text
FRAMING NOTE: The selected avatar image is in square (1:1) orientation but this video is portrait (9:16). Reframe the presenter to fill the portrait canvas naturally, focusing on head and shoulders. Use AI Image tool to generative fill to extend vertically if needed. Do NOT add letterboxing. The avatar should fill the portrait frame comfortably.
```

**BACKGROUND NOTE** (preview transparent, solid, or visually empty):

```text
BACKGROUND NOTE: The selected avatar has no background or a transparent backdrop. Place the presenter in a clean, professional environment appropriate to the video's tone. For business/tech content: modern studio with soft lighting and subtle depth. For casual content: bright, minimal space with natural light. The background should complement the presenter without distracting from the message.
```

The notes guide the agent; `POST /v3/video-agents` has no background, crop, scale, position, or safe-area field, so never claim deterministic control. Never write a note whose source and target orientation are the same.

## Rules

- Build the whole skeleton. Dropping the presenter sentences or the script-mode directive to shorten a prompt produces a cutout on a plain stage with a cropped head; the notes alone do not prevent it.
- Keep it short. No per-scene `Media:` blocks, no production paragraphs, no style manifesto. A presenter prompt stays under about 1,700 characters.
- One approximate length only. Caps such as `no longer than 30 seconds` are ignored; for a hard ceiling set the target well below it (about 18 seconds for a 30-second ceiling) or use verbatim mode.
- Positive framing: describe what to show, not what to avoid. Restrictive lists make the agent play safe.
- No per-scene timestamps and no layout coordinates. Describe motion with verbs (counts up, slides in, draws itself) only when a description is needed at all.
- With `avatar_id`, say "the selected presenter"; never describe hair, clothing, gender, or age.
- One topic per video; split multi-topic requests.
- Narration and on-screen strings in the brief's language; every directive, note, and production line in English.
- Name the selected style once, in the brief paragraph; never repeat it as prose.
- Each CRITICAL string at most 6 words or one figure plus a label; source citations and full sentences belong to the narration.
- Over 10,000 characters: compress the narration and attachment sentences first; never drop directives, on-screen text, or a verbatim script. A verbatim script that alone exceeds the limit is a controlled-route job.

## Style paragraph (user-requested override only)

When the user asks for a look beyond the selected style, add one paragraph after the production lines: a name for the look, the exact palette as hex codes, the art direction, how things move, the transitions, and one closing line for the mood; five or six sentences. Defaults for any authored override: colors from the subject or brand rather than a fixed accent; no small caption text; every text-over-background pair at contrast ratio 4.5 or higher; composition and color varied across scenes.

## Worked example

Brief: `product-launch`, about 25 seconds, landscape, zh-CN narration, adapt mode with `facts: source-only`, selected Minimalism style, a `studio_avatar` look with a square transparent preview, one dashboard screenshot and one logo attached.

```text
Create one polished 25-second landscape (16:9) product launch video in Simplified Chinese for operations managers at small and mid-sized companies. The selected presenter delivers the narration in a confident, conversational tone. Use the selected Minimalism style. Keep the entire head and hair visible in every presenter shot.

Before building any scene, adapt the selected presenter into a natural 16:9 landscape studio framing: create an AI-extended 16:9 version of the selected presenter with the entire head, hair, and shoulders inside the image and a complementary professional environment behind them, wait until that extended presenter is ready, and use it in every presenter scene. Fit the presenter entirely inside the frame; never fill the frame width with the original cutout or place it on a plain background.

Narration:
“每周一早上，运营负责人要花两小时从五个系统里拼一份周报。Okou 智能周报把这两小时变成两分钟：连上你的表格和看板，自动生成可直接发送的周报。上线首月，试用团队平均每周省下 1.8 小时。现在可以免费试用 14 天。”

CRITICAL ON-SCREEN TEXT (display literally):
- "两小时变两分钟"
- "每周省下 1.8 小时"
- "免费试用 14 天"
- "okou.ai"

Use the attached dashboard screenshot as B-roll when describing the automatic report. Display the attached logo in the intro and the end card.
Use motion graphics for the time-saving statistics and the end card. Place every on-screen text on a solid or semi-opaque high-contrast panel, dark text on a light panel or white text on a dark panel, large enough to read at the delivery size.

This script is a concept and theme to convey — not a verbatim transcript. Expand it only by restating or connecting the facts above, and fill the duration naturally. Every number, name, label, example, and interface detail on screen must come from the key messages or the CRITICAL ON-SCREEN TEXT list. Do not pad with silence or pauses.
Pronounce "Okou" as "oh-koh".

FRAMING NOTE: The selected avatar image is in square (1:1) orientation but this video is landscape (16:9). Frame the presenter from the chest up, centered in the landscape canvas. Use AI Image tool to generative fill to extend the scene horizontally with a complementary background environment that matches the video's tone (studio, office, or contextually appropriate setting). Do NOT add black bars or pillarboxing. The avatar should feel natural in the 16:9 frame.

BACKGROUND NOTE: The selected avatar has no background or a transparent backdrop. Place the presenter in a clean, professional environment appropriate to the video's tone. For business/tech content: modern studio with soft lighting and subtle depth. For casual content: bright, minimal space with natural light. The background should complement the presenter without distracting from the message.
```
