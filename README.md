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

Last tested: 2026-01-08 | Total: 67 skills | Passed: 25 | Failed: 42 | Success Rate: 37.3%

### Fully Tested & Working Skills (25)

**AI & ML:**
- [deepseek](./deepseek) - AI language model for chat - All 9 examples passed
- [elevenlabs](./elevenlabs) - Text-to-speech voice generation - All 7 examples passed
- [openai](./openai) - GPT models and completions - All 12 examples passed
- [runway](./runway) - AI video generation - All 9 examples passed

**Web & Data:**
- [brave-search](./brave-search) - Privacy-focused web search - All 9 examples passed
- [browserless](./browserless) - Headless browser automation - All 20 examples passed
- [hackernews](./hackernews) - Hacker News API access - All 17 examples passed
- [rss-fetch](./rss-fetch) - RSS feed parsing - 14/17 examples passed
- [serpapi](./serpapi) - Search engine results - All 9 examples passed
- [tavily](./tavily) - AI research with citations - All 2 examples passed

**Data & Analytics:**
- [apify](./apify) - Web scraping and automation - 9/10 examples passed
- [axiom](./axiom) - Log management and analytics - 10/11 examples passed
- [cronlytic](./cronlytic) - Cron job monitoring - All 9 examples passed
- [plausible](./plausible) - Privacy-focused analytics - 11/16 examples passed
- [supadata](./supadata) - Data enrichment API - All 11 examples passed

**Communication & Collaboration:**
- [dev.to](./dev.to) - Developer community platform - All 13 examples passed
- [notion](./notion) - Note-taking and database - 2/17 examples passed (most features working, some property mismatches)

**Productivity & Development:**
- [github](./github) - GitHub automation via gh CLI - All 15 examples passed
- [gitlab](./gitlab) - GitLab API integration - All 18 examples passed
- [linear](./linear) - Issue tracking for software teams - All 13 examples passed
- [shortio](./shortio) - URL shortening service - All 10 examples passed
- [twenty](./twenty) - CRM platform - 8/13 examples passed

**Storage & Media:**
- [cloudinary](./cloudinary) - Image management and transformation - 16/17 examples passed

**Messaging & Notifications:**
- [discord-webhook](./discord-webhook) - Discord webhook integration - All 10 examples passed
- [slack-webhook](./slack-webhook) - Slack incoming webhooks - All 6 examples passed

### Known Issues / Failing Skills (42)

These skills require environment variables, API permissions, or configuration updates:

**Missing Environment Variables (26 skills):**
- [bitrix](./bitrix) - CRM and collaboration platform - Missing: BITRIX_WEBHOOK_URL
- [browserbase](./browserbase) - Browser automation platform - Missing: BROWSERBASE_API_KEY, BROWSERBASE_PROJECT_ID
- [fal.ai](./fal.ai) - AI image generation - Authentication error (all 8 examples failed)
- [firecrawl](./firecrawl) - Web scraping and crawling - Insufficient credits
- [github-copilot](./github-copilot) - AI pair programming - Missing: GITHUB_TOKEN
- [gmail](./gmail) - Google Mail API - Missing: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN
- [google-sheets](./google-sheets) - Spreadsheet automation - Missing: GOOGLE_SHEETS_CLIENT_SECRET, GOOGLE_SHEETS_REFRESH_TOKEN
- [htmlcsstoimage](./htmlcsstoimage) - HTML/CSS to image conversion - Plan limit exceeded (56/50 renders used)
- [imgur](./imgur) - Image hosting and sharing - Missing: IMGUR_CLIENT_ID
- [instagram](./instagram) - Instagram API integration - Missing: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID
- [intercom](./intercom) - Customer messaging platform - Missing: INTERCOM_ACCESS_TOKEN
- [kommo](./kommo) - Sales automation CRM - Invalid credentials (HTTP 401)
- [mercury](./mercury) - Web parser API - Missing: MERCURY_API_TOKEN
- [minimax](./minimax) - AI language model API - Insufficient account balance
- [minio](./minio) - Object storage service - Rate limiting on test server (HTTP 403)
- [pdf4me](./pdf4me) - PDF processing service - API key present but most endpoints return 404
- [pdforge](./pdforge) - PDF generation service - Invalid token
- [perplexity](./perplexity) - AI search engine - HTTP 401 unauthorized
- [podchaser](./podchaser) - Podcast database API - Missing: PODCHASER_CLIENT_ID, PODCHASER_CLIENT_SECRET
- [qdrant](./qdrant) - Vector database - HTTP 403 forbidden (invalid API key format)
- [reportei](./reportei) - Marketing reports - Missing: REPORTEI_API_TOKEN
- [resend](./resend) - Transactional email service - Missing: RESEND_API_KEY
- [sentry](./sentry) - Error tracking and monitoring - 7/20 examples passed (missing permissions)
- [streak](./streak) - CRM for Gmail - Missing: STREAK_API_KEY
- [supabase](./supabase) - Backend as a service - Missing: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY
- [youtube](./youtube) - YouTube data and video management - Invalid API key (all 15 examples failed)
- [zendesk](./zendesk) - Customer support platform - Missing: ZENDESK_API_TOKEN, ZENDESK_EMAIL, ZENDESK_SUBDOMAIN

**API Issues & Permissions (10 skills):**
- [bright-data](./bright-data) - Proxy and web unlocker - 8/11 examples passed (some permission issues)
- [chatwoot](./chatwoot) - Customer engagement platform - 11/13 examples passed (minor API issues)
- [discord](./discord) - Discord bot API - 13/15 examples passed (missing OAuth scopes, bot not in channel)
- [figma](./figma) - Design tool API - 1/18 examples passed (missing test data)
- [jira](./jira) - Issue and project tracking - Authentication failure (HTTP 401)
- [lark](./lark) - Team collaboration platform - Authentication error
- [monday](./monday) - Work management platform - 3/10 examples passed (missing write permissions)
- [pdfco](./pdfco) - PDF creation and manipulation - 11/12 examples passed (invalid page range in one example)
- [slack](./slack) - Team collaboration platform - 5/11 examples passed (missing OAuth scopes, bot not in channel)
- [zapsign](./zapsign) - Electronic signature service - 5/10 examples passed (non-existent placeholder URLs)

**Documentation Errors (6 skills):**
- [figma](./figma) - jq filter syntax error
- [instantly](./instantly) - 13/14 examples passed (status filter expects number not string)
- [notion](./notion) - Property name mismatches in some examples
- [qiita](./qiita) - Japanese tech community - 6/19 examples passed (many authenticated operations need token)
- [twenty](./twenty) - Field format errors (domainName, email, body)
- [zeptomail](./zeptomail) - Email service - 0/9 examples passed (duplicate "Zoho-enczapikey" prefix in authorization header)

## Contributing

To add a new skill or improve an existing one:

1. Follow the [Agent Skills specification](https://agentskills.io/specification)
2. Include a `SKILL.md` file with usage examples
3. Ensure all examples are tested and working
4. Submit a pull request


## Resources

- [Agent Skills Specification](https://agentskills.io/specification)
