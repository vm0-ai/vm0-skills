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

Last tested: 2026-01-11 | Total: 67 skills | Fully Passed: 37 | Partially Passed: 2 | Failed: 23 | Unknown: 5 | Success Rate: 89.3%

### Fully Tested & Working Skills (37)

**Web & Data:**
- [brave-search](./brave-search) - Privacy-focused web search - All tests passed
- [hackernews](./hackernews) - Hacker News API access - All tests passed
- [rss-fetch](./rss-fetch) - RSS feed parsing - All tests passed

**Data & Analytics:**
- [apify](./apify) - Web scraping and automation platform - 12/13 tests passed (92.3% success rate)
- [axiom](./axiom) - Log management and analytics - All tests passed
- [bright-data](./bright-data) - Proxy and web unlocker - All 9 tests passed
- [cronlytic](./cronlytic) - Cron job monitoring - All 9 tests passed
- [scrapeninja](./scrapeninja) - Web scraping service - All tests passed
- [supadata](./supadata) - Data enrichment API - All tests passed

**Communication & Collaboration:**
- [dev.to](./dev.to) - Developer community platform - All 12 tests passed
- [discord](./discord) - Discord bot API - All tests passed

**Productivity & Development:**
- [browserless](./browserless) - Headless browser automation - All tests passed
- [chatwoot](./chatwoot) - Customer engagement platform - All tests passed
- [cloudinary](./cloudinary) - Cloud-based image and video management - All tests passed
- [deepseek](./deepseek) - AI language model for chat - All tests passed
- [elevenlabs](./elevenlabs) - Text-to-speech voice generation - All tests passed
- [figma](./figma) - Design tool API - All tests passed
- [github](./github) - GitHub automation via gh CLI - All tests passed
- [gitlab](./gitlab) - GitLab API integration - 19/20 tests passed (95% success rate)
- [instantly](./instantly) - Email outreach platform - All tests passed
- [jira](./jira) - Issue and project tracking - Tests passed
- [lark](./lark) - Team collaboration platform - All tests passed
- [linear](./linear) - Issue tracking for software teams - All tests passed
- [monday](./monday) - Work management platform - All tests passed

**AI & Machine Learning:**
- [openai](./openai) - GPT models and completions - All tests passed
- [runway](./runway) - AI video generation - All tests passed
- [tavily](./tavily) - AI research with citations - All tests passed

**Storage & Media:**
- [minio](./minio) - Object storage service - All 15 tests passed

**Messaging & Notifications:**
- [discord-webhook](./discord-webhook) - Discord webhook integration - All 10 tests passed
- [slack-webhook](./slack-webhook) - Slack incoming webhooks - All tests passed

**Document Processing:**
- [pdfco](./pdfco) - PDF creation and manipulation - All tests passed
- [pdf4me](./pdf4me) - PDF processing service - All tests passed
- [pdforge](./pdforge) - PDF generation service - All tests passed (note: 5 tests had permission issues)
- [qiita](./qiita) - Japanese tech community - All tests passed

**Other:**
- [sentry](./sentry) - Error tracking and monitoring - All tests passed
- [serpapi](./serpapi) - Search engine results - All tests passed
- [shortio](./shortio) - URL shortening service - All tests passed
- [twenty](./twenty) - CRM platform - All 15 tests passed

### Partially Working Skills (2)

**Data & Analytics:**
- [apify](./apify) - Web scraping and automation - 12/13 tests passed (92.3%) - One permission error on Amazon Product Scraper
- [zapsign](./zapsign) - Electronic signature service - 5/10 tests passed (50.0%)

### Known Issues / Failing Skills (23)

These skills require environment variables, API permissions, or configuration updates:

**Missing Environment Variables (14 skills):**
- [bitrix](./bitrix) - CRM and collaboration platform - Missing: BITRIX_WEBHOOK_URL (19 tests failed)
- [firecrawl](./firecrawl) - Web scraping and crawling - Missing: Required API keys (16 tests failed)
- [github-copilot](./github-copilot) - AI pair programming - Missing: GITHUB_TOKEN
- [gmail](./gmail) - Google Mail API - Missing: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN
- [google-sheets](./google-sheets) - Spreadsheet automation - Missing: GOOGLE_SHEETS_CLIENT_SECRET, GOOGLE_SHEETS_REFRESH_TOKEN
- [imgur](./imgur) - Image hosting and sharing - Missing: IMGUR_CLIENT_ID
- [instagram](./instagram) - Instagram API integration - Missing: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID
- [intercom](./intercom) - Customer messaging platform - Missing: INTERCOM_ACCESS_TOKEN
- [mercury](./mercury) - Web parser API - Missing: MERCURY_API_TOKEN
- [reportei](./reportei) - Marketing reports - Missing: REPORTEI_API_TOKEN
- [resend](./resend) - Transactional email service - Missing: RESEND_API_KEY
- [streak](./streak) - CRM for Gmail - Missing: STREAK_API_KEY
- [supabase](./supabase) - Backend as a service - Missing: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY
- [zendesk](./zendesk) - Customer support platform - Missing: ZENDESK_API_TOKEN, ZENDESK_EMAIL, ZENDESK_SUBDOMAIN

**Account/API Issues (5 skills):**
- [browserbase](./browserbase) - Browser automation platform - Account or API configuration issue
- [htmlcsstoimage](./htmlcsstoimage) - HTML/CSS to image conversion - Account or API configuration issue
- [kommo](./kommo) - Sales automation CRM - Account or API configuration issue
- [perplexity](./perplexity) - AI search engine - Account or API configuration issue
- [pushinator](./pushinator) - Push notification service - Account or API configuration issue

**Other Issues (4 skills):**
- [minimax](./minimax) - AI language model API - Configuration required
- [plausible](./plausible) - Privacy-focused analytics - Configuration required
- [youtube](./youtube) - YouTube data and video management - 15 tests failed
- [zeptomail](./zeptomail) - Email service - Configuration required

### Status Unknown (5)

These skills need further investigation:
- [fal.ai](./fal.ai) - AI image generation - Status unknown
- [notion](./notion) - Note-taking and database - Status unknown (3 tests failed)
- [podchaser](./podchaser) - Podcast database API - Status unknown
- [qdrant](./qdrant) - Vector database - Status unknown
- [slack](./slack) - Team collaboration platform - Status unknown

## Contributing

To add a new skill or improve an existing one:

1. Follow the [Agent Skills specification](https://agentskills.io/specification)
2. Include a `SKILL.md` file with usage examples
3. Ensure all examples are tested and working
4. Submit a pull request


## Resources

- [Agent Skills Specification](https://agentskills.io/specification)
