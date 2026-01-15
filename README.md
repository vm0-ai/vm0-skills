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

Last tested: 2026-01-15 | Total: 69 skills | Passing: 19 | Failed: 50 | Success Rate: 27.5%

### Test Summary

| Status | Count | Percentage |
|--------|-------|------------|
| **Passing** | 19 | 27.5% |
| **Partial** | 1 | 1.4% |
| **Failing** | 49 | 71.0% |

### All Skills List

Below is a comprehensive list of all 69 skills organized by test status:

#### Passing Skills (19)

All skills in this section passed all test cases successfully.

| Skill | Description | Capabilities |
|-------|-------------|--------------|
| [axiom](./axiom) | Log management and analytics | Event logging, querying, aggregation |
| [brave-search](./brave-search) | Privacy-focused web search | Web search without tracking |
| [browserless](./browserless) | Headless browser automation | Screenshot, PDF, content extraction |
| [chatwoot](./chatwoot) | Customer engagement platform | Conversation, contact, ticket management |
| [cloudinary](./cloudinary) | Media management and transformation | Image upload, transformation, delivery |
| [cronlytic](./cronlytic) | Cron job monitoring service | Health checks, monitoring, alerts |
| [deepseek](./deepseek) | AI language model API | Text generation, chat completions |
| [discord-webhook](./discord-webhook) | Discord webhook integration | Message posting, notifications |
| [elevenlabs](./elevenlabs) | AI text-to-speech voice generation | Voice synthesis, audio generation |
| [gitlab](./gitlab) | GitLab API integration | Repository management, CI/CD |
| [hackernews](./hackernews) | Hacker News API access | Story fetching, comment retrieval |
| [linear](./linear) | Software project management | Issue tracking, project management |
| [minio](./minio) | Object storage service | File upload, storage, retrieval |
| [openai](./openai) | GPT models, completions, vision, embeddings | Chat, completions, embeddings, vision, DALL-E, TTS |
| [pushinator](./pushinator) | Push notification service | Push messaging, notifications |
| [runway](./runway) | AI video and image generation | Image/video generation, asset creation |
| [slack-webhook](./slack-webhook) | Slack incoming webhooks | Message posting, notifications |
| [tavily](./tavily) | AI-powered web search with domain filtering | Web search with filtering capabilities |
| [workflow-migration](./workflow-migration) | Workflow migration tool | Workflow conversion, migration |

#### Partial Skills (1)

Skills that have passing tests but some failures due to expected issues (placeholder data, missing resources, etc.).

| Skill | Status | Description | Key Issues |
|-------|--------|-------------|------------|
| [figma](./figma) | ⚠ PARTIAL | Design tool API integration | jq parsing errors with 404 responses; some examples have syntax issues (17/18 passed) |

#### Failed Skills (49)

##### Missing Environment Variables (17 skills)

These skills require proper API keys or credentials to function. No tests can proceed without them.

| Skill | Description | Required Variables |
|-------|-------------|-------------------|
| [bitrix](./bitrix) | CRM and collaboration platform | BITRIX_WEBHOOK_URL |
| [bright-data](./bright-data) | Proxy network and web unlocker | BRIGHT_DATA_CUSTOMER_ID, BRIGHT_DATA_API_TOKEN, BRIGHT_DATA_ZONE |
| [browserbase](./browserbase) | Serverless browser automation | BROWSERBASE_API_KEY, BROWSERBASE_PROJECT_ID |
| [dev.to](./dev.to) | Developer community platform | DEV_TO_API_KEY |
| [discord](./discord) | Discord bot API with permissions | DISCORD_BOT_TOKEN, proper intents/permissions |
| [fal.ai](./fal.ai) | AI image generation platform | FAL_KEY with sufficient balance |
| [gmail](./gmail) | Google Mail API integration | GOOGLE_OAUTH_TOKEN (OAuth 2.0 access token) |
| [github-copilot](./github-copilot) | AI pair programming assistant | GITHUB_TOKEN (valid PAT or GitHub App token) |
| [google-sheets](./google-sheets) | Spreadsheet automation | GOOGLE_SHEETS_CLIENT_ID, GOOGLE_SHEETS_ACCESS_TOKEN |
| [intercom](./intercom) | Customer messaging platform | INTERCOM_ACCESS_TOKEN |
| [jira](./jira) | Issue and project tracking | JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN, existing projects |
| [kommo](./kommo) | Sales automation CRM | KOMMO_API_TOKEN (valid, non-expired JWT) |
| [lark](./lark) | Team collaboration platform | LARK_API_TOKEN, valid resource IDs |
| [mercury](./mercury) | Banking API for startups | MERCURY_API_TOKEN |
| [podchaser](./podchaser) | Podcast database API | PODCHASER_CLIENT_ID, PODCHASER_CLIENT_SECRET |
| [reportei](./reportei) | Marketing analytics reports | REPORTEI_API_TOKEN |
| [streak](./streak) | CRM for Gmail | STREAK_API_KEY |
| [supabase](./supabase) | Backend as a service platform | SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY |
| [zendesk](./zendesk) | Customer support platform | ZENDESK_SUBDOMAIN, ZENDESK_EMAIL, ZENDESK_API_TOKEN |

**Action:** Export missing environment variables with valid credentials

##### API Credential/Authentication Issues (11 skills)

These skills have API keys available but they are invalid, expired, or lack proper permissions.

| Skill | Description | Issue | HTTP Status |
|-------|-------------|-------|-------------|
| [apify](./apify) | Web scraping and automation platform | Actor not rented; service errors | 403 |
| [firecrawl](./firecrawl) | Web scraping and crawling | Insufficient API credits (requires paid plan) | 402 |
| [htmlcsstoimage](./htmlcsstoimage) | HTML/CSS to image conversion | Free tier limit exceeded (56/50 renders); requires paid plan upgrade | 429 |
| [imgur](./imgur) | Image hosting and sharing | API rate limiting on requests | 429 |
| [instagram](./instagram) | Instagram Graph API integration | Missing auth token; invalid business account ID | 400 |
| [instantly](./instantly) | Email outreach platform | API validation error with status parameters | 400 |
| [pdforge](./pdforge) | PDF generation service | Invalid API token | 403 |
| [perplexity](./perplexity) | AI-powered search engine | Invalid or expired API key | 401 |
| [plausible](./plausible) | Privacy-focused web analytics | Invalid or insufficient API key for some endpoints | 401 |
| [resend](./resend) | Transactional email delivery | Invalid API key | 401 |
| [youtube](./youtube) | YouTube Data API v3 | Invalid API key (API_KEY_INVALID) | 400 |

**Action:** Regenerate valid API keys, verify permissions, and upgrade accounts if needed

##### Quota/Balance/Account Issues (10 skills)

These services have accounts set up but are hitting limits, account suspensions, or insufficient funds.

| Skill | Description | Issue | Impact |
|-------|-------------|-------|--------|
| [github](./github) | GitHub API via gh CLI | Invalid search qualifiers, issues/PRs not found, permission denied | Query syntax and resource access |
| [minimax](./minimax) | AI language model API | Insufficient balance; invalid parameters | Cannot process requests |
| [monday](./monday) | Work management platform | Insufficient token scopes for write operations | Read works (6/10), write blocked |
| [notion](./notion) | Documentation and database management | Resource not found (non-existent/unshared resources) | 404 errors |
| [qdrant](./qdrant) | Vector database for AI | API endpoint 404; cluster may be down | Infrastructure issue |
| [scrapeninja](./scrapeninja) | Web scraping with JS rendering | Monthly quota exceeded for JS rendering; tunnel errors | 403 CONNECT failures |
| [sentry](./sentry) | Error tracking and monitoring | Missing token scopes (release:write); PUT request protocol errors | Limited operations (13/20 passed) |
| [serpapi](./serpapi) | Search API via SerpAPI | Account quota exhausted ("run out of searches") | Rate limited |
| [slack](./slack) | Team collaboration platform | Bot not in channel; missing OAuth scopes (users:read.email, files:write, reactions:write) | Limited operations (2/11 passed) |
| [supadata](./supadata) | Data enrichment API | Plan usage limit exceeded; account exhausted quota | Blocked from all requests |

**Action:** Upgrade accounts, add funds, request additional scopes, or verify service availability

##### Documentation/Configuration Issues (7 skills)

These skills have implementation issues in examples or configuration problems in the test data.

| Skill | Description | Issue | Pass Rate |
|-------|-------------|-------|-----------|
| [pdfco](./pdfco) | PDF processing service | Invalid page range specification in test example | 1/12 (8.3%) |
| [pdf4me](./pdf4me) | PDF conversion and processing | File content encoding issue in merge operation; restricted endpoints | 0/12 |
| [rss-fetch](./rss-fetch) | RSS/Atom feed fetching | Tool dependency (xmllint) not installed; network access blocked | 0/2 |
| [shortio](./shortio) | URL shortening service | API endpoint not found; missing domain parameter in example | 1/1 |
| [twenty](./twenty) | Modern CRM platform | Workspace not found (auth token invalid); URL encoding issue in examples | 0/16 |
| [vm0](./vm0) | Agent execution platform | Invalid API key parameter mapping (VM0_API_TOKEN vs VM0_API_KEY) | 1/15 (6.7%) |
| [zapsign](./zapsign) | Electronic signature service | Placeholder URLs in documentation; file not found | 0/1 |

**Action:** Fix examples with valid test data, install missing dependencies, correct parameter mappings

### Failure Statistics by Category

| Category | Count | Percentage | Remediation |
|----------|-------|------------|-------------|
| **Missing Environment Variables** | 19 | 27.5% | Set up accounts and export API keys |
| **Invalid/Expired Credentials** | 11 | 15.9% | Regenerate keys, verify permissions, upgrade accounts |
| **Quota/Balance/Scope Issues** | 10 | 14.5% | Upgrade plans, add funding, request additional scopes |
| **Documentation/Configuration Issues** | 7 | 10.1% | Update examples, fix parameters, install dependencies |
| **Partial Success** | 1 | 1.4% | Fix jq parsing for 404 responses, update examples |
| **Passing** | 19 | 27.5% | Stable and working |

### Recommendations for Improvement

**Immediate Actions (High Priority):**
1. Set environment variables for the 19 skills missing credentials
2. Regenerate expired API keys for 11 skills with authentication issues
3. Upgrade free-tier accounts that have hit quota limits (HTMLCSStoImage, FalAI, Supadata, Imgur)
4. Update GitHub scopes and Slack bot permissions for limited access

**Medium Priority:**
1. Fix documentation examples with placeholder values (Zapsign, Lark, Twenty)
2. Correct parameter mappings (VM0 API key naming)
3. Install missing system dependencies (xmllint for rss-fetch)
4. Add fund/balance to accounts with insufficient funds (Minimax, Mercury)

**Low Priority:**
1. Investigate Qdrant service availability
2. Review Sentry PUT request protocol errors
3. Optimize Scrapeninja configuration for JS rendering quota

## Contributing

To add a new skill or improve an existing one:

1. Follow the [Agent Skills specification](https://agentskills.io/specification)
2. Include a `SKILL.md` file with usage examples
3. Ensure all examples are tested and working
4. Submit a pull request


## Resources

- [Agent Skills Specification](https://agentskills.io/specification)
