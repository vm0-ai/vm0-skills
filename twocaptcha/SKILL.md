---
name: twocaptcha
description: 2Captcha API for solving reCAPTCHA, hCaptcha, image, and audio captchas during automated browsing. Use when user mentions "2Captcha", "solve captcha", or hits a captcha in a browser-use / scraping flow.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name TWOCAPTCHA_TOKEN` or `zero doctor check-connector --url https://api.2captcha.com/createTask --method POST`.

## How to Use

2Captcha authenticates by including the API key as the `clientKey` field
in the JSON request body. The base URL is `https://api.2captcha.com`.
Solving is asynchronous: create a task, then poll until ready.

### 1. Solve a reCAPTCHA v2

Write to `/tmp/twocaptcha_request.json`:

```json
{
  "clientKey": "TWOCAPTCHA_TOKEN_PLACEHOLDER",
  "task": {
    "type": "RecaptchaV2TaskProxyless",
    "websiteURL": "https://example.com",
    "websiteKey": "6Lc_aCMTAAAAABx7u2N0D1XBlhdshwklSDLZayp_"
  }
}
```

Replace the `clientKey` value with `$TWOCAPTCHA_TOKEN` before sending, then run:

```bash
sed -i "s/TWOCAPTCHA_TOKEN_PLACEHOLDER/$TWOCAPTCHA_TOKEN/" /tmp/twocaptcha_request.json
curl -s -X POST "https://api.2captcha.com/createTask" \
  -H "Content-Type: application/json" \
  -d @/tmp/twocaptcha_request.json
```

The response contains a `taskId`.

### 2. Poll for the solution

Write to `/tmp/twocaptcha_poll.json`:

```json
{
  "clientKey": "TWOCAPTCHA_TOKEN_PLACEHOLDER",
  "taskId": 12345
}
```

Then:

```bash
sed -i "s/TWOCAPTCHA_TOKEN_PLACEHOLDER/$TWOCAPTCHA_TOKEN/" /tmp/twocaptcha_poll.json
curl -s -X POST "https://api.2captcha.com/getTaskResult" \
  -H "Content-Type: application/json" \
  -d @/tmp/twocaptcha_poll.json
```

When `status` is `ready`, the `solution.gRecaptchaResponse` field is the
token to inject into the target page's hidden `g-recaptcha-response`
textarea.

### 3. Solve an hCaptcha

Replace `task.type` with `HCaptchaTaskProxyless` and the rest of the
flow is identical.

### 4. Solve an image captcha (base64)

Write to `/tmp/twocaptcha_request.json`:

```json
{
  "clientKey": "TWOCAPTCHA_TOKEN_PLACEHOLDER",
  "task": {
    "type": "ImageToTextTask",
    "body": "<base64 PNG/JPG bytes>"
  }
}
```

### 5. Check balance

Write to `/tmp/twocaptcha_balance.json`:

```json
{ "clientKey": "TWOCAPTCHA_TOKEN_PLACEHOLDER" }
```

Then:

```bash
sed -i "s/TWOCAPTCHA_TOKEN_PLACEHOLDER/$TWOCAPTCHA_TOKEN/" /tmp/twocaptcha_balance.json
curl -s -X POST "https://api.2captcha.com/getBalance" \
  -H "Content-Type: application/json" \
  -d @/tmp/twocaptcha_balance.json
```

## Guidelines

1. **Async only** — average solve time is 10-60s for reCAPTCHA, 5-15s for image; poll every 5s.
2. **`websiteKey` lookup** — extract from the target page's `data-sitekey` attribute on the captcha div.
3. **Proxyless vs proxy tasks** — `*TaskProxyless` is simpler; use the proxy variants when the site fingerprints solver IPs.
4. **Cost** — image captchas are cheapest, reCAPTCHA v3 the most expensive; check `getBalance` before high-volume runs.
5. **Top-up alerts** — set up balance alerts in the 2Captcha dashboard; running out mid-flow looks like silent failure.
