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

Last tested: 2026-01-07 | Total: 67 skills | Passed: 21 | Failed: 46 | Success Rate: 31.34%

### Fully Tested & Working Skills (21)

**AI & ML:**
- [deepseek](./deepseek) - AI language model for chat - All 9 examples passed
- [elevenlabs](./elevenlabs) - Text-to-speech voice generation - All 7 examples passed
- [fal.ai](./fal.ai) - AI image generation - All 8 examples passed
- [openai](./openai) - GPT models and completions - 10/12 examples passed

**Web & Data:**
- [brave-search](./brave-search) - Privacy-focused web search - All 9 examples passed
- [bright-data](./bright-data) - Proxy and web unlocker service - All 4 examples passed
- [hackernews](./hackernews) - Hacker News API access - 12/16 examples passed
- [rss-fetch](./rss-fetch) - RSS feed parsing - 2/10 examples passed (requires xmllint)
- [serpapi](./serpapi) - Search engine results - All 10 examples passed
- [tavily](./tavily) - AI research with citations - All 2 examples passed

**Data & Analytics:**
- [axiom](./axiom) - Log management and analytics - 10/11 examples passed
- [cronlytic](./cronlytic) - Cron job monitoring - All 9 examples passed
- [plausible](./plausible) - Privacy-focused analytics - 10/17 examples passed

**Communication & Collaboration:**
- [chatwoot](./chatwoot) - Customer engagement platform - All 13 examples passed
- [instantly](./instantly) - Cold email automation - 16/17 examples passed
- [dev.to](./dev.to) - Developer community platform - All 13 examples passed

**Productivity & Development:**
- [github](./github) - GitHub API integration - 16/17 examples passed
- [gitlab](./gitlab) - GitLab API integration - All 20 examples passed
- [linear](./linear) - Issue tracking for software teams - All 13 examples passed
- [qiita](./qiita) - Japanese tech community platform - 7/11 examples passed

**Storage & Media:**
- [cloudinary](./cloudinary) - Image management and transformation - All 7 examples passed
- [minio](./minio) - Object storage service - 21/23 examples passed

**Messaging & Notifications:**
- [discord-webhook](./discord-webhook) - Discord webhook integration - All 10 examples passed
- [pushinator](./pushinator) - Push notification service - All 3 examples passed
- [slack-webhook](./slack-webhook) - Slack incoming webhooks - All 6 examples passed

**Data Enrichment:**
- [supadata](./supadata) - Data enrichment API - 9/11 examples passed

### Known Issues / Failing Skills (46)

These skills require environment variables, API permissions, or configuration updates:

**Missing Environment Variables (22 skills):**
- [bitrix](./bitrix) - CRM and collaboration platform - Missing: BITRIX_WEBHOOK_URL
- [browserbase](./browserbase) - Browser automation platform - Missing: BROWSERBASE_API_KEY, BROWSERBASE_PROJECT_ID
- [firecrawl](./firecrawl) - Web scraping and crawling - Insufficient credits
- [github-copilot](./github-copilot) - AI pair programming - Missing: GITHUB_TOKEN
- [gmail](./gmail) - Google Mail API - Missing: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN
- [google-sheets](./google-sheets) - Spreadsheet automation - Missing: GOOGLE_SHEETS_CLIENT_ID, GOOGLE_SHEETS_CLIENT_SECRET, GOOGLE_SHEETS_REFRESH_TOKEN
- [htmlcsstoimage](./htmlcsstoimage) - HTML/CSS to image conversion - Plan limit exceeded
- [imgur](./imgur) - Image hosting and sharing - Missing: IMGUR_CLIENT_ID (rate limited)
- [instagram](./instagram) - Instagram API integration - Missing: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID
- [intercom](./intercom) - Customer messaging platform - Missing: INTERCOM_ACCESS_TOKEN
- [kommo](./kommo) - Sales automation CRM - Invalid credentials
- [mercury](./mercury) - Web parser API - Missing: MERCURY_API_TOKEN
- [minimax](./minimax) - AI language model API - Insufficient balance
- [pdforge](./pdforge) - PDF generation service - Invalid token
- [perplexity](./perplexity) - AI search engine - HTTP 401 unauthorized
- [podchaser](./podchaser) - Podcast database API - Missing: PODCHASER_CLIENT_ID, PODCHASER_CLIENT_SECRET
- [qdrant](./qdrant) - Vector database - Invalid API key format
- [reportei](./reportei) - Marketing reports - Missing: REPORTEI_API_TOKEN
- [resend](./resend) - Transactional email service - Missing: RESEND_API_KEY
- [streak](./streak) - CRM for Gmail - Missing: STREAK_API_KEY
- [supabase](./supabase) - Backend as a service - Missing: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY
- [zendesk](./zendesk) - Customer support platform - Missing: ZENDESK_API_TOKEN, ZENDESK_EMAIL, ZENDESK_SUBDOMAIN

**API Issues (8 skills):**
- [apify](./apify) - Web scraping and automation platform - 10/11 examples passed (1 actor requires paid rental)
- [browserless](./browserless) - Headless browser automation - 18/20 examples passed (/content endpoint 401, JS runtime error)
- [discord](./discord) - Discord bot API - 13/15 examples passed (missing OAuth scopes + bot not in channel)
- [figma](./figma) - Design tool API - 2/24 examples passed (missing test data, jq syntax error)
- [jira](./jira) - Issue and project tracking - 12/16 examples passed (missing write permissions)
- [monday](./monday) - Work management platform - 6/10 examples passed (missing write permissions)
- [pdfco](./pdfco) - PDF creation and manipulation - 10/11 examples passed (invalid page range in example)
- [pdf4me](./pdf4me) - PDF processing service - 2/12 examples passed (command syntax errors + empty API responses)
- [runway](./runway) - AI video generation - 2/9 examples passed (insufficient credits + doc errors)
- [scrapeninja](./scrapeninja) - Web scraping service - 5/9 examples passed (JS rendering quota exceeded)
- [sentry](./sentry) - Error tracking and monitoring - 17/20 examples passed (missing permissions)
- [slack](./slack) - Team collaboration platform - 5/11 examples passed (missing OAuth scopes)
- [twenty](./twenty) - CRM platform - 12/17 examples passed (documentation errors)
- [youtube](./youtube) - YouTube data and video management - 0/16 examples passed (invalid API key)
- [zapsign](./zapsign) - Electronic signature service - 5/10 examples passed (non-existent placeholder URLs)

**Documentation Errors (6 skills):**
- [figma](./figma) - jq filter syntax error (Example 8)
- [instantly](./instantly) - status filter expects number not string
- [notion](./notion) - Note-taking and database - 18/20 examples passed (property name mismatch)
- [supadata](./supadata) - Wrong parameter name (url vs id)
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
