# Managed catalogs and exact choices

Read this only when the brief contains a delegated choice or an exact ID that needs compatibility checking. Do not exhaust unrelated catalogs.

Inspect current help and query only the needed Okou-managed catalog:

```bash
okou __intro-video-catalog styles --page-size 100 --json
okou __intro-video-catalog avatars --page-size 50 --json
okou __intro-video-catalog voices --page-size 100 --json
```

Follow `nextToken` with `--token` when more candidates are needed, and stop if a cursor repeats. A failed request is not an empty catalog and does not authorize an invented or omitted ID.

Preserve exact public IDs. An avatar group ID groups looks and cannot replace the selected look's `avatar_id`. With a selected avatar and `Default` voice, resolve its `defaultVoiceId` and pass that actual voice ID when required. With no avatar, a delegated voice means choose an independent public voice matching the brief's language; it does not mean mute.

For delegated style, compare relevant tags and actual previews against the material, audience, purpose, tone, and output. Record the selected style ID and a short reason once a justified match is available. Native Video Agent receives that concrete `style_id`; controlled composition may use the preview only as an explicitly described visual adaptation.

Apply compatibility checks only to the chosen route. Standalone managed TTS uses a Starfish-compatible voice, while Video Agent has different restrictions. An avatar's default voice may therefore work natively while being unavailable to standalone TTS.
