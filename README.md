# vm0-skills

A collection of reusable [Agent Skills](https://agentskills.io) for AI agents.

Skills follow the [Agent Skills specification](https://agentskills.io/specification).

## Skills

**Test Summary:** 63 skills tested | 40 passed (63.5%) | 23 failed (36.5%)

| Skill | Status | Description |
|-------|--------|-------------|
| [apify](./apify) | ✓ PASS | Web scraping automation platform with actors and datasets |
| [axiom](./axiom) | ✓ PASS | Serverless data analytics and observability platform |
| [bitrix](./bitrix) | ✗ FAIL | CRM and business management platform (missing BITRIX_WEBHOOK_URL) |
| [brave-search](./brave-search) | ✓ PASS | Privacy-focused search engine API with web, image, and news search |
| [bright-data](./bright-data) | ✓ PASS | Web data platform and proxy services for data collection |
| [browserless](./browserless) | ✓ PASS | Headless browser automation service for web scraping and testing |
| [chatwoot](./chatwoot) | ✓ PASS | Open-source customer engagement platform with live chat |
| [cloudinary](./cloudinary) | ✓ PASS | Media management and transformation for images and videos |
| [cronlytic](./cronlytic) | ✓ PASS | Cron job monitoring service with status tracking |
| [deepseek](./deepseek) | ✓ PASS | AI language model API for chat completions |
| [dev.to](./dev.to) | ✓ PASS | Dev.to article publishing and management API |
| [devto-publish](./devto-publish) | ✓ PASS | Legacy Dev.to article publishing API |
| [discord](./discord) | ✓ PASS | Discord bot and messaging automation with channel management |
| [discord-webhook](./discord-webhook) | ✗ FAIL | Discord webhook integrations (missing DISCORD_WEBHOOK_URL) |
| [elevenlabs](./elevenlabs) | ✓ PASS | AI voice generation and text-to-speech synthesis |
| [fal.ai](./fal.ai) | ✓ PASS | AI model inference platform for image generation |
| [figma](./figma) | ✓ PASS | Design collaboration platform API for files and projects |
| [firecrawl](./firecrawl) | ✓ PASS | Web scraping and data extraction with crawling capabilities |
| [github](./github) | ✓ PASS | GitHub repository and code management with gh CLI |
| [github-copilot](./github-copilot) | ✓ PASS | AI pair programming assistant with code suggestions |
| [gitlab](./gitlab) | ✓ PASS | GitLab DevOps platform for repositories and CI/CD |
| [google-sheets](./google-sheets) | ✗ FAIL | Google Sheets spreadsheet automation (expired GOOGLE_ACCESS_TOKEN) |
| [hackernews](./hackernews) | ✓ PASS | Hacker News API client for stories and comments |
| [htmlcsstoimage](./htmlcsstoimage) | ✓ PASS | HTML/CSS to image conversion service |
| [imgur](./imgur) | ✗ FAIL | Image hosting and sharing platform (missing IMGUR_CLIENT_ID) |
| [instagram](./instagram) | ✗ FAIL | Instagram API integrations (missing credentials) |
| [instantly](./instantly) | ✓ PASS | Email outreach automation platform for campaigns |
| [intercom](./intercom) | ✗ FAIL | Customer messaging and support platform (missing INTERCOM_ACCESS_TOKEN) |
| [jira](./jira) | ✓ PASS | Project and issue tracking system with Atlassian Jira |
| [kommo](./kommo) | ✓ PASS | CRM and sales automation platform with lead management |
| [lark](./lark) | ✓ PASS | Team collaboration and productivity suite with messaging |
| [linear](./linear) | ✓ PASS | Issue tracking for software teams with project management |
| [minimax](./minimax) | ✓ PASS | AI model API platform for chat and text completions |
| [minio](./minio) | ✓ PASS | Object storage compatible with Amazon S3 |
| [monday](./monday) | ✓ PASS | Work operating system platform for project management |
| [notion](./notion) | ✓ PASS | Workspace for notes and databases with page management |
| [openai](./openai) | ✓ PASS | OpenAI GPT models and APIs for chat and completions |
| [pdf4me](./pdf4me) | ✓ PASS | PDF conversion and manipulation service |
| [pdfco](./pdfco) | ✓ PASS | PDF generation and processing API with OCR |
| [pdforge](./pdforge) | ✓ PASS | PDF generation service from HTML templates |
| [perplexity](./perplexity) | ✓ PASS | AI-powered search and answer engine with citations |
| [plausible](./plausible) | ✓ PASS | Privacy-focused web analytics without cookies |
| [podchaser](./podchaser) | ✓ PASS | Podcast database and discovery platform |
| [pushinator](./pushinator) | ✓ PASS | Push notification service for multiple platforms |
| [qdrant](./qdrant) | ✓ PASS | Vector database for AI applications and embeddings |
| [qiita](./qiita) | ✓ PASS | Japanese technical knowledge platform for articles |
| [reportei](./reportei) | ✗ FAIL | Marketing reports automation (missing credentials) |
| [rss-fetch](./rss-fetch) | ✗ FAIL | RSS feed parser and reader (test failures) |
| [runway](./runway) | ✗ FAIL | AI video and image generation (test failures) |
| [scrapeninja](./scrapeninja) | ✗ FAIL | Web scraping API service (missing credentials) |
| [sentry](./sentry) | ✗ FAIL | Application monitoring and error tracking (test failures) |
| [serpapi](./serpapi) | ✗ FAIL | Search engine results API (missing credentials) |
| [shortio](./shortio) | ✗ FAIL | URL shortening and link management (test failures) |
| [slack](./slack) | ✗ FAIL | Team messaging and collaboration (test failures) |
| [slack-webhook](./slack-webhook) | ✗ FAIL | Slack incoming webhooks (missing SLACK_WEBHOOK_URL) |
| [streak](./streak) | ✗ FAIL | CRM for Gmail (missing credentials) |
| [supadata](./supadata) | ✗ FAIL | Data enrichment and verification (test failures) |
| [tavily](./tavily) | ✗ FAIL | AI research and search API (test failures) |
| [twenty](./twenty) | ✗ FAIL | Open-source CRM (test failures) |
| [youtube](./youtube) | ✗ FAIL | YouTube data and video management (test failures) |
| [zapsign](./zapsign) | ✗ FAIL | Electronic signature platform (test failures) |
| [zendesk](./zendesk) | ✗ FAIL | Customer service and support platform (test failures) |
| [zeptomail](./zeptomail) | ✗ FAIL | Transactional email service (test failures) |

**Status Legend:** ✓ PASS = All tests passing | ✗ FAIL = Tests failed

**Last Tested:** 2025-12-26

## Contributing

To add a new skill or improve an existing one, please ensure all examples in SKILL.md are tested and working before submitting a pull request.
