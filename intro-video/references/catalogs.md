# Managed catalogs and exact choices

Read this only when the brief contains a delegated choice or an exact ID that needs compatibility checking. Do not exhaust unrelated catalogs.

Inspect current help and query only the needed Okou-managed catalog:

```bash
okou __intro-video-catalog styles --page-size 100 --json
okou __intro-video-catalog avatars --page-size 50 --json
okou __intro-video-catalog voices --page-size 100 --json
```

Follow `nextToken` with `--token` when more candidates are needed, and stop if a cursor repeats. A failed request is not an empty catalog and does not authorize an invented or omitted ID.

Preserve exact public IDs. An avatar group ID groups looks and cannot replace the selected look's `avatar_id`. With a selected avatar and `Default` voice, resolve its `defaultVoiceId` and pass that actual voice ID when required. With no avatar, a delegated voice means choose an independent public voice matching the brief's language; it does not mean mute. A delegated presenter (an older form's `Auto`) is resolved to one concrete public look by the preference order below; record the reason. Never submit a native job without `avatar_id` unless the brief says no presenter.

For a native presenter, classify the selected look before anything is paid for:

- `avatar_type`: read it from the form's `HeyGen avatar type` line or the catalog record (`studio_avatar`, `photo_avatar`, `digital_twin`). HeyGen composes a `photo_avatar` together with its environment; a `studio_avatar` is a preset cutout that the agent places on the style's stage.
- `environment`: decode the actual preview image. An alpha channel with transparent pixels, a solid color, or a visually empty field means no environment; only a real scene counts as `real`. Do not trust `preferredOrientation` or the type alone.
- `cropRisk` for the output orientation: use the decoded dimensions. For landscape output a look with `width < 1.20 × height` is `high`; for portrait output a look with `height < 1.20 × width` is `high`. Near-square means `max(width, height) < 1.10 × min(width, height)` and is always `high` unless the output is square.

Preference order when Okou chooses the look, and the alternative named when the user's explicit look is `cropRisk: high`: `photo_avatar` with a real environment and matching orientation; then any look with a real environment; then a `studio_avatar` with `cropRisk: low` (for landscape output `width ≥ 1.20 × height`). Pass the classification to the presenter capability check and the native preflight; the correction text lives only in the prompt compiler.

The managed catalog currently returns only `studio_avatar` looks with transparent previews. Such a look renders inside a generated environment with a full head when the prompt is the complete compiled skeleton, and as a cutout with a cropped head when the presenter sentences or the script-mode directive are missing; the classification exists so QA can tell those cases apart.

For delegated style, compare relevant tags and actual previews against the material, audience, purpose, tone, and output. Record the selected style ID and a short reason once a justified match is available. Native Video Agent receives that concrete `style_id`; controlled composition may use the preview only as an explicitly described visual adaptation.

Apply compatibility checks only to the chosen route. Standalone managed TTS uses a Starfish-compatible voice, while Video Agent has different restrictions. An avatar's default voice may therefore work natively while being unavailable to standalone TTS. The managed API can also reject a look's default voice as unavailable for Video Agent; when that happens, select a public voice in the narration language, record the substitution, and continue instead of failing the request.
