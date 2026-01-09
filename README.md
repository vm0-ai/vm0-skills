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

Last tested: 2026-01-09 | Total: 67 skills | Working: 20 (7 fully + 13 partially) | Failed: 47 | Success Rate: 29.9%

### Fully Tested & Working Skills (7)

**Web & Data:**
- [brave-search](./brave-search) - Privacy-focused web search - All tests passed
- [hackernews](./hackernews) - Hacker News API access - All tests passed

**Data & Analytics:**
- [cronlytic](./cronlytic) - Cron job monitoring - All tests passed

**Productivity & Development:**
- [gitlab](./gitlab) - GitLab API integration - All tests passed (note: API rate limited during testing)
- [jira](./jira) - Issue and project tracking - All tests passed

**Storage & Media:**
- [minio](./minio) - Object storage service - All tests passed

**Messaging & Notifications:**
- [discord-webhook](./discord-webhook) - Discord webhook integration - All tests passed

### Partially Working Skills (13)

These skills have core functionality working but encountered some issues:

**Web & Data:**
- [rss-fetch](./rss-fetch) - RSS feed parsing - Partially working (7/9 tests passed)

**Data & Analytics:**
- [apify](./apify) - Web scraping and automation - Partially working
- [axiom](./axiom) - Log management and analytics - Partially working (missing some environment variables)
- [bright-data](./bright-data) - Proxy and web unlocker - Partially working (account suspended/locked)
- [scrapeninja](./scrapeninja) - Web scraping service - Partially working (account suspended/locked)
- [supadata](./supadata) - Data enrichment API - Partially working

**Communication & Collaboration:**
- [dev.to](./dev.to) - Developer community platform - Partially working (API rate limited)
- [discord](./discord) - Discord bot API - Partially working (account suspended/locked)

**Productivity & Development:**
- [figma](./figma) - Design tool API - Partially working
- [intercom](./intercom) - Customer messaging platform - Partially working (missing environment variables)
- [lark](./lark) - Team collaboration platform - Partially working
- [monday](./monday) - Work management platform - Partially working
- [shortio](./shortio) - URL shortening service - Partially working

### Known Issues / Failing Skills (47)

These skills require environment variables, API permissions, or configuration updates:

**Missing Environment Variables (18 skills):**
- [axiom](./axiom) - Log management and analytics - Missing: Required API keys
- [bitrix](./bitrix) - CRM and collaboration platform - Missing: BITRIX_WEBHOOK_URL
- [cloudinary](./cloudinary) - Image management and transformation - Missing: Required API keys
- [firecrawl](./firecrawl) - Web scraping and crawling - Missing: Required API keys
- [github-copilot](./github-copilot) - AI pair programming - Missing: GITHUB_TOKEN
- [gmail](./gmail) - Google Mail API - Missing: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN (27 examples failed)
- [google-sheets](./google-sheets) - Spreadsheet automation - Missing: GOOGLE_SHEETS_CLIENT_SECRET, GOOGLE_SHEETS_REFRESH_TOKEN
- [imgur](./imgur) - Image hosting and sharing - Missing: IMGUR_CLIENT_ID
- [instagram](./instagram) - Instagram API integration - Missing: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID
- [intercom](./intercom) - Customer messaging platform - Missing: INTERCOM_ACCESS_TOKEN
- [mercury](./mercury) - Web parser API - Missing: MERCURY_API_TOKEN
- [podchaser](./podchaser) - Podcast database API - Missing: PODCHASER_CLIENT_ID, PODCHASER_CLIENT_SECRET
- [qiita](./qiita) - Japanese tech community - Missing: Required API token
- [reportei](./reportei) - Marketing reports - Missing: REPORTEI_API_TOKEN (16 examples failed)
- [resend](./resend) - Transactional email service - Missing: RESEND_API_KEY
- [streak](./streak) - CRM for Gmail - Missing: STREAK_API_KEY
- [supabase](./supabase) - Backend as a service - Missing: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY
- [zendesk](./zendesk) - Customer support platform - Missing: ZENDESK_API_TOKEN, ZENDESK_EMAIL, ZENDESK_SUBDOMAIN

**Insufficient API Credits / Account Issues (7 skills):**
- [bright-data](./bright-data) - Proxy and web unlocker - Account suspended/locked
- [browserbase](./browserbase) - Browser automation platform - Account suspended/locked
- [discord](./discord) - Discord bot API - Account suspended/locked
- [fal.ai](./fal.ai) - AI image generation - Insufficient API credits
- [rss-fetch](./rss-fetch) - RSS feed parsing - Account suspended/locked
- [runway](./runway) - AI video generation - Insufficient API credits (4/9 tests passed before credit exhaustion)
- [scrapeninja](./scrapeninja) - Web scraping service - Account suspended/locked

**Authentication Failed (5 skills):**
- [kommo](./kommo) - Sales automation CRM - Authentication credentials invalid or expired
- [pdfco](./pdfco) - PDF creation and manipulation - Authentication credentials invalid or expired
- [pdforge](./pdforge) - PDF generation service - Authentication credentials invalid or expired
- [perplexity](./perplexity) - AI search engine - Authentication credentials invalid or expired
- [pushinator](./pushinator) - Push notification service - Authentication credentials invalid or expired

**Permission Denied (2 skills):**
- [qdrant](./qdrant) - Vector database - API permissions insufficient for requested operations
- [sentry](./sentry) - Error tracking and monitoring - API permissions insufficient for requested operations

**API Rate Limit (5 skills):**
- [dev.to](./dev.to) - Developer community platform - API rate limit exceeded during testing
- [elevenlabs](./elevenlabs) - Text-to-speech voice generation - API rate limit exceeded during testing
- [gitlab](./gitlab) - GitLab API integration - API rate limit exceeded (20 tests attempted)
- [htmlcsstoimage](./htmlcsstoimage) - HTML/CSS to image conversion - API rate limit exceeded during testing
- [plausible](./plausible) - Privacy-focused analytics - API rate limit exceeded during testing

**Other Issues (18 skills):**
- [browserless](./browserless) - Headless browser automation - See detailed report
- [chatwoot](./chatwoot) - Customer engagement platform - See detailed report
- [deepseek](./deepseek) - AI language model for chat - See detailed report
- [github](./github) - GitHub automation via gh CLI - See detailed report
- [instantly](./instantly) - Email outreach platform - See detailed report
- [linear](./linear) - Issue tracking for software teams - See detailed report
- [minimax](./minimax) - AI language model API - See detailed report
- [notion](./notion) - Note-taking and database - See detailed report
- [openai](./openai) - GPT models and completions - See detailed report
- [pdf4me](./pdf4me) - PDF processing service - See detailed report
- [serpapi](./serpapi) - Search engine results - See detailed report
- [slack](./slack) - Team collaboration platform - See detailed report
- [slack-webhook](./slack-webhook) - Slack incoming webhooks - See detailed report
- [tavily](./tavily) - AI research with citations - See detailed report
- [twenty](./twenty) - CRM platform - See detailed report
- [youtube](./youtube) - YouTube data and video management - See detailed report
- [zapsign](./zapsign) - Electronic signature service - See detailed report (5/10 tests passed)
- [zeptomail](./zeptomail) - Email service - See detailed report

## Contributing

To add a new skill or improve an existing one:

1. Follow the [Agent Skills specification](https://agentskills.io/specification)
2. Include a `SKILL.md` file with usage examples
3. Ensure all examples are tested and working
4. Submit a pull request


## Resources

- [Agent Skills Specification](https://agentskills.io/specification)
