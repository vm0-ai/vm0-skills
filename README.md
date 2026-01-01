# vm0-skills

A collection of reusable [Agent Skills](https://agentskills.io) for AI agents.

Skills follow the [Agent Skills specification](https://agentskills.io/specification).

## Skills

**Test Summary:** 67 skills tested | 8 passed (12%) | 59 failed (88%) | Last tested: 2026-01-01

### ✅ Passing Skills (8)

| Skill | Description |
|-------|-------------|
| [brave-search](./brave-search) | Privacy-focused web search API - All search operations working |
| [deepseek](./deepseek) | AI language model for chat completions - All core functionality working |
| [figma](./figma) | Design tool API integration - All core functionality working |
| [github](./github) | GitHub repository management with gh CLI - All core functionality working |
| [instantly](./instantly) | Email outreach automation platform - All core functionality working |
| [linear](./linear) | Issue tracking for software teams - All core functionality working |
| [openai](./openai) | OpenAI GPT models and completions API - All core functionality working |
| [tavily](./tavily) | AI research and search with citations - All core functionality working |

### ❌ Skills Requiring Configuration (59)

These skills require API keys, tokens, or other environment variables to function:

| Skill | Configuration Needed |
|-------|---------------------|
| [apify](./apify) | APIFY_API_TOKEN |
| [axiom](./axiom) | AXIOM_PERSONAL_ACCESS_TOKEN, AXIOM_ORG_ID |
| [bitrix](./bitrix) | BITRIX_DOMAIN, BITRIX_USER_ID, BITRIX_WEBHOOK_TOKEN |
| [bright-data](./bright-data) | BRIGHTDATA_API_KEY |
| [browserbase](./browserbase) | BROWSERBASE_API_KEY, BROWSERBASE_PROJECT_ID |
| [browserless](./browserless) | BROWSERLESS_API_KEY |
| [chatwoot](./chatwoot) | CHATWOOT_API_KEY, CHATWOOT_ACCOUNT_ID |
| [cloudinary](./cloudinary) | CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET |
| [cronlytic](./cronlytic) | CRONLYTIC_API_KEY |
| [dev.to](./dev.to) | DEVTO_API_KEY |
| [discord-webhook](./discord-webhook) | DISCORD_WEBHOOK_URL |
| [discord](./discord) | DISCORD_BOT_TOKEN |
| [elevenlabs](./elevenlabs) | ELEVENLABS_API_KEY |
| [fal.ai](./fal.ai) | FAL_KEY |
| [firecrawl](./firecrawl) | FIRECRAWL_API_KEY |
| [github-copilot](./github-copilot) | GitHub Copilot subscription |
| [gitlab](./gitlab) | GITLAB_TOKEN, GITLAB_PROJECT_ID |
| [gmail](./gmail) | Gmail OAuth credentials |
| [google-sheets](./google-sheets) | Google Sheets OAuth credentials |
| [hackernews](./hackernews) | No auth required - check API availability |
| [htmlcsstoimage](./htmlcsstoimage) | HCTI_API_USER_ID, HCTI_API_KEY |
| [imgur](./imgur) | IMGUR_CLIENT_ID |
| [instagram](./instagram) | INSTAGRAM_ACCESS_TOKEN |
| [intercom](./intercom) | INTERCOM_ACCESS_TOKEN |
| [jira](./jira) | JIRA_API_TOKEN, JIRA_DOMAIN, JIRA_EMAIL |
| [kommo](./kommo) | KOMMO_DOMAIN, KOMMO_ACCESS_TOKEN |
| [lark](./lark) | LARK_APP_ID, LARK_APP_SECRET |
| [mercury](./mercury) | MERCURY_API_KEY |
| [minimax](./minimax) | MINIMAX_API_KEY, MINIMAX_GROUP_ID |
| [minio](./minio) | MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY |
| [monday](./monday) | MONDAY_API_TOKEN |
| [notion](./notion) | NOTION_API_KEY |
| [pdf4me](./pdf4me) | PDF4ME_API_KEY |
| [pdfco](./pdfco) | PDFCO_API_KEY |
| [pdforge](./pdforge) | PDFORGE_API_KEY |
| [perplexity](./perplexity) | PERPLEXITY_API_KEY |
| [plausible](./plausible) | PLAUSIBLE_API_KEY, PLAUSIBLE_SITE_ID |
| [podchaser](./podchaser) | PODCHASER_API_KEY |
| [pushinator](./pushinator) | PUSHINATOR_API_KEY |
| [qdrant](./qdrant) | QDRANT_URL, QDRANT_API_KEY |
| [qiita](./qiita) | QIITA_ACCESS_TOKEN |
| [reportei](./reportei) | REPORTEI_API_KEY |
| [resend](./resend) | RESEND_API_KEY |
| [rss-fetch](./rss-fetch) | No auth required - check RSS feed URL |
| [runway](./runway) | RUNWAY_API_KEY |
| [scrapeninja](./scrapeninja) | SCRAPENINJA_API_KEY |
| [sentry](./sentry) | SENTRY_AUTH_TOKEN, SENTRY_ORG_SLUG |
| [serpapi](./serpapi) | SERPAPI_API_KEY |
| [shortio](./shortio) | SHORTIO_API_KEY, SHORTIO_DOMAIN_ID |
| [slack-webhook](./slack-webhook) | SLACK_WEBHOOK_URL |
| [slack](./slack) | SLACK_BOT_TOKEN |
| [streak](./streak) | STREAK_API_KEY |
| [supabase](./supabase) | SUPABASE_URL, SUPABASE_KEY |
| [supadata](./supadata) | SUPADATA_API_KEY |
| [twenty](./twenty) | TWENTY_API_KEY |
| [youtube](./youtube) | YOUTUBE_API_KEY |
| [zapsign](./zapsign) | ZAPSIGN_API_TOKEN |
| [zendesk](./zendesk) | ZENDESK_API_TOKEN, ZENDESK_SUBDOMAIN, ZENDESK_EMAIL |
| [zeptomail](./zeptomail) | ZEPTOMAIL_API_KEY |

**Status Legend:**
- ✅ PASS = All tests passing with proper configuration
- ❌ FAIL = Missing required credentials or API configuration

**Last Tested:** 2026-01-01

## Contributing

To add a new skill or improve an existing one, please ensure all examples in SKILL.md are tested and working before submitting a pull request.
