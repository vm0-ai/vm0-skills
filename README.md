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

Last tested: 2026-01-14 | Total: 68 skills | Fully Passing: 5 | Partially Passing: 12 | Failed: 51 | Success Rate: 25%

### Test Summary

| Status | Count | Percentage |
|--------|-------|------------|
| **Fully Passing** | 5 | 7.4% |
| **Partially Passing** | 12 | 17.6% |
| **Fully Failing** | 51 | 75.0% |

### All Skills List

Below is a comprehensive list of all 68 skills with their test status, description, and key capabilities:

#### Fully Passing Skills (5)

| Skill | Status | Description | Test Results |
|-------|--------|-------------|--------------|
| [openai](./openai) | ✓ PASSED | GPT models, completions, vision, embeddings, DALL-E, TTS | 11/12 passed (1 skipped) |
| [pdfco](./pdfco) | ✓ PASSED | PDF processing: convert, merge, split, compress, parse | 11/12 passed |
| [rss-fetch](./rss-fetch) | ✓ PASSED | RSS/Atom feed fetching and parsing | 12/15 passed |
| [serpapi](./serpapi) | ✓ PASSED | Google search, news, shopping, YouTube, maps results | 9/9 passed |
| [tavily](./tavily) | ✓ PASSED | AI-powered web search with domain filtering | 2/2 passed |

#### Partially Passing Skills (12)

| Skill | Status | Description | Test Results | Issues |
|-------|--------|-------------|--------------|--------|
| [lark](./lark) | ⚠ PARTIAL | Team collaboration platform by ByteDance | 10/11 passed | 1 endpoint 404 |
| [monday](./monday) | ⚠ PARTIAL | Work management platform | 6/10 passed | Write ops need permissions |
| [pdf4me](./pdf4me) | ⚠ PARTIAL | PDF conversion and processing service | 4/12 passed | 8 endpoints restricted |
| [plausible](./plausible) | ⚠ PARTIAL | Privacy-focused web analytics | 11/16 passed | Sites API needs permissions |
| [qiita](./qiita) | ⚠ PARTIAL | Japanese tech community platform | 17/24 passed | Write ops need token |
| [runway](./runway) | ⚠ PARTIAL | AI video and image generation | 5/9 passed | Invalid examples, low credits |
| [scrapeninja](./scrapeninja) | ⚠ PARTIAL | Web scraping with JS rendering | 7/9 passed | 2 tests missing data |
| [sentry](./sentry) | ⚠ PARTIAL | Error tracking and monitoring | 13/20 passed | Write ops have errors |
| [shortio](./shortio) | ⚠ PARTIAL | URL shortening service | 8/10 passed | 1 deprecated endpoint |
| [slack](./slack) | ⚠ PARTIAL | Team collaboration platform | 2/11 passed | Missing OAuth scopes |
| [slack-webhook](./slack-webhook) | ✓ PASSED | Slack incoming webhooks | 6/6 passed | All tests passed |
| [zapsign](./zapsign) | ⚠ PARTIAL | Electronic signature service | 5/10 passed | Placeholder URLs in docs |

#### Failed Skills - Missing Environment Variables (25)

| Skill | Status | Description | Missing Variables |
|-------|--------|-------------|-------------------|
| [apify](./apify) | ✗ FAILED | Web scraping and automation platform | APIFY_API_TOKEN |
| [axiom](./axiom) | ✗ FAILED | Log management and analytics | AXIOM_TOKEN, AXIOM_DATASET_ID |
| [bitrix](./bitrix) | ✗ FAILED | CRM and collaboration platform | BITRIX_WEBHOOK_URL |
| [bright-data](./bright-data) | ✗ FAILED | Proxy network and web unlocker | BRIGHT_DATA_CUSTOMER_ID, BRIGHT_DATA_API_TOKEN, BRIGHT_DATA_ZONE |
| [browserbase](./browserbase) | ✗ FAILED | Serverless browser automation | BROWSERBASE_API_KEY, BROWSERBASE_PROJECT_ID |
| [browserless](./browserless) | ✗ FAILED | Headless browser automation | BROWSERLESS_API_KEY |
| [chatwoot](./chatwoot) | ✗ FAILED | Customer engagement platform | CHATWOOT_API_KEY, CHATWOOT_ACCOUNT_ID, CHATWOOT_BASE_URL |
| [cloudinary](./cloudinary) | ✗ FAILED | Media management and transformation | CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET |
| [cronlytic](./cronlytic) | ✗ FAILED | Cron job monitoring service | CRONLYTIC_API_KEY |
| [deepseek](./deepseek) | ✗ FAILED | AI language model API | DEEPSEEK_API_KEY |
| [dev.to](./dev.to) | ✗ FAILED | Developer community platform | DEV_TO_API_KEY |
| [discord](./discord) | ✗ FAILED | Discord bot API | DISCORD_BOT_TOKEN |
| [discord-webhook](./discord-webhook) | ✗ FAILED | Discord webhook integration | DISCORD_WEBHOOK_URL |
| [elevenlabs](./elevenlabs) | ✗ FAILED | AI text-to-speech voice generation | ELEVENLABS_API_KEY |
| [fal.ai](./fal.ai) | ✗ FAILED | AI image generation platform | FAL_KEY |
| [figma](./figma) | ✗ FAILED | Design tool API integration | FIGMA_ACCESS_TOKEN |
| [firecrawl](./firecrawl) | ✗ FAILED | Web scraping and crawling | FIRECRAWL_API_KEY |
| [notion](./notion) | ✗ FAILED | Documentation and database management | NOTION_API_KEY |
| [podchaser](./podchaser) | ✗ FAILED | Podcast database API | PODCHASER_CLIENT_ID, PODCHASER_CLIENT_SECRET |
| [reportei](./reportei) | ✗ FAILED | Marketing analytics reports | REPORTEI_API_TOKEN |
| [resend](./resend) | ✗ FAILED | Transactional email delivery | RESEND_API_KEY |
| [streak](./streak) | ✗ FAILED | CRM for Gmail | STREAK_API_KEY |
| [supabase](./supabase) | ✗ FAILED | Backend as a service platform | SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY |
| [vm0](./vm0) | ✗ FAILED | Agent execution platform | VM0_API_KEY |
| [zendesk](./zendesk) | ✗ FAILED | Customer support platform | ZENDESK_API_TOKEN, ZENDESK_EMAIL, ZENDESK_SUBDOMAIN |

#### Failed Skills - Invalid/Expired API Keys (15)

| Skill | Status | Description | Error Details |
|-------|--------|-------------|---------------|
| [github-copilot](./github-copilot) | ✗ FAILED | AI pair programming assistant | Invalid token format |
| [gmail](./gmail) | ✗ FAILED | Google Mail API integration | Access token issues |
| [google-sheets](./google-sheets) | ✗ FAILED | Spreadsheet automation | Authentication errors |
| [hackernews](./hackernews) | ✗ FAILED | Hacker News API access | No API key but tests failed |
| [htmlcsstoimage](./htmlcsstoimage) | ✗ FAILED | HTML/CSS to image conversion | HTTP 403 Forbidden |
| [imgur](./imgur) | ✗ FAILED | Image hosting and sharing | HTTP 403 Forbidden |
| [instagram](./instagram) | ✗ FAILED | Instagram API integration | HTTP 400 Bad Request |
| [instantly](./instantly) | ✗ FAILED | Email outreach platform | HTTP 401 Unauthorized |
| [intercom](./intercom) | ✗ FAILED | Customer messaging platform | HTTP 401 Unauthorized |
| [kommo](./kommo) | ✗ FAILED | Sales automation CRM | HTTP 401 expired JWT |
| [pdforge](./pdforge) | ✗ FAILED | PDF generation service | HTTP 403 Invalid Token |
| [perplexity](./perplexity) | ✗ FAILED | AI-powered search engine | HTTP 401 Authorization Required |
| [pushinator](./pushinator) | ✗ FAILED | Push notification service | HTTP 400 Channel not exists |
| [twenty](./twenty) | ✗ FAILED | Modern CRM platform | HTTP 401 WORKSPACE_NOT_FOUND |
| [youtube](./youtube) | ✗ FAILED | YouTube Data API v3 | HTTP 400 API Key Invalid |

#### Failed Skills - Quota/Balance/Permission Issues (8)

| Skill | Status | Description | Error Details |
|-------|--------|-------------|---------------|
| [gitlab](./gitlab) | ✗ FAILED | GitLab API integration | HTTP 401 token issues |
| [jira](./jira) | ✗ FAILED | Issue and project tracking | Connection/auth issues |
| [linear](./linear) | ✗ FAILED | Software project management | GraphQL errors |
| [mercury](./mercury) | ✗ FAILED | Banking API for startups | HTTP 402 Insufficient funds |
| [minimax](./minimax) | ✗ FAILED | AI language model API | Insufficient balance |
| [minio](./minio) | ✗ FAILED | Object storage service | Connection refused |
| [supadata](./supadata) | ✗ FAILED | Data enrichment API | Plan usage limit exceeded |
| [zeptomail](./zeptomail) | ✗ FAILED | Transactional email service | HTTP 500 Internal Server Error |

#### Failed Skills - Infrastructure/Service Issues (2)

| Skill | Status | Description | Error Details |
|-------|--------|-------------|---------------|
| [qdrant](./qdrant) | ✗ FAILED | Vector database for AI | HTTP 404 on all endpoints - cluster may be down |
| [brave-search](./brave-search) | ✗ FAILED | Privacy-focused web search | API endpoint issues |

### Failure Analysis Summary

| Category | Count | Percentage | Action Required |
|----------|-------|------------|-----------------|
| Missing Environment Variables | 25 | 36.8% | Set up accounts and export API keys |
| Invalid/Expired API Keys | 15 | 22.1% | Regenerate keys, verify permissions |
| Quota/Balance Issues | 8 | 11.8% | Upgrade accounts, add funding |
| API Plan Restrictions | 6 | 8.8% | Upgrade plans, request scopes |
| Documentation Issues | 3 | 4.4% | Update examples with valid data |
| Infrastructure Issues | 2 | 2.9% | Verify service availability |

### High Priority Skills for Fixing

**Critical for Core Functionality:**
1. **OpenAI** - ✓ Working (91.7% pass rate) - Critical AI features operational
2. **Notion** - ✗ Missing API key - Widely used documentation platform
3. **Supabase** - ✗ Missing credentials - Database operations blocked
4. **Resend** - ✗ Missing API key - Email functionality blocked

**High Value Partial Success:**
1. **Monday** - Read works, write needs permissions
2. **Slack** - Basic operations work, needs additional scopes
3. **Sentry** - Monitoring works, issue management needs fixes
4. **Plausible** - Stats work, site management needs permissions

## Contributing

To add a new skill or improve an existing one:

1. Follow the [Agent Skills specification](https://agentskills.io/specification)
2. Include a `SKILL.md` file with usage examples
3. Ensure all examples are tested and working
4. Submit a pull request


## Resources

- [Agent Skills Specification](https://agentskills.io/specification)
