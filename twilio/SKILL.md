---
name: twilio
description: Twilio API for SMS, voice, WhatsApp, and Verify. Use when user mentions "Twilio", "send SMS", "voice call", "WhatsApp message", "phone number lookup", or "Verify OTP".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name TWILIO_ACCOUNT_SID` or `zero doctor check-connector --url https://api.twilio.com/2010-04-01/Accounts.json --method GET`

## How to Use

All examples assume `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are set. Twilio uses HTTP Basic auth — the Account SID is the username, the Auth Token is the password.

Base URL: `https://api.twilio.com/2010-04-01` (core REST API). Product subdomains for newer services: `verify.twilio.com`, `messaging.twilio.com`, `lookups.twilio.com`, `serverless.twilio.com`, `studio.twilio.com`.

Pass credentials to curl with `-u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN"`.

### 1. Verify the Credentials

Fetch the account record — a quick sanity check that the SID/token pair is valid:

```bash
curl -s "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID.json" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" | jq '{sid, friendly_name, status, type}'
```

### 2. Send an SMS

`From` must be a number you own (purchased through Twilio) or a Messaging Service SID. Body is plain text. Returns the message resource including `sid` and initial `status`:

```bash
curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" --data-urlencode "To=+14155552671" --data-urlencode "From=+14155550100" --data-urlencode "Body=Hello from vm0"
```

### 3. Send a WhatsApp Message

Prefix WhatsApp numbers with `whatsapp:`. Use Twilio's sandbox or an approved sender:

```bash
curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" --data-urlencode "To=whatsapp:+14155552671" --data-urlencode "From=whatsapp:+14155238886" --data-urlencode "Body=Hi via WhatsApp"
```

### 4. Send an MMS (with media)

Pass one or more `MediaUrl` values. Each URL must be publicly reachable:

```bash
curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" --data-urlencode "To=+14155552671" --data-urlencode "From=+14155550100" --data-urlencode "Body=See attached" --data-urlencode "MediaUrl=https://example.com/photo.jpg"
```

### 5. List Recent Messages

```bash
curl -s "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json?PageSize=20" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" | jq '.messages[] | {sid, from, to, status, body, date_sent}'
```

Filter by recipient or date:

```bash
curl -s -G "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" --data-urlencode "To=+14155552671" --data-urlencode "DateSent>=2026-04-01"
```

### 6. Fetch a Specific Message (by SID)

Replace `<message-sid>` (always starts with `SM`) with a value returned from the send/list endpoints:

```bash
curl -s "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages/<message-sid>.json" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN"
```

### 7. Make an Outbound Voice Call

The `Url` returns TwiML that drives the call. For a quick test, point it at the Twilio demo TwiML hosted on Twimlets:

```bash
curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Calls.json" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" --data-urlencode "To=+14155552671" --data-urlencode "From=+14155550100" --data-urlencode "Url=http://demo.twilio.com/docs/voice.xml"
```

### 8. List Recent Calls

```bash
curl -s "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Calls.json?PageSize=20" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" | jq '.calls[] | {sid, from, to, status, duration, start_time}'
```

### 9. List Phone Numbers You Own

```bash
curl -s "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/IncomingPhoneNumbers.json" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" | jq '.incoming_phone_numbers[] | {sid, phone_number, friendly_name, capabilities}'
```

### 10. Search for Available Numbers to Buy

Find a US local number with SMS + MMS capability:

```bash
curl -s "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/AvailablePhoneNumbers/US/Local.json?SmsEnabled=true&MmsEnabled=true&PageSize=10" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" | jq '.available_phone_numbers[] | {phone_number, locality, region}'
```

### 11. Look Up a Phone Number (Lookups v2)

Returns carrier, line type, country, and validity. Replace `<phone-number>` with an E.164-formatted number:

```bash
curl -s "https://lookups.twilio.com/v2/PhoneNumbers/<phone-number>?Fields=line_type_intelligence" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN"
```

### 12. Create a Verify Service (Verify v2 — OTP / 2FA)

```bash
curl -s -X POST "https://verify.twilio.com/v2/Services" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" --data-urlencode "FriendlyName=vm0 OTP"
```

The response includes a service SID (`VAxxxxxxxx...`) used in subsequent verifications.

### 13. Send a Verification Code

Replace `<verify-service-sid>` with the SID from step 12. Channel is `sms`, `call`, `whatsapp`, or `email`:

```bash
curl -s -X POST "https://verify.twilio.com/v2/Services/<verify-service-sid>/Verifications" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" --data-urlencode "To=+14155552671" --data-urlencode "Channel=sms"
```

### 14. Check a Verification Code

```bash
curl -s -X POST "https://verify.twilio.com/v2/Services/<verify-service-sid>/VerificationCheck" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" --data-urlencode "To=+14155552671" --data-urlencode "Code=123456"
```

`status` will be `approved`, `pending`, or `canceled`.

## Common Workflows

### Send an SMS and poll for delivery

```bash
# 1. Send and capture the message SID
curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" --data-urlencode "To=+14155552671" --data-urlencode "From=+14155550100" --data-urlencode "Body=Order #1234 ready" | jq -r '.sid'

# 2. Poll status until delivered, failed, or undelivered (replace <message-sid>)
curl -s "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages/<message-sid>.json" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" | jq '{status, error_code, error_message}'
```

### Buy a number from a search result

```bash
# 1. Search (see step 10) and copy a phone_number
# 2. Purchase it
curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/IncomingPhoneNumbers.json" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" --data-urlencode "PhoneNumber=<phone-number>"
```

## Guidelines

1. The Account SID always starts with `AC` and is 34 characters; Auth Tokens are 32 hex characters.
2. All form fields use `--data-urlencode` — Twilio rejects `application/json` on the classic `api.twilio.com` endpoints; payloads are `application/x-www-form-urlencoded`.
3. Phone numbers must be E.164 format (`+14155552671`). For WhatsApp, prefix with `whatsapp:`.
4. Newer products (Verify, Lookups, Messaging, Studio, Serverless) use product subdomains, not the `2010-04-01` REST root.
5. SMS status flows through `queued → sending → sent → delivered` (or `failed` / `undelivered`). Use webhook callbacks or poll the message resource — there's no list-of-deliveries stream.
6. Trial accounts can only send to verified numbers and Twilio prepends a trial header to every SMS.
7. Pagination uses `PageSize` (max 1000) and either `Page` or the `next_page_uri` field in the response.
8. Rate limits are account-wide and product-specific; expect ~100 messages/sec on standard senders, much lower on trial. Inspect `Twilio-Rate-Limit-Remaining`.
9. Verify codes default to 6 digits and 10 minutes; configure on the Verify Service resource.

## API Reference

- REST API overview: https://www.twilio.com/docs/iam/api
- Messages (SMS / MMS / WhatsApp): https://www.twilio.com/docs/messaging/api/message-resource
- Calls (Voice): https://www.twilio.com/docs/voice/api/call-resource
- Phone Numbers: https://www.twilio.com/docs/phone-numbers/api/incomingphonenumber-resource
- Lookups v2: https://www.twilio.com/docs/lookup/v2-api
- Verify v2: https://www.twilio.com/docs/verify/api
- Status callbacks: https://www.twilio.com/docs/usage/webhooks
