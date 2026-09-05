# Existing templates and source-video transformations

These routes apply only when the actual intent calls for them. They currently require the connected HeyGen API, not the managed Intro Video avatar/voice commands. Read the endpoint schema for the chosen operation and use JSON files for request bodies. Persist the returned job identity before polling, and never create a second job because the first one is still running.

## Studio template

1. Resolve the actual template with `GET /v3/templates` and `GET /v3/templates/{template_id}`. This list contains **workspace API-ready templates with variables**, not the public Video Agent Styles shown in the form.
2. Inspect every relevant variable's type, current value, and bound scenes. Use returned names and v3 shapes. For example, a text replacement is `{"type":"text","content":"Final text"}`; it is not the old nested v2 `properties.content` object.
3. Fill all text variables used by rendered scenes. Omitted text variables may leave literal `{{placeholders}}` in the script or video; returned defaults are not automatic substitutions. Preserve omitted image/audio/character defaults only when they agree with the user's choices.
4. Verify that the template exposes the controls the user needs. An explicit avatar or voice can only replace an appropriate character/voice variable. A template with a built-in presenter does not support “No avatar” merely because an avatar field was omitted.
5. POST `/v3/templates/{template_id}` with `variables` and needed output settings. `scene_ids` selects/reorders/repeats existing scenes; it does not create new ones. Preserve the template aspect ratio when overriding dimensions.
6. Persist `.data.video_id`, then poll `/v3/videos/{video_id}`. Inspect the result for unfilled variables and source/identity mismatches before delivery.

[Official template guide](https://developers.heygen.com/templates)

## Translate an existing video

Use `POST /v3/video-translations` only when the user wants the existing speech translated. Discover supported names with `GET /v3/video-translations/languages`; `output_languages` uses the returned language names, not guessed locale codes.

```json
{
  "video": {"type":"asset_id","asset_id":"PREPARED_SOURCE_VIDEO_ID"},
  "output_languages": ["English"],
  "translate_audio_only": true,
  "enable_dynamic_duration": false
}
```

For faceless screen recordings, audio-only translation preserves the picture and avoids unnecessary lip processing. The duration flag requests fixed duration but still requires inspecting the resulting media. Visible original speakers belong to the source; the Intro Video Avatar setting describes an **added** presenter. Do not replace the original speaker with a catalog avatar unless asked.

This API has no general top-level `voice_id`. Default translation preserves/recreates the source speaker voice. An enterprise stock-voice option is not a generic exact-voice override. If the user selected an exact HeyGen voice, prepare the translated script and selected-voice audio, then use composition (faceless video) or lipsync (visible speaker), or verify a supported custom-audio translation path. Do not silently ignore the selected voice.

Read the current creation response and persist each returned translation ID; monitor `GET /v3/video-translations/{video_translation_id}`. Multiple languages may produce multiple jobs; generate them only when requested. Do not treat a translation job ID as a Video Agent session ID.

[Translation reference](https://developers.heygen.com/reference/create-video-translation)

## Replace speech and lip-sync existing footage

Use `POST /v3/lipsyncs` with both `video` and replacement `audio`, each an asset ID or public file URL. The audio must already say what the user requested. Lipsync does not write, translate, or verify that script.

```json
{
  "video": {"type":"asset_id","asset_id":"SOURCE_VIDEO_ID"},
  "audio": {"type":"asset_id","asset_id":"FINAL_REPLACEMENT_AUDIO_ID"},
  "enable_dynamic_duration": false
}
```

Use this for a real visible speaking face. For a faceless screen recording, replace/mix the prepared audio in controlled composition; lip-sync inference adds no value. Check source and replacement durations before submission and inspect synchronization afterward. Original-audio mode conflicts with speech replacement and must be resolved before generating.

Persist the response's lipsync ID and poll `GET /v3/lipsyncs/{lipsync_id}` using its actual response schema. A successful job is not enough if the timing or requested audio is wrong.

[Lipsync reference](https://developers.heygen.com/reference/create-lipsync)
