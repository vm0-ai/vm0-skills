---
name: checkr
description: Checkr API for background checks, candidates, invitations, packages, reports, and screening workflows. Use when user mentions "Checkr", "background check", "candidate screening", "report status", "packages", or "FCRA".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name CHECKR_TOKEN` or `zero doctor check-connector --url https://api.checkr.com/v1/packages --method GET`.

## Official Docs

- API docs: https://docs.checkr.com/
- Background check API overview: https://checkr.com/our-technology/background-check-api

## Authentication

Connect the Checkr connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors). The connector provides:

- `CHECKR_TOKEN`: Checkr API key

Checkr uses HTTP Basic auth with the API key as the username and an empty password:

```bash
curl -u "$CHECKR_TOKEN:" https://api.checkr.com/v1/packages
```

Base URL:

```bash
https://api.checkr.com/v1
```

## Candidates

### Create a Candidate

Write the payload to `/tmp/checkr_candidate.json`:

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.doe@example.com"
}
```

Then:

```bash
curl -s -X POST "https://api.checkr.com/v1/candidates" \
  -u "$CHECKR_TOKEN:" \
  --header "Content-Type: application/json" \
  -d @/tmp/checkr_candidate.json | jq .
```

### Get a Candidate

```bash
curl -s "https://api.checkr.com/v1/candidates/<candidate-id>" \
  -u "$CHECKR_TOKEN:" | jq .
```

## Packages

### List Packages

Use packages to determine which screening package slug to request.

```bash
curl -s "https://api.checkr.com/v1/packages" \
  -u "$CHECKR_TOKEN:" | jq .
```

## Invitations

### Create an Invitation

Invitations let Checkr collect candidate information through a hosted flow.

Write the payload to `/tmp/checkr_invitation.json`:

```json
{
  "candidate_id": "<candidate-id>",
  "package": "<package-slug>",
  "work_locations": [
    {
      "country": "US",
      "state": "CA",
      "city": "San Francisco"
    }
  ]
}
```

Then:

```bash
curl -s -X POST "https://api.checkr.com/v1/invitations" \
  -u "$CHECKR_TOKEN:" \
  --header "Content-Type: application/json" \
  -d @/tmp/checkr_invitation.json | jq .
```

### Cancel an Invitation

```bash
curl -s -X DELETE "https://api.checkr.com/v1/invitations/<invitation-id>" \
  -u "$CHECKR_TOKEN:" | jq .
```

## Reports

### Create a Report

Use reports when you already have candidate data and authorization to run the screen.

Write the payload to `/tmp/checkr_report.json`:

```json
{
  "candidate_id": "<candidate-id>",
  "package": "<package-slug>"
}
```

Then:

```bash
curl -s -X POST "https://api.checkr.com/v1/reports" \
  -u "$CHECKR_TOKEN:" \
  --header "Content-Type: application/json" \
  -d @/tmp/checkr_report.json | jq .
```

### Get a Report

```bash
curl -s "https://api.checkr.com/v1/reports/<report-id>" \
  -u "$CHECKR_TOKEN:" | jq .
```

## Guidelines

- Background checks are regulated. Only create invitations or reports after the user confirms the candidate authorization and required compliance flow.
- Prefer invitation flows when the candidate should supply their own PII.
- Treat candidate PII, report status, adjudication details, and screening results as sensitive data.
- Use test API keys and packages for integration testing whenever possible.
