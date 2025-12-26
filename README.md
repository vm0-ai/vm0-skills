# vm0-skills

A collection of reusable [Agent Skills](https://agentskills.io) for AI agents.

Skills follow the [Agent Skills specification](https://agentskills.io/specification).

## Skills

**Test Summary:** 66 skills tested | 30 passed (45%) | 16 failed (24%) | 6 partial pass (9%) | 20 status unknown (30%)

| Skill | Status | Description |
|-------|--------|-------------|
| [apify](./apify) | ✓ PASS | Web scraping automation platform with actors and datasets |
| [axiom](./axiom) | ❓ UNKNOWN | Serverless data analytics and observability platform |
| [bitrix](./bitrix) | ✗ FAIL | CRM and business management platform (needs investigation) |
| [brave-search](./brave-search) | ❓ UNKNOWN | Privacy-focused search engine API with web, image, and news search |
| [bright-data](./bright-data) | ✓ PASS | Web data platform and proxy services for data collection |
| [browserless](./browserless) | ✓ PASS | Headless browser automation service for web scraping and testing |
| [chatwoot](./chatwoot) | ❓ UNKNOWN | Open-source customer engagement platform with live chat |
| [cloudinary](./cloudinary) | ✓ PASS | Media management and transformation for images and videos |
| [cronlytic](./cronlytic) | ✓ PASS | Cron job monitoring service with status tracking |
| [deepseek](./deepseek) | ✓ PASS | AI language model API for chat completions |
| [dev.to](./dev.to) | ❓ UNKNOWN | Dev.to article publishing and management API |
| [devto-publish](./devto-publish) | ✓ PASS | Dev.to article publishing API with full CRUD operations |
| [discord](./discord) | ✓ PASS | Discord bot and messaging automation with channel management |
| [discord-webhook](./discord-webhook) | ✗ FAIL | Discord webhook integrations (missing DISCORD_WEBHOOK_URL) |
| [elevenlabs](./elevenlabs) | ✓ PASS | AI voice generation and text-to-speech synthesis |
| [fal.ai](./fal.ai) | ✓ PASS | AI model inference platform for image generation |
| [figma](./figma) | ❓ UNKNOWN | Design collaboration platform API for files and projects |
| [firecrawl](./firecrawl) | ⚠️ PARTIAL | Web scraping and data extraction (16/18 passed, 2 jq syntax errors in docs) |
| [github](./github) | ✓ PASS | GitHub repository and code management with gh CLI |
| [github-copilot](./github-copilot) | ✗ FAIL | AI pair programming assistant (needs investigation) |
| [gitlab](./gitlab) | ✓ PASS | GitLab DevOps platform for repositories and CI/CD |
| [gmail](./gmail) | ✗ FAIL | Gmail API integration (missing GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN) |
| [google-sheets](./google-sheets) | ✗ FAIL | Google Sheets spreadsheet automation (expired OAuth token, URL encoding issues) |
| [hackernews](./hackernews) | ✓ PASS | Hacker News API client for stories and comments (no auth required) |
| [htmlcsstoimage](./htmlcsstoimage) | ✓ PASS | HTML/CSS to image conversion service |
| [imgur](./imgur) | ✗ FAIL | Image hosting and sharing platform (missing IMGUR_CLIENT_ID) |
| [instagram](./instagram) | ✗ FAIL | Instagram API integrations (missing INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID) |
| [instantly](./instantly) | ✓ PASS | Email outreach automation platform for campaigns |
| [intercom](./intercom) | ✗ FAIL | Customer messaging and support platform (needs investigation) |
| [jira](./jira) | ✓ PASS | Project and issue tracking system with Atlassian Jira |
| [kommo](./kommo) | ✓ PASS | CRM and sales automation platform with lead management |
| [lark](./lark) | ✗ FAIL | Team collaboration and productivity suite (missing LARK_APP_ID, LARK_APP_SECRET) |
| [linear](./linear) | ✓ PASS | Issue tracking for software teams with project management |
| [mercury](./mercury) | ✗ FAIL | Web content parser API (missing MERCURY_API_TOKEN) |
| [minimax](./minimax) | ⚠️ PARTIAL | AI model API platform (10/11 passed, 1 model parameter issue) |
| [minio](./minio) | ✓ PASS | Object storage compatible with Amazon S3 |
| [monday](./monday) | ✓ PASS | Work operating system platform for project management |
| [notion](./notion) | ❓ UNKNOWN | Workspace for notes and databases with page management |
| [openai](./openai) | ✓ PASS | OpenAI GPT models and APIs for chat and completions |
| [pdf4me](./pdf4me) | ❓ UNKNOWN | PDF conversion and manipulation service |
| [pdfco](./pdfco) | ⚠️ PARTIAL | PDF generation and processing (8/9 passed, 1 invalid page range) |
| [pdforge](./pdforge) | ✓ PASS | PDF generation service from HTML templates |
| [perplexity](./perplexity) | ❓ UNKNOWN | AI-powered search and answer engine with citations |
| [plausible](./plausible) | ⚠️ PARTIAL | Privacy-focused web analytics (12/13 passed, 1 metric usage error) |
| [podchaser](./podchaser) | ✗ FAIL | Podcast database (missing PODCHASER_CLIENT_ID, PODCHASER_CLIENT_SECRET, outdated GraphQL schema) |
| [pushinator](./pushinator) | ✓ PASS | Push notification service for multiple platforms |
| [qdrant](./qdrant) | ✓ PASS | Vector database for AI applications and embeddings |
| [qiita](./qiita) | ⚠️ PARTIAL | Japanese technical platform (8/12 passed, auth operations require QIITA_ACCESS_TOKEN) |
| [reportei](./reportei) | ✗ FAIL | Marketing reports automation (missing REPORTEI_API_TOKEN, API endpoint issues) |
| [resend](./resend) | ✗ FAIL | Transactional email service (missing RESEND_API_KEY) |
| [rss-fetch](./rss-fetch) | ❓ UNKNOWN | RSS feed parser and reader |
| [runway](./runway) | ⚠️ PARTIAL | AI video and image generation (3/9 passed, parameter validation issues) |
| [scrapeninja](./scrapeninja) | ✓ PASS | Web scraping API service with JavaScript rendering |
| [sentry](./sentry) | ❓ UNKNOWN | Application monitoring and error tracking |
| [serpapi](./serpapi) | ✓ PASS | Search engine results API for Google, Bing, and more |
| [shortio](./shortio) | ❓ UNKNOWN | URL shortening and link management |
| [slack](./slack) | ⚠️ PARTIAL | Team messaging and collaboration (8/11 passed, missing OAuth scopes) |
| [slack-webhook](./slack-webhook) | ✓ PASS | Slack incoming webhooks for simple message posting |
| [streak](./streak) | ✗ FAIL | CRM for Gmail (missing STREAK_API_KEY) |
| [supadata](./supadata) | ❓ UNKNOWN | Data enrichment and verification |
| [tavily](./tavily) | ✓ PASS | AI research and search API with citations |
| [twenty](./twenty) | ✓ PASS | Open-source CRM platform with API integration |
| [youtube](./youtube) | ✗ FAIL | YouTube data and video management (invalid API key) |
| [zapsign](./zapsign) | ✓ PASS | Electronic signature platform for document signing |
| [zendesk](./zendesk) | ✗ FAIL | Customer service platform (missing ZENDESK_EMAIL, ZENDESK_API_TOKEN, ZENDESK_SUBDOMAIN) |
| [zeptomail](./zeptomail) | ✗ FAIL | Transactional email service (needs investigation) |

**Status Legend:** ✓ PASS = All tests passing | ⚠️ PARTIAL = Most tests passing with minor issues | ✗ FAIL = Tests failed | ❓ UNKNOWN = Status needs verification

**Last Tested:** 2025-12-26

## Contributing

To add a new skill or improve an existing one, please ensure all examples in SKILL.md are tested and working before submitting a pull request.
