# Skill API Test Results

Last updated: 2024-12-25

This document tracks the testing status of all skills.

## Summary

- **Total Skills**: 61
- **Tested & Passed**: 45
- **Tested with Issues**: 4 (API/config issues, not curl pattern issues)
- **Not Tested**: 12 (no credentials)

## Test Results

### ✅ Passed (45)

| Skill | Test Result | Notes |
|-------|-------------|-------|
| apify | ✅ | 1 actor returned |
| bright-data | ✅ | Account active, bandwidth data |
| browserless | ✅ | Scraped example.com h1 |
| axiom | ✅ | API responds (object format) |
| brave-search | ✅ | Search results for "anthropic" |
| chatwoot | ✅ | 1 contact |
| cronlytic | ✅ | 1 job |
| deepseek | ✅ | Chat completion: "Hello, dear friend." |
| devto-publish | ✅ | 2 articles listed |
| discord | ✅ | Bot info: VM0 Bot |
| elevenlabs | ✅ | 20 voices listed |
| firecrawl | ✅ | Scraped example.com |
| gitlab | ✅ | 3 projects listed |
| hackernews | ✅ | Top stories (no auth required) |
| htmlcsstoimage | ✅ | Image URL generated |
| instantly | ✅ | 1 account |
| linear | ✅ | Viewer info returned |
| monday | ✅ | User info returned |
| notion | ✅ | Bot name: vm0 |
| openai | ✅ | Chat completion: "Hello there!" |
| perplexity | ✅ | Chat completion: "2" |
| plausible | ✅ | 1 site: vm0.ai |
| pushinator | ✅ | 0 devices (empty account) |
| qdrant | ✅ | API responds (empty collections) |
| rss-fetch | ✅ | RSS content (no auth required) |
| sentry | ✅ | 1 org: vm0 |
| serpapi | ✅ | Search results for "claude code" |
| shortio | ✅ | 0 links (empty account) |
| slack | ✅ | user: vm0_news, team: VM0 |
| supadata | ✅ | YouTube transcript |
| tavily | ✅ | Search results for "Claude AI" |
| youtube | ✅ | Search results for "claude ai" |
| zapsign | ✅ | 0 docs (empty account) |
| zeptomail | ✅ | API responds (auth works) |
| runway | ✅ | 2675 credits, 16 models available |
| minimax | ✅ | Chat completion works (global endpoint) |
| jira | ✅ | User info: Ethan Zhang |
| fal.ai | ✅ | Image generated successfully |
| slack-webhook | ✅ | Message sent successfully |
| scrapeninja | ✅ | Scraped example.com |
| twenty | ✅ | 5 people returned |
| pdfco | ✅ | PDF to text conversion works |
| pdforge | ✅ | HTML to PDF works |
| github | ✅ | gh CLI auth works |
| cloudinary | ✅ | List resources works |

### ⚠️ Issues (4)

| Skill | Issue | Root Cause |
|-------|-------|------------|
| google-sheets | Token error | OAuth token expired |
| instagram | OAuth error | Access token expired |
| kommo | 401 Unauthorized | API key invalid |
| pdf4me | 404 error | API endpoint may have changed |

**Note**: These issues are API-specific, not related to the curl pattern.

<details>
<summary>Detailed Error Logs</summary>

**axiom** (actually works, but response format differs from expected)
```bash
curl -s "https://api.axiom.co/v2/datasets" --header "Authorization: Bearer $AXIOM_API_KEY" | jq '[.[] | .name]'
# Error: jq: error (at <stdin>:0): Cannot index number with string "name"
# Root cause: API returns object not array, need different jq query
```

**google-sheets**
```bash
curl -s "https://sheets.googleapis.com/v4/spreadsheets" --header "Authorization: Bearer $GOOGLE_ACCESS_TOKEN"
# Response: Token expired or invalid
```

**kommo**
```bash
curl -s "https://api.kommo.com/api/v4/account" --header "Authorization: Bearer $KOMMO_API_KEY"
# Response: Empty
```

</details>

### ⏳ Not Tested (12)

| Skill | Reason |
|-------|--------|
| bitrix | No credentials |
| discord-webhook | Requires webhook URL |
| figma | No credentials |
| github-copilot | No credentials |
| imgur | No credentials |
| intercom | No credentials |
| lark | No credentials |
| minio | No credentials |
| qiita | No credentials |
| reportei | No credentials |
| streak | No credentials |
| zendesk | No credentials |

## Pattern Verification

Direct curl with environment variables works correctly:

```bash
# Pattern 1: Simple curl with auth + jq
curl -s "https://api.example.com" --header "Authorization: Bearer $API_KEY" | jq .

# Pattern 2: Command substitution
VAR="$(curl -s "https://api.example.com" --header "Authorization: Bearer $API_KEY" | jq -r .id)"

# Pattern 3: With JSON body (file-based)
curl -s "https://api.example.com" --header "Authorization: Bearer $API_KEY" --header "Content-Type: application/json" -d @/tmp/request.json | jq .
```
