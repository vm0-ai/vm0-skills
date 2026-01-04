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

Last tested: 2026-01-04 | Total: 67 skills | Passed: 22 | Failed: 28 | Unclear: 17 | Success Rate: 32.8%

### Fully Tested & Working Skills (22)

**AI & ML:**
- [openai](./openai) - GPT models and completions - PASSED
- [deepseek](./deepseek) - AI language model for chat - PASSED
- [elevenlabs](./elevenlabs) - Text-to-speech voice generation - PASSED
- [fal.ai](./fal.ai) - AI image generation - PASSED

**Web & Data:**
- [apify](./apify) - Web scraping and automation platform - PASSED
- [brave-search](./brave-search) - Privacy-focused web search - PASSED
- [serpapi](./serpapi) - Search engine results - PASSED
- [firecrawl](./firecrawl) - Web scraping and crawling - PASSED
- [browserless](./browserless) - Headless browser automation - PASSED
- [hackernews](./hackernews) - Hacker News API access - PASSED

**Data & Analytics:**
- [axiom](./axiom) - Log management and analytics - PASSED
- [cronlytic](./cronlytic) - Cron job monitoring - PASSED

**Communication & Collaboration:**
- [chatwoot](./chatwoot) - Customer engagement platform - PASSED
- [instantly](./instantly) - Cold email automation - PASSED

**Productivity & Development:**
- [linear](./linear) - Issue tracking for software teams - PASSED
- [monday](./monday) - Work management platform - PASSED
- [tavily](./tavily) - AI research with citations - PASSED

**Storage & Media:**
- [cloudinary](./cloudinary) - Image management and transformation - PASSED
- [minio](./minio) - Object storage service - PASSED

**Document Processing:**
- [pdfco](./pdfco) - PDF creation and manipulation - PASSED

**Monitoring & Notifications:**
- [pushinator](./pushinator) - Push notification service - PASSED

### Partially Working / Unclear Status (17)

These skills have some passing tests but may have limitations or require specific configuration:

- [bright-data](./bright-data) - Proxy and web unlocker service - 5 passed
- [discord](./discord) - Discord bot API - 15 passed, 2 failed
- [discord-webhook](./discord-webhook) - Discord webhook integration - 10 passed, 1 failed
- [github](./github) - GitHub API integration - 18 passed, 1 failed
- [gitlab](./gitlab) - GitLab API integration - 16 passed
- [jira](./jira) - Issue and project tracking - 8 passed, 6 failed
- [pdf4me](./pdf4me) - PDF processing service - 5 passed, 9 failed
- [pdforge](./pdforge) - PDF generation service - 6 failed
- [plausible](./plausible) - Privacy-focused analytics - 12 passed, 2 failed
- [qiita](./qiita) - Japanese tech community platform - 11 passed, 4 failed
- [rss-fetch](./rss-fetch) - RSS feed parsing - 8 passed, 9 failed
- [runway](./runway) - AI video generation - 2 passed, 7 failed
- [scrapeninja](./scrapeninja) - Web scraping service - 5 passed, 5 failed
- [sentry](./sentry) - Error tracking and monitoring - 8 passed, 1 failed
- [shortio](./shortio) - URL shortening service - 6 passed, 5 failed
- [slack-webhook](./slack-webhook) - Slack incoming webhooks - 8 passed
- [zapsign](./zapsign) - Electronic signature service - 6 passed, 5 failed

### Known Issues / Failing Skills (28)

These skills require environment variables, API permissions, or configuration updates:

**Missing Environment Variables:**
- [browserbase](./browserbase) - Browser automation platform - Missing: BROWSERBASE_API_KEY, BROWSERBASE_PROJECT_ID
- [instagram](./instagram) - Instagram API integration - Missing: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID
- [intercom](./intercom) - Customer messaging platform - Missing environment variables
- [mercury](./mercury) - Web parser API - Missing: MERCURY_API_TOKEN
- [podchaser](./podchaser) - Podcast database API - Missing: PODCHASER_CLIENT_ID, PODCHASER_CLIENT_SECRET
- [reportei](./reportei) - Marketing reports - Missing: REPORTEI_API_TOKEN
- [resend](./resend) - Transactional email service - Missing: RESEND_API_KEY
- [streak](./streak) - CRM for Gmail - Missing: STREAK_API_KEY
- [supabase](./supabase) - Backend as a service - Missing: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY
- [zendesk](./zendesk) - Customer support platform - Missing: ZENDESK_API_TOKEN, ZENDESK_EMAIL, ZENDESK_SUBDOMAIN

**Permission/OAuth Issues:**
- [figma](./figma) - Design tool API - 4 passed, 13 failed - Needs OAuth scopes
- [github-copilot](./github-copilot) - AI pair programming - Needs API permissions
- [gmail](./gmail) - Google Mail API - Needs OAuth scopes
- [google-sheets](./google-sheets) - Spreadsheet automation - Needs OAuth scopes
- [notion](./notion) - Note-taking and database - 4 passed, 19 failed - Needs OAuth scopes
- [slack](./slack) - Team collaboration platform - 4 passed, 11 failed - Needs OAuth scopes

**API/Configuration Issues:**
- [bitrix](./bitrix) - CRM and collaboration platform - 21 failed
- [htmlcsstoimage](./htmlcsstoimage) - HTML/CSS to image conversion - 13 failed
- [imgur](./imgur) - Image hosting and sharing - 6 failed
- [kommo](./kommo) - Sales automation CRM - 13 failed
- [lark](./lark) - Team collaboration suite - 21 failed
- [minimax](./minimax) - AI language model API - 7 passed, 5 failed
- [perplexity](./perplexity) - AI search engine - 13 failed
- [qdrant](./qdrant) - Vector database - 13 failed
- [supadata](./supadata) - Data enrichment API - 10 passed, 3 failed
- [twenty](./twenty) - CRM platform - 10 passed, 7 failed
- [youtube](./youtube) - YouTube data and video management - 17 failed
- [zeptomail](./zeptomail) - Email service - 10 failed

## Contributing

To add a new skill or improve an existing one:

1. Follow the [Agent Skills specification](https://agentskills.io/specification)
2. Include a `SKILL.md` file with usage examples
3. Ensure all examples are tested and working
4. Submit a pull request


## Resources

- [Agent Skills Specification](https://agentskills.io/specification)
