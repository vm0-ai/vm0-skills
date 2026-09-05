import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { download, status, submit, validateRequest } from "./heygen-agent.mjs";

const previousToken = process.env.HEYGEN_TOKEN;
before(() => { process.env.HEYGEN_TOKEN = "offline-test-token"; });
after(() => {
  if (previousToken === undefined) delete process.env.HEYGEN_TOKEN;
  else process.env.HEYGEN_TOKEN = previousToken;
});

function fixture(t, request = { prompt: "Explain the verified product facts." }) {
  const directory = mkdtempSync(join(tmpdir(), "intro-video-agent-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const requestPath = join(directory, "request.json");
  const statePath = join(directory, "state.json");
  writeFileSync(requestPath, JSON.stringify(request));
  return { requestPath, statePath, directory };
}

const json = (data) => Response.json({ data });

test("preserves selected provider IDs and supported reference forms", () => {
  const request = {
    prompt: "Explain the product.", mode: "generate", orientation: "landscape",
    avatar_id: "look-exact", voice_id: "voice-exact", style_id: "style-exact",
    files: [{ type: "asset_id", asset_id: "reference-1" }, { type: "url", url: "https://example.com/reference.pdf" }],
  };
  assert.equal(validateRequest(request), request);
});

test("rejects provider-incompatible prompt, file count, field and input shapes", () => {
  for (const request of [
    { prompt: " " },
    { prompt: "x".repeat(10_001) },
    { prompt: "x", duration_sec: 60 },
    { prompt: "x", orientation: "square" },
    { prompt: "x", files: Array.from({ length: 21 }, () => ({ type: "asset_id", asset_id: "file" })) },
    { prompt: "x", files: [{ type: "url", url: "file:///local.pdf" }] },
    { prompt: "x", files: [{ type: "url", url: "https://user:password@example.com/a.pdf" }] },
    { prompt: "x", files: [{ type: "base64", media_type: "text/html", data: "AAAA" }] },
    { prompt: "x", files: [{ type: "asset_id", asset_id: "file", localPath: "a.pptx" }] },
  ]) assert.throws(() => validateRequest(request));
});

test("submits once, then resumes session and video reads until completed", async (t) => {
  const { requestPath, statePath } = fixture(t);
  const calls = [];
  const responses = [
    { session_id: "session-1", status: "generating" },
    { session_id: "session-1", status: "completed", video_id: "video-1" },
    { id: "video-1", status: "processing" },
    { id: "video-1", status: "completed", video_url: "https://files.example/final.mp4", duration: 30 },
  ];
  const fetcher = async (url, options) => {
    calls.push([url, options.method]);
    assert.equal(options.headers["x-api-key"], "offline-test-token");
    assert.equal(options.redirect, "error");
    return json(responses.shift());
  };
  await submit(requestPath, statePath, fetcher);
  await assert.rejects(submit(requestPath, statePath, fetcher), { code: "EEXIST" });
  assert.equal((await status(statePath, fetcher)).status, "awaiting_video");
  assert.equal((await status(statePath, fetcher)).status, "processing");
  assert.equal((await status(statePath, fetcher)).status, "completed");
  assert.deepEqual(calls, [
    ["https://api.heygen.com/v3/video-agents", "POST"],
    ["https://api.heygen.com/v3/video-agents/session-1", "GET"],
    ["https://api.heygen.com/v3/videos/video-1", "GET"],
    ["https://api.heygen.com/v3/videos/video-1", "GET"],
  ]);
});

test("a timeout cannot create a duplicate billed submission", async (t) => {
  const { requestPath, statePath } = fixture(t);
  let calls = 0;
  const fetcher = async () => { calls += 1; throw new Error("Network timeout"); };
  await assert.rejects(submit(requestPath, statePath, fetcher), /timeout/);
  await assert.rejects(submit(requestPath, statePath, fetcher), { code: "EEXIST" });
  await assert.rejects(status(statePath, fetcher), /uncertain/);
  assert.equal(calls, 1);
});

test("rate limits are surfaced without automatic POST retries", async (t) => {
  const { requestPath, statePath } = fixture(t);
  let calls = 0;
  await assert.rejects(submit(requestPath, statePath, async () => {
    calls += 1;
    return new Response("rate limited", { status: 429, headers: { "retry-after": "30" } });
  }), /Retry-After: 30/);
  assert.equal(calls, 1);
});

test("waiting for a choice stays resumable without approving or generating", async (t) => {
  const { requestPath, statePath } = fixture(t, { prompt: "Create a video.", mode: "chat" });
  await submit(requestPath, statePath, async () => json({ session_id: "session-1", status: "thinking" }));
  const result = await status(statePath, async (_url, options) => {
    assert.equal(options.method, "GET");
    return json({ session_id: "session-1", status: "waiting_for_input", messages: [{ content: "Which voice?" }] });
  });
  assert.equal(result.needsInput, true);
  assert.equal(JSON.parse(readFileSync(statePath)).session.messages[0].content, "Which voice?");
  await assert.rejects(download(statePath, join(tmpdir(), "not-created.mp4")), /not completed/);
});

test("completed media downloads without leaking the HeyGen credential", async (t) => {
  const { statePath, directory } = fixture(t);
  writeFileSync(statePath, JSON.stringify({ version: 1, phase: "completed", video: { status: "completed", video_url: "https://files.example/final.mp4" } }));
  const output = join(directory, "final.mp4");
  const result = await download(statePath, output, async (url, options) => {
    assert.equal(url, "https://files.example/final.mp4");
    assert.equal(options.headers, undefined);
    return new Response("offline-media-fixture", { headers: { "content-type": "video/mp4" } });
  });
  assert.ok(result.bytes > 0);
  assert.equal(result.verificationRequired, true);
  await assert.rejects(download(statePath, output), /already exists/);
});

test("a concurrent download cannot overwrite another completed artifact", async (t) => {
  const { statePath, directory } = fixture(t);
  writeFileSync(statePath, JSON.stringify({ version: 1, phase: "completed", video: { status: "completed", video_url: "https://files.example/final.mp4" } }));
  const output = join(directory, "final.mp4");
  await assert.rejects(download(statePath, output, async () => {
    writeFileSync(output, "already-completed-video");
    return new Response("different-video", { headers: { "content-type": "video/mp4" } });
  }), { code: "EEXIST" });
  assert.equal(readFileSync(output, "utf8"), "already-completed-video");
});
