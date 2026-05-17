---
name: doubao
description: Doubao (Volcengine 豆包语音) API for Chinese-first text-to-speech, speech recognition,
  voice cloning, and end-to-end realtime voice. Use when user mentions "Doubao",
  "豆包", "Volcengine speech", "火山引擎语音", "seed-tts", "seed-icl", "openspeech.bytedance.com",
  or asks to synthesise Mandarin speech in named voices, transcribe Chinese audio, or
  clone a voice from a sample.
---

## Troubleshooting

If a request fails, run `zero doctor check-connector --env-name DOUBAO_API_KEY` or
`zero doctor check-connector --url "https://openspeech.bytedance.com/api/v3/tts/unidirectional"`.

The most common error is `55000000 resource ID is mismatched with speaker related resource` —
the `X-Api-Resource-Id` header does not match the speaker's model version. See the
[Speaker ↔ Resource-Id table](#speaker--resource-id-table) below.

## Official Docs

- Product index: https://www.volcengine.com/docs/6561/162929
- TTS HTTP Chunked / SSE V3: https://www.volcengine.com/docs/6561/1598757
- TTS WebSocket bidirectional V3: https://www.volcengine.com/docs/6561/1329505
- TTS WebSocket unidirectional V3: https://www.volcengine.com/docs/6561/1719100
- Voice clone V3: https://www.volcengine.com/docs/6561/2227958
- Speaker catalog: https://www.volcengine.com/docs/6561/1257544
- SSML reference: https://www.volcengine.com/docs/6561/1330194
- ASR file recognition (standard / flash / idle): https://www.volcengine.com/docs/6561/1354868
- ASR streaming: https://www.volcengine.com/docs/6561/1354869

## Prerequisites

Connect the **Doubao** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).
The new-console API key is a UUID issued from
[console.volcengine.com/speech/new/setting/apikeys](https://console.volcengine.com/speech/new/setting/apikeys).

The connector provides:

- `DOUBAO_API_KEY` — the UUID API key

Every request to `openspeech.bytedance.com` carries:

| Header | Notes |
| --- | --- |
| `X-Api-Key: $DOUBAO_API_KEY` | Required on every call |
| `X-Api-Resource-Id` | Required. Selects model version & billing SKU. Must match the speaker family. |
| `X-Api-Request-Id` | UUID — optional but always set; aids server log lookup |
| `X-Api-Sequence: -1` | ASR file-recognition endpoints only |
| `X-Tt-Logid` (response) | Always log on errors; required for vendor support tickets |

## How to Use

### Synthesise speech (HTTP, streaming chunked)

This is the simplest path and what the connector is field-tested against.
Endpoint: `POST https://openspeech.bytedance.com/api/v3/tts/unidirectional`.
Response is `Content-Type: text/plain` chunked with **concatenated JSON objects
(no newlines)** — use an incremental JSON decoder, not a line splitter.

Write request to `/tmp/doubao_tts.json`:

```json
{
  "user": {"uid": "vm0-zero"},
  "req_params": {
    "text": "今天天气真不错，适合出去走走。",
    "speaker": "zh_female_vv_uranus_bigtts",
    "audio_params": {"format": "mp3", "sample_rate": 24000}
  }
}
```

Then stream and decode:

```bash
curl -sS -N -X POST "https://openspeech.bytedance.com/api/v3/tts/unidirectional" \
  -H "X-Api-Key: $DOUBAO_API_KEY" \
  -H "X-Api-Resource-Id: seed-tts-2.0" \
  -H "X-Api-Request-Id: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d @/tmp/doubao_tts.json \
  -o /tmp/doubao_stream.txt
```

Decode the stream into MP3:

```bash
python3 - <<'PY'
import json, base64
chunks, sentences, final = [], [], None
with open('/tmp/doubao_stream.txt', 'r', encoding='utf-8') as f:
    raw = f.read()
decoder, i = json.JSONDecoder(), 0
while i < len(raw):
    while i < len(raw) and raw[i] in ' \n\r\t':
        i += 1
    if i >= len(raw):
        break
    obj, i = decoder.raw_decode(raw, i)
    if isinstance(obj.get('data'), str):
        chunks.append(obj['data'])
    elif obj.get('sentence'):
        sentences.append(obj['sentence'])
    if obj.get('code') == 20000000:
        final = obj
audio = b''.join(base64.b64decode(c) for c in chunks)
open('/tmp/doubao_out.mp3', 'wb').write(audio)
print(f"chunks={len(chunks)} sentences={len(sentences)} bytes={len(audio)} final={final}")
PY
```

`code: 20000000 / message: ok` marks end of stream. `data` carries one base64
audio chunk per frame. `sentence` frames carry per-word timestamps when
`enable_subtitle` (2.0) or `enable_timestamp` (1.0) is requested.

### Synthesise speech (SSE)

Same body, different parser. Use SSE when the runtime has a built-in EventSource
client and you prefer line-based parsing.

```bash
curl -sS -N -X POST "https://openspeech.bytedance.com/api/v3/tts/unidirectional/sse" \
  -H "X-Api-Key: $DOUBAO_API_KEY" \
  -H "X-Api-Resource-Id: seed-tts-2.0" \
  -H "X-Api-Request-Id: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d @/tmp/doubao_tts.json
```

Each event has an `event:` line carrying one of: `352` (audio), `351`
(sentence end), `350` (sentence start, TTS 1.0 only), `152` (final), `151`
(cancelled), `153` (failed). `data:` lines hold the same JSON objects as
the chunked endpoint.

### Transcribe an audio file (async)

Async file recognition takes a URL or base64 audio and returns a task id.
Poll the query endpoint until `X-Api-Status-Code: 20000000`.

```bash
TASK_ID=$(uuidgen)
curl -sS -D /tmp/auc_hdr.txt -X POST \
  "https://openspeech.bytedance.com/api/v3/auc/bigmodel/submit" \
  -H "X-Api-Key: $DOUBAO_API_KEY" \
  -H "X-Api-Resource-Id: volc.seedasr.auc" \
  -H "X-Api-Request-Id: $TASK_ID" \
  -H "X-Api-Sequence: -1" \
  -H "Content-Type: application/json" \
  -d '{
    "user": {"uid": "vm0-zero"},
    "audio": {"format": "mp3", "url": "https://example.com/clip.mp3"},
    "request": {"model_name": "bigmodel", "enable_itn": true, "enable_punc": true}
  }'
grep -i x-api-status-code /tmp/auc_hdr.txt   # expect 20000000

# Poll every ~5 seconds; check the status header, not the body.
curl -sS -D /tmp/auc_q.txt -X POST \
  "https://openspeech.bytedance.com/api/v3/auc/bigmodel/query" \
  -H "X-Api-Key: $DOUBAO_API_KEY" \
  -H "X-Api-Resource-Id: volc.seedasr.auc" \
  -H "X-Api-Request-Id: $TASK_ID" \
  -d '{}'
grep -i x-api-status-code /tmp/auc_q.txt
# 20000001 still running · 20000002 queued · 20000000 done (body has result.text)
```

For one-shot ≤ 2 h / ≤ 100 MB audio, use the synchronous **flash** endpoint
`POST /api/v3/auc/bigmodel/recognize/flash` with
`X-Api-Resource-Id: volc.bigasr.auc_turbo` — same body, no polling.

### Streaming ASR (WebSocket)

`wss://openspeech.bytedance.com/api/v3/sauc/bigmodel{,_nostream,_async}`.
Custom binary framing — `[4-byte header][4-byte payload size][gzipped JSON or audio bytes]`
with big-endian ints and gzip on by default. Use the official Python
sample code from doc 1354869 §3 as the starting point; do not hand-roll the
frame parser unless you have to. Resource-Id: `volc.bigasr.sauc.duration` (1.0
hourly), `volc.seedasr.sauc.duration` (2.0 hourly), `.concurrent` variants for
the concurrent SKU.

### Clone a voice

The full flow lives in [doc 2227958](https://www.volcengine.com/docs/6561/2227958).
Outline:

1. Provision a `S_*` speaker id in the new console (paid SKU). Wait ~2 min.
2. `POST /api/v3/tts/voice_clone` with base64 reference audio (≤ 10 MB), the
   speaker id, language enum (`0`=zh, `1`=en, `2`=ja, `3`=es, `4`=id, `5`=pt,
   `6`=de, `7`=fr, `8`=ko), and `X-Api-Resource-Id: seed-icl-2.0` (or
   `seed-icl-1.0` for the older model).
3. Poll `POST /api/v3/tts/get_voice` with `{"speaker_id": "S_..."}` until
   `status` is `2` (Success) or `4` (Active).
4. Synthesise via `/api/v3/tts/unidirectional` with `req_params.speaker = "S_..."`
   and the matching `X-Api-Resource-Id` (`seed-icl-1.0` or `seed-icl-2.0`).

### SSML

Pass via `req_params.ssml` instead of `req_params.text`. Root must be
`<speak>…</speak>`, total length ≤ 150 chars including tags. Supported on
TTS 1.0 and ICL 1.0 voices only; TTS 2.0 (`*_uranus_bigtts`, `saturn_*`) and
ICL 2.0 ignore `<phoneme>`, `<break>`, `<soundEvent>`. WebSocket
**bidirectional** silently strips SSML — use `text` there.

Example: `<speak><sub alias="语音合成标记语言">SSML</sub>是好东西。</speak>`

Full tag list: [doc 1330194](https://www.volcengine.com/docs/6561/1330194).

## Speaker ↔ Resource-Id table

Picking the wrong `X-Api-Resource-Id` returns `55000000 resource ID is mismatched
with speaker related resource` with no hint about which one to switch — match
the suffix/prefix below.

| Speaker pattern | Resource-Id |
| --- | --- |
| `*_uranus_bigtts` (TTS 2.0 main series) | `seed-tts-2.0` |
| `saturn_*_tob` (TTS 2.0 saturn — no SSML, supports COT) | `seed-tts-2.0` |
| `*_moon_bigtts`, `*_mars_bigtts`, `*_emo_v2_mars_bigtts`, `*_conversation_wvae_bigtts`, `ICL_*_tob` | `seed-tts-1.0` (or `seed-tts-1.0-concurr` for concurrent SKU) |
| `S_*` (user clone, model_type 4/5) | `seed-icl-2.0` |
| `S_*` (user clone, model_type 1/2/3) | `seed-icl-1.0` (or `seed-icl-1.0-concurr`) |
| `custom_mix_bigtts` (mix-voice marker) | `seed-tts-1.0` |

## Reliable default speakers

Use these for first-pass selection. Full catalog (~200 voices) at
[doc 1257544](https://www.volcengine.com/docs/6561/1257544).

| Use case | Speaker | Resource-Id |
| --- | --- | --- |
| Chinese female, neutral / general | `zh_female_vv_uranus_bigtts` (vv 2.0; supports zh/ja/id/es-mx + dongbei/sichuan/shaanxi dialects via `additions.explicit_dialect`) | `seed-tts-2.0` |
| Chinese female, warm | `zh_female_xiaohe_uranus_bigtts` | `seed-tts-2.0` |
| Chinese male, sober/narrator | `zh_male_m191_uranus_bigtts` (云舟 2.0) | `seed-tts-2.0` |
| Chinese male, youthful | `zh_male_taocheng_uranus_bigtts` (小天 2.0) | `seed-tts-2.0` |
| Children storybook | `zh_female_xiaoxue_uranus_bigtts` | `seed-tts-2.0` |
| English female, expressive | `en_female_dacey_uranus_bigtts` | `seed-tts-2.0` |
| English male, expressive | `en_male_tim_uranus_bigtts` | `seed-tts-2.0` |
| Multi-emotion zh female (use `audio_params.emotion`) | `zh_female_gaolengyujie_emo_v2_mars_bigtts` | `seed-tts-1.0` |
| Multi-emotion en female | `en_female_candice_emo_v2_mars_bigtts` | `seed-tts-1.0` |
| Fast / quick test (the speaker we used to bootstrap) | `zh_female_shuangkuaisisi_moon_bigtts` | `seed-tts-1.0` |

## Useful request-body fields

All fields go under `req_params` unless noted. See
[doc 1598757](https://www.volcengine.com/docs/6561/1598757) for the exhaustive list.

- `text` — plain text (or `ssml` instead; mutually exclusive)
- `speaker` — speaker id from the table above
- `audio_params.format` — `mp3` (default), `pcm`, `ogg_opus`. Avoid `wav` for streaming (multiple WAV headers per chunk).
- `audio_params.sample_rate` — 8000 / 16000 / 22050 / 24000 (default) / 32000 / 44100 / 48000
- `audio_params.speech_rate` — `-50..100` (100 = 2× speed)
- `audio_params.loudness_rate` — `-50..100`
- `audio_params.emotion` — `angry/happy/sad/neutral/...` (only `*_emo_v2_mars_bigtts` and a subset)
- `audio_params.enable_subtitle` — TTS 2.0 / ICL 2.0: per-word timestamps in separate `TTSSubtitle` events
- `audio_params.enable_timestamp` — TTS 1.0 / ICL 1.0: timestamps fused into `TTSSentenceEnd`. Not interchangeable with `enable_subtitle` — wrong version is silently ignored.
- `additions.disable_markdown_filter` — `false` strips `**bold**` markup; `true` reads it literally
- `additions.silence_duration` — append silence (ms) at the end of the last sentence
- `additions.explicit_language` — `zh-cn`, `en`, `ja`, `es-mx`, `id`, `pt-br`, `de`, `fr`, `ko`. **Required** on ICL 2.0 for non-zh/en synthesis.
- `additions.explicit_dialect` — `dongbei`, `shaanxi`, `sichuan` (only `zh_female_vv_uranus_bigtts`)
- `additions.cache_config` — `{"text_type":1,"use_cache":true}` caches identical text for 1 h

To return token usage on the final frame, add request header
`X-Control-Require-Usage-Tokens-Return: *`.

## Out of scope for this connector

Three endpoints still require the **old-console** dual headers
(`X-Api-App-Id` + `X-Api-Access-Key`) per the latest vendor docs:

- Async long-text TTS (`/api/v3/tts/submit`, `/api/v3/tts/query`) — doc 1829010
- End-to-end realtime S2S (`wss .../api/v3/realtime/dialogue`) — doc 1594356
- Podcast (`wss .../api/v3/sami/podcasttts`) — doc 1668014

This connector only collects `X-Api-Key`. If you need any of those three,
keep the old-console credentials separately and call the endpoint directly —
do not try to route through the firewall.

## Guidelines

- Match the `X-Api-Resource-Id` to the speaker family — this is the #1 source of errors.
- Use the HTTP **chunked** endpoint for batch synthesis; HTTP **SSE** for browser-style streaming; WebSocket bidirectional only when piping live LLM output into TTS.
- Save and log `X-Tt-Logid` from response headers on every error — vendor support requires it.
- The chunked response is `text/plain` with concatenated JSON (no newlines) — use `json.JSONDecoder.raw_decode` or equivalent, not line-splitting.
- Do not print or store `DOUBAO_API_KEY`.
- Vendor server keep-alive is ~1 minute; reuse a session/connection pool for high-throughput batches.
