# vm0-skills

A collection of reusable [Agent Skills](https://agentskills.io) for AI agents.

Skills follow the [Agent Skills specification](https://agentskills.io/specification).

## Principles

1. **Focus on SaaS API Integration**: Focus on common SaaS API use cases, providing practical integration solutions
2. **Clean, Zero Scripts**: Keep code simple and clear, no redundant scripts, easy for AI Agents to learn and understand
3. **Security First**: All API calls are documented in SKILL.md for easy security auditing and compliance checks

## Installation

There are multiple ways to install and use these skills:

### 1. Using Claude Code Marketplace

```bash
# Add marketplace
/plugin marketplace add vm0-ai/vm0-skills

# Install specific skills
/plugin install notion@vm0-skills
/plugin install slack-webhook@vm0-skills
```

### 2. Direct Download

```bash
# Clone the repository
git clone https://github.com/vm0-ai/vm0-skills.git

# Copy to personal skills directory
cp -a vm0-skills/notion ~/.claude/skills/
cp -a vm0-skills/slack-webhook ~/.claude/skills/

# Or copy to project directory
cp -a vm0-skills/notion ./.claude/skills/
cp -a vm0-skills/slack-webhook ./.claude/skills/
```

After installation, restart Claude Code, then ask "What skills are available?" to see installed skills.

## Skills Test Status

Last tested: 2026-01-13 | Total: 68 skills | Passed: 8 | Failed: 60 | Pass Rate: 11.8%

### Fully Functional Skills (8)

These skills have all tests passing with valid API credentials configured:

**AI & Machine Learning:**
- [linear](./linear) - Issue tracking for software teams - 13/13 tests passed (100%)
- [openai](./openai) - GPT models and completions - 13/13 tests passed (100%)
- [perplexity](./perplexity) - AI-powered search - 4/4 tests passed (100%)
- [tavily](./tavily) - Web search with AI - 2/2 tests passed (100%)

**Productivity & Collaboration:**
- [notion](./notion) - Documentation and database management - 11/11 tests passed (100%)

**Communication:**
- [resend](./resend) - Transactional email delivery - 12/12 tests passed (100%)

**Utilities:**
- [shortio](./shortio) - URL shortening service - 9/10 tests passed (90% - statistics endpoint deprecated)
- [youtube](./youtube) - YouTube data and video management - 16/16 tests passed (100%)

### Failed Skills by Category

#### Missing Environment Variables (45 skills)

These skills require API keys or configuration to be set:

- [apify](./apify) - Web scraping and automation - Missing: APIFY_API_TOKEN
- [axiom](./axiom) - Log management and analytics - Missing: AXIOM_API_TOKEN, AXIOM_DATASET
- [bitrix](./bitrix) - CRM and collaboration platform - Missing: BITRIX_WEBHOOK_URL
- [brave-search](./brave-search) - Privacy-focused web search - Missing: BRAVE_API_KEY
- [bright-data](./bright-data) - Proxy and web unlocker - Missing: BRIGHTDATA_API_TOKEN, BRIGHTDATA_CUSTOMER_ID, BRIGHTDATA_ZONE
- [browserbase](./browserbase) - Browser automation - Missing: BROWSERBASE_API_KEY, BROWSERBASE_PROJECT_ID
- [browserless](./browserless) - Headless browser automation - Missing: BROWSERLESS_API_TOKEN
- [chatwoot](./chatwoot) - Customer engagement platform - Missing: CHATWOOT_API_TOKEN, CHATWOOT_ACCOUNT_ID, CHATWOOT_BASE_URL
- [cloudinary](./cloudinary) - Media management - Missing: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- [cronlytic](./cronlytic) - Cron job monitoring - Missing: CRONLYTIC_API_KEY
- [deepseek](./deepseek) - AI language model - Missing: DEEPSEEK_API_KEY
- [dev.to](./dev.to) - Developer community platform - Missing: DEVTO_API_KEY
- [discord-webhook](./discord-webhook) - Discord webhook integration - Missing: DISCORD_WEBHOOK_URL
- [elevenlabs](./elevenlabs) - Text-to-speech voice generation - Missing: ELEVENLABS_API_KEY
- [fal.ai](./fal.ai) - AI image generation - Missing: FAL_KEY
- [figma](./figma) - Design tool API - Missing: FIGMA_ACCESS_TOKEN
- [firecrawl](./firecrawl) - Web scraping and crawling - Missing: FIRECRAWL_API_KEY
- [github-copilot](./github-copilot) - AI pair programming - Missing: GITHUB_TOKEN, GITHUB_COPILOT_TOKEN
- [gitlab](./gitlab) - GitLab API integration - Missing: GITLAB_ACCESS_TOKEN, GITLAB_PROJECT_ID
- [google-sheets](./google-sheets) - Spreadsheet automation - Missing: GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON
- [htmlcsstoimage](./htmlcsstoimage) - HTML/CSS to image conversion - Missing: HTMLCSSTOIMAGE_USER_ID, HTMLCSSTOIMAGE_API_KEY
- [imgur](./imgur) - Image hosting and sharing - Missing: IMGUR_CLIENT_ID
- [instantly](./instantly) - Email outreach platform - Missing: INSTANTLY_API_KEY
- [intercom](./intercom) - Customer messaging platform - Missing: INTERCOM_ACCESS_TOKEN
- [jira](./jira) - Issue and project tracking - Missing: JIRA_API_TOKEN, JIRA_EMAIL, JIRA_DOMAIN
- [kommo](./kommo) - Sales automation CRM - Missing: KOMMO_API_TOKEN, KOMMO_DOMAIN
- [lark](./lark) - Team collaboration platform - Missing: LARK_APP_ID, LARK_APP_SECRET, LARK_TENANT_ACCESS_TOKEN
- [mercury](./mercury) - Banking API - Missing: MERCURY_API_TOKEN
- [minimax](./minimax) - AI language model API - Missing: MINIMAX_API_KEY, MINIMAX_GROUP_ID
- [minio](./minio) - Object storage service - Missing: MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET
- [monday](./monday) - Work management platform - Missing: MONDAY_API_TOKEN
- [pdf4me](./pdf4me) - PDF processing service - Missing: PDF4ME_TOKEN
- [pdfco](./pdfco) - PDF creation and manipulation - Missing: PDFCO_API_KEY
- [pdforge](./pdforge) - PDF generation service - Missing: PDFORGE_API_KEY
- [plausible](./plausible) - Privacy-focused analytics - Missing: PLAUSIBLE_API_KEY, PLAUSIBLE_SITE_ID
- [podchaser](./podchaser) - Podcast database API - Missing: PODCHASER_API_KEY
- [pushinator](./pushinator) - Push notification service - Missing: PUSHINATOR_API_TOKEN
- [qdrant](./qdrant) - Vector database - Missing: QDRANT_API_KEY, QDRANT_URL
- [qiita](./qiita) - Japanese tech community - Missing: QIITA_ACCESS_TOKEN
- [reportei](./reportei) - Marketing reports - Missing: REPORTEI_API_TOKEN
- [runway](./runway) - AI video generation - Missing: RUNWAY_API_SECRET
- [scrapeninja](./scrapeninja) - Web scraping service - Missing: SCRAPENINJA_API_KEY
- [sentry](./sentry) - Error tracking and monitoring - Missing: SENTRY_AUTH_TOKEN, SENTRY_ORG_SLUG
- [serpapi](./serpapi) - Search engine results - Missing: SERPAPI_API_KEY
- [supabase](./supabase) - Backend as a service - Missing: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
- [vm0](./vm0) - Agent execution platform - Missing: VM0_API_KEY
- [zendesk](./zendesk) - Customer support platform - Missing: ZENDESK_API_TOKEN, ZENDESK_EMAIL, ZENDESK_SUBDOMAIN

#### Invalid/Expired API Keys (10 skills)

These skills have credentials configured but they are invalid or expired:

- [discord](./discord) - Discord bot API - Invalid bot token (401 Unauthorized)
- [gmail](./gmail) - Google Mail API - Invalid service account credentials (401 invalid_grant)
- [github](./github) - GitHub automation - Invalid GitHub token (401 Bad credentials)
- [instagram](./instagram) - Instagram API integration - Invalid/expired OAuth token (Error 190)
- [slack-webhook](./slack-webhook) - Slack incoming webhooks - Invalid webhook URL (invalid_payload)
- [streak](./streak) - CRM for Gmail - Invalid API key (401 Unauthorized)
- [supadata](./supadata) - Data enrichment API - API usage limit exceeded (429 rate limit)
- [twenty](./twenty) - CRM platform - Workspace not found or inaccessible (401 WORKSPACE_NOT_FOUND)
- [zapsign](./zapsign) - Electronic signature service - Valid API but 6/10 tests use placeholder URLs

#### Critical Documentation Issues (1 skill)

- **[zeptomail](./zeptomail)** - Email service - CRITICAL BUG: Documentation contains double "Zoho-enczapikey" prefix causing all tests to fail. Skill is functional but documentation needs immediate fix.

#### Missing OAuth Scopes (1 skill)

- [slack](./slack) - Team collaboration platform - Missing required OAuth scopes (channels:read, channels:write, chat:write, etc.) - 2/11 tests passed

#### External API Issues (1 skill)

- [hackernews](./hackernews) - Hacker News API access - External API unavailable (521 Origin Down)

#### Other Issues (2 skills)

- [rss-fetch](./rss-fetch) - RSS feed parsing - Curl download errors (exit code 23)

### Critical Issues Requiring Immediate Action

1. **ZeptoMail Documentation Bug** (CRITICAL): All 9 example commands in SKILL.md have incorrect Authorization header format causing 100% test failure even with valid credentials. Needs immediate fix.

2. **High-Value Skills with Invalid Keys**: GitHub, Gmail, Discord, Slack need credential refresh

3. **Missing Environment Variables**: 45 skills (66%) cannot be tested without proper API credentials

## Contributing

To add a new skill or improve an existing one:

1. Follow the [Agent Skills specification](https://agentskills.io/specification)
2. Include a `SKILL.md` file with usage examples
3. Ensure all examples are tested and working
4. Submit a pull request


## Resources

- [Agent Skills Specification](https://agentskills.io/specification)
