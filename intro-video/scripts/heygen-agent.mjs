#!/usr/bin/env node
// One-shot HeyGen submission and resumable status reads. Node 22+, no packages.
import { createHash, randomUUID } from "node:crypto";
import { createWriteStream, existsSync, linkSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { pathToFileURL } from "node:url";

const API = "https://api.heygen.com/v3";
const FIELDS = new Set([
  "prompt", "mode", "avatar_id", "voice_id", "style_id", "brand_kit_id",
  "brand_glossary_id", "orientation", "files", "callback_url", "callback_id",
  "incognito_mode",
]);
const MEDIA_TYPES = new Set([
  "image/png", "image/jpeg", "video/mp4", "video/webm", "audio/mpeg",
  "audio/wav", "application/pdf",
]);

function object(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value;
}

function nonempty(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} must be a nonempty string`);
  }
  return value;
}

function httpsUrl(value, label) {
  const url = new URL(nonempty(value, label));
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error(`${label} must be an HTTPS URL without embedded credentials`);
  }
  return value;
}

function validateFile(file, index) {
  const label = `files[${index}]`;
  object(file, label);
  const keys = {
    url: ["type", "url"],
    asset_id: ["type", "asset_id"],
    base64: ["type", "media_type", "data"],
  }[file.type];
  if (!Array.isArray(keys) || Object.keys(file).some((key) => !keys.includes(key))) {
    throw new Error(`${label} must use a supported url, asset_id, or base64 shape`);
  }
  if (file.type === "url") httpsUrl(file.url, `${label}.url`);
  if (file.type === "asset_id") nonempty(file.asset_id, `${label}.asset_id`);
  if (file.type === "base64") {
    if (!MEDIA_TYPES.has(file.media_type)) throw new Error(`${label} has an unsupported Video Agent media type`);
    nonempty(file.data, `${label}.data`);
    if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(file.data)) {
      throw new Error(`${label}.data must be raw base64, not a data URL`);
    }
    if (Buffer.byteLength(file.data, "base64") > 32 * 1024 * 1024) {
      throw new Error(`${label} is too large; prepare a direct-upload asset instead`);
    }
  }
}

export function validateRequest(request) {
  object(request, "request");
  const extra = Object.keys(request).filter((key) => !FIELDS.has(key));
  if (extra.length) throw new Error(`Unsupported Video Agent fields: ${extra.join(", ")}`);
  if ([...nonempty(request.prompt, "prompt")].length > 10_000) {
    throw new Error("Video Agent prompt exceeds 10,000 characters; revise the brief before submission");
  }
  if (request.mode !== undefined && !["generate", "chat"].includes(request.mode)) {
    throw new Error("mode must be generate or chat");
  }
  if (request.orientation != null && !["landscape", "portrait"].includes(request.orientation)) {
    throw new Error("Video Agent orientation must be landscape or portrait; use controlled composition for other ratios");
  }
  for (const key of ["avatar_id", "voice_id", "style_id", "brand_kit_id", "brand_glossary_id", "callback_id"]) {
    if (request[key] != null) nonempty(request[key], key);
  }
  if (request.callback_url != null) httpsUrl(request.callback_url, "callback_url");
  if (request.incognito_mode !== undefined && typeof request.incognito_mode !== "boolean") {
    throw new Error("incognito_mode must be boolean");
  }
  if (request.files != null) {
    if (!Array.isArray(request.files) || request.files.length > 20) {
      throw new Error("Video Agent accepts at most 20 files; prepare or curate the sources first");
    }
    request.files.forEach(validateFile);
  }
  return request;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function saveState(path, state) {
  const temporary = `${path}.${randomUUID()}.tmp`;
  writeFileSync(temporary, JSON.stringify(state, null, 2) + "\n", { flag: "wx", mode: 0o600 });
  renameSync(temporary, path);
}

function credential() {
  const token = process.env.HEYGEN_TOKEN || process.env.HEYGEN_API_KEY;
  if (!token) throw new Error("HeyGen credential unavailable; run okou connector check --env-name HEYGEN_TOKEN");
  return token;
}

async function apiRequest(path, method, body, fetcher) {
  const response = await fetcher(`${API}${path}`, {
    method,
    redirect: "error",
    headers: { "x-api-key": credential(), "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    const retry = response.headers.get("retry-after");
    throw new Error(`HeyGen ${method} ${path} returned HTTP ${response.status}${retry ? `; Retry-After: ${retry}` : ""}. No automatic submission retry was made.`);
  }
  const result = await response.json();
  return object(result.data, "HeyGen response.data");
}

export async function submit(requestPath, statePath, fetcher = fetch) {
  const request = validateRequest(readJson(requestPath));
  credential();
  const state = {
    version: 1,
    requestSha256: createHash("sha256").update(JSON.stringify(request)).digest("hex"),
    phase: "submission_uncertain",
    mode: request.mode ?? "generate",
  };
  // Exclusive create also protects against concurrent duplicate submissions.
  writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n", { flag: "wx", mode: 0o600 });
  const session = await apiRequest("/video-agents", "POST", request, fetcher);
  state.sessionId = nonempty(session.session_id, "session_id");
  state.phase = "submitted";
  if (session.video_id) state.videoId = nonempty(session.video_id, "video_id");
  saveState(statePath, state);
  return { status: "submitted", sessionId: state.sessionId, videoId: state.videoId ?? null };
}

export async function status(statePath, fetcher = fetch) {
  const state = object(readJson(statePath), "job state");
  if (state.version !== 1) throw new Error("Unsupported job state version");
  if (!state.sessionId) {
    throw new Error("Submission outcome is uncertain. Reconcile the existing HeyGen session before resuming; do not resubmit or delete this state file.");
  }
  if (!state.videoId) {
    const session = await apiRequest(`/video-agents/${encodeURIComponent(state.sessionId)}`, "GET", undefined, fetcher);
    state.session = session;
    if (session.video_id) state.videoId = nonempty(session.video_id, "video_id");
    state.phase = session.status === "failed" ? "failed" : "awaiting_video";
    saveState(statePath, state);
    return {
      status: session.status === "completed" ? "awaiting_video" : session.status,
      sessionId: state.sessionId,
      videoId: state.videoId ?? null,
      needsInput: session.status === "waiting_for_input",
    };
  }
  const video = await apiRequest(`/videos/${encodeURIComponent(state.videoId)}`, "GET", undefined, fetcher);
  if (!["pending", "processing", "completed", "failed"].includes(video.status)) {
    throw new Error("Unexpected HeyGen video status; inspect the current API response without submitting another job");
  }
  if (video.status === "completed") httpsUrl(video.video_url, "completed video URL");
  state.video = video;
  state.phase = video.status;
  saveState(statePath, state);
  return { status: video.status, videoId: state.videoId, duration: video.duration ?? null };
}

export async function download(statePath, outputPath, fetcher = fetch) {
  const state = object(readJson(statePath), "job state");
  if (state.phase !== "completed" || state.video?.status !== "completed") {
    throw new Error("Video is not completed; read its status before downloading");
  }
  if (existsSync(outputPath)) throw new Error("Output already exists; inspect it instead of overwriting it");
  const url = httpsUrl(state.video.video_url, "completed video URL");
  // Never send the HeyGen API credential to a media/CDN URL.
  const response = await fetcher(url, { signal: AbortSignal.timeout(120_000) });
  if (!response.ok || !response.body) throw new Error("Video download failed; refresh the existing video status for a new URL");
  const type = response.headers.get("content-type")?.split(";")[0];
  if (type && !["video/mp4", "application/octet-stream"].includes(type)) {
    throw new Error("Download is not an MP4; inspect the provider output before delivery");
  }
  const temporary = `${outputPath}.${randomUUID()}.part`;
  try {
    await pipeline(response.body, createWriteStream(temporary, { flags: "wx", mode: 0o600 }));
    if (!statSync(temporary).size) throw new Error("HeyGen returned an empty video");
    // A concurrent download must not overwrite a file created after the check.
    linkSync(temporary, outputPath);
    unlinkSync(temporary);
  } catch (error) {
    if (existsSync(temporary)) unlinkSync(temporary);
    throw error;
  }
  return { path: outputPath, bytes: statSync(outputPath).size, verificationRequired: true };
}

async function main(args) {
  const [action, first, second] = args;
  if (action === "validate" && args.length === 2) {
    const request = validateRequest(readJson(first));
    return { valid: true, promptCharacters: [...request.prompt].length, files: request.files?.length ?? 0 };
  }
  if (action === "submit" && args.length === 3) return submit(first, second);
  if (action === "status" && args.length === 2) return status(first);
  if (action === "download" && args.length === 3) return download(first, second);
  throw new Error("Usage: heygen-agent.mjs validate REQUEST.json | submit REQUEST.json STATE.json | status STATE.json | download STATE.json FINAL.mp4");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    console.log(JSON.stringify(await main(process.argv.slice(2))));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
