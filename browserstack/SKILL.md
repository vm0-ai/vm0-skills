---
name: browserstack
description: BrowserStack API for cross-browser and device testing. Use when user mentions "BrowserStack", "cross-browser testing", "Selenium grid", "App Live", "Automate", "App Automate", or "real device testing".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name BROWSERSTACK_USERNAME` or `zero doctor check-connector --url https://api.browserstack.com/automate/plan.json --method GET`

## How to Use

All examples assume `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` are set. BrowserStack uses HTTP Basic auth — username and access key are passed via `-u`.

Hosts by product:
- Live / general account: `https://api.browserstack.com`
- Automate (Selenium): `https://api.browserstack.com/automate`
- App Automate (Appium): `https://api-cloud.browserstack.com/app-automate`
- Screenshots: `https://www.browserstack.com/screenshots`

Pass credentials with `-u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY"`.

### 1. Verify the Credentials

```bash
curl -s "https://api.browserstack.com/automate/plan.json" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY"
```

Returns the plan name and current parallel-session usage. If you see `401`, the credentials are wrong.

### 2. List Available Browsers (Automate)

Returns every OS / browser / version combo that Automate supports:

```bash
curl -s "https://api.browserstack.com/automate/browsers.json" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" | jq '.[] | {os, os_version, browser, browser_version}'
```

### 3. List Recent Automate Builds

```bash
curl -s "https://api.browserstack.com/automate/builds.json?limit=10" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" | jq '.[] | .automation_build | {hashed_id, name, status, duration}'
```

### 4. List Sessions Within a Build

Replace `<build-id>` with a `hashed_id` from step 3:

```bash
curl -s "https://api.browserstack.com/automate/builds/<build-id>/sessions.json?limit=20" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" | jq '.[] | .automation_session | {hashed_id, name, status, browser, browser_version, os, duration}'
```

### 5. Fetch a Single Session

```bash
curl -s "https://api.browserstack.com/automate/sessions/<session-id>.json" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY"
```

The response includes `browser_url` (the BrowserStack dashboard URL), `logs`, `video_url`, and `selenium_logs_url`.

### 6. Update Session Status

Mark a session passed or failed and attach a reason (typical end-of-test hook):

Write to `/tmp/browserstack_request.json`:

```json
{ "status": "passed", "reason": "All assertions passed" }
```

```bash
curl -s -X PUT "https://api.browserstack.com/automate/sessions/<session-id>.json" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" --header "Content-Type: application/json" -d @/tmp/browserstack_request.json
```

### 7. Download a Session Video

The video URL is exposed in the session response (step 5). Once you have it, download with the same credentials:

```bash
curl -s "<session-video-url>" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" -o /tmp/session_video.mp4
```

### 8. Delete a Session

```bash
curl -s -X DELETE "https://api.browserstack.com/automate/sessions/<session-id>.json" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY"
```

### 9. List App Automate Builds

```bash
curl -s "https://api-cloud.browserstack.com/app-automate/builds.json?limit=10" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" | jq '.[] | .automation_build | {hashed_id, name, status}'
```

### 10. Upload an App for App Automate

Uploads an `.apk` or `.ipa`. Returns an `app_url` (e.g. `bs://abc123`) to pass in your Appium capabilities:

```bash
curl -s -X POST "https://api-cloud.browserstack.com/app-automate/upload" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" -F "file=@/path/to/app.apk"
```

### 11. List Uploaded Apps

```bash
curl -s "https://api-cloud.browserstack.com/app-automate/recent_apps" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" | jq '.[] | {app_name, app_url, uploaded_at}'
```

### 12. Generate Screenshots Across Browsers

Write to `/tmp/browserstack_request.json`:

```json
{
  "url": "https://example.com",
  "tunnel": false,
  "callback_url": "",
  "win_res": "1280x1024",
  "mac_res": "1920x1080",
  "browsers": [
    { "os": "Windows", "os_version": "11", "browser": "chrome", "browser_version": "latest" },
    { "os": "OS X", "os_version": "Sonoma", "browser": "safari", "browser_version": "17.0" }
  ]
}
```

```bash
curl -s -X POST "https://www.browserstack.com/screenshots" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" --header "Content-Type: application/json" -d @/tmp/browserstack_request.json
```

Poll the returned job ID until each browser's `state` is `done`:

```bash
curl -s "https://www.browserstack.com/screenshots/<job-id>.json" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" | jq '.screenshots[] | {browser, state, image_url}'
```

### 13. Get Console / Network / Appium Logs for a Session

```bash
curl -s "https://api.browserstack.com/automate/sessions/<session-id>/consolelogs" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY"
curl -s "https://api.browserstack.com/automate/sessions/<session-id>/networklogs" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY"
curl -s "https://api-cloud.browserstack.com/app-automate/sessions/<session-id>/appiumlogs" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY"
```

## Common Workflows

### Mark every running session as failed (incident cleanup)

```bash
# 1. Find sessions still in "running" state in the most recent build
curl -s "https://api.browserstack.com/automate/builds.json?limit=1" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" | jq -r '.[0].automation_build.hashed_id'
# Then for each <build-id>:
curl -s "https://api.browserstack.com/automate/builds/<build-id>/sessions.json?status=running" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" | jq -r '.[].automation_session.hashed_id'

# 2. For each session ID, mark it failed
# Write to /tmp/browserstack_request.json: { "status": "failed", "reason": "Incident cleanup" }
curl -s -X PUT "https://api.browserstack.com/automate/sessions/<session-id>.json" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" --header "Content-Type: application/json" -d @/tmp/browserstack_request.json
```

### Check parallel-session capacity before launching

```bash
curl -s "https://api.browserstack.com/automate/plan.json" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" | jq '{parallel_sessions_running, parallel_sessions_max_allowed}'
```

## Guidelines

1. Automate (Selenium/web) lives at `api.browserstack.com`; App Automate (mobile Appium) lives at `api-cloud.browserstack.com`. The screenshots service has its own host. Don't cross the streams.
2. Authentication is the same across all three — Basic auth with username + access key.
3. Session and build IDs are `hashed_id` strings — they look opaque, not numeric.
4. Builds list endpoints return wrapping objects (`{automation_build: {...}}`) — drill into them with jq.
5. App uploads (step 10) take `multipart/form-data`. Don't `--data-urlencode`.
6. Video and log URLs are short-lived signed URLs; download them in the same job once you have the session record.
7. Parallel-session limits are billed per-plan — calling `plan.json` before launching avoids `403 Parallel limit exceeded` errors.
8. Pagination: most list endpoints use `limit` and `offset` (max `limit=100` on most).
9. Screenshots API is asynchronous — submit, get a job ID, poll until each browser entry has `state: "done"`.

## API Reference

- Automate REST: https://www.browserstack.com/automate/rest-api
- App Automate REST: https://www.browserstack.com/app-automate/rest-api
- Screenshots: https://www.browserstack.com/screenshots/api
- Capabilities builder: https://www.browserstack.com/automate/capabilities
- Authentication: https://www.browserstack.com/docs/automate/selenium/getting-started/api-authentication
