# Provider capability is not platform capability

Research reference, not executable instructions. Checked against the [official HeyGen OpenAPI](https://developers.heygen.com/openapi/external-api.json) on 2026-09-05 and vm0 main at `a400ced08a`. The current platform integration (#31648, #31658, #31668, and the public catalogs in #31830) manages speech and transparent avatar takes, not every HeyGen product. Personal accounts and connector flows are outside this Intro Video skill.

## Video Agent and public styles

`POST /v3/video-agents` can author and render a whole video from a brief. Its request fields are `prompt`, `mode`, `avatar_id`, `voice_id`, `style_id`, `brand_kit_id`, `brand_glossary_id`, `orientation`, `files`, `callback_url`, `callback_id`, and `incognito_mode`. Prompt length is 1–10,000 characters; attachments are limited to 20 native media/PDF references. Orientation is landscape or portrait.

Duration, language, narrative, captions, and exclusions are prompt directions, not explicit guaranteed render controls. There is no general no-avatar/no-voice switch; omitted/null IDs mean automatic selection. Exact scripts, original pages/frames/audio, and overlay geometry are not guaranteed. `mode: chat` is not a reliable user-review barrier because the agent may proceed to generation.

A public style ID is native only on this endpoint. In the current managed composition flow, its preview is a visual reference, not a promise of native preset application. State the adaptation; resolve a hard native-render requirement before generating paid assets. Do not relabel the style as a Studio template or invent a managed Video Agent command.

## Avatar and Studio video

`POST /v3/videos` supports distinct typed inputs. A direct avatar video takes exactly one script/audio source; scripts are capped at 5,000 characters and input speech at 600 seconds. Background-free WebM requires a compatible matting engine. The platform's managed command specifically supplies an audio source to Avatar III and returns a transparent presenter take, not a full authored narrative.

Studio scenes can sequence up to 50 full-frame avatar, image, or video scenes. This is not arbitrary overlapping composition; a picture-in-picture presenter on the same source slide needs a suitable template or an authored composition. Do not mix the old v2 `video_inputs` shape with v3 typed scenes.

## Studio templates

`GET /v3/templates` lists workspace API-ready templates, not the public styles in the form. Native rendering requires inspecting variables and calling `/v3/templates/{template_id}`. V3 text variables use `{"type":"text","content":"..."}` rather than v2 nested properties. Omitted text variables can leave literal placeholders. Layout, avatar removal, and exact voice replacement depend on the variables actually exposed.

This API is not a current managed Intro Video route. If the user supplies a rendered deck/video as a visual source, composition can preserve that material; it is not equivalent to native template-variable rendering.

## Translation and lipsync

`POST /v3/video-translations` translates existing spoken content and uses returned supported language names. It has no general top-level `voice_id`; source-speaker voice preservation and enterprise stock-voice options are not interchangeable with an arbitrary selected public voice.

`POST /v3/lipsyncs` takes existing video plus prepared replacement audio. It does not research, write, or translate the script. A faceless recording does not benefit from mouth-matching; managed translated speech plus local composition can replace its narration. Original-speaker voice preservation and visible-face lip matching cannot be promised by the current managed flow.

## HyperFrames Cloud

`POST /v3/hyperframes/renders` renders a packaged authored HTML project, with explicit fps/format/resolution/ratio controls. It does not create a narrative from a prompt. The platform currently uses local HyperFrames rendering; do not silently invoke cloud rendering or a personal API credential. Local and cloud render flags are not interchangeable.
