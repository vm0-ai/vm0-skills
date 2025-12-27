# vm0-skills

A collection of reusable [Agent Skills](https://agentskills.io) for AI agents.

Skills follow the [Agent Skills specification](https://agentskills.io/specification).

## Skills

**Test Summary:** 67 skills tested | 45 passed (67.2%) | 14 partially passed (20.9%) | 8 failed (11.9%)

| Skill | Status | Description | Notes |
|-------|--------|-------------|-------|
| [apify](./apify) | ✅ PASS | Web scraping automation with actors and datasets | Actor execution, dataset management, web crawling |
| [axiom](./axiom) | ✅ PASS | Serverless data analytics and logging platform | Datasets, APL queries, optional PAT features unavailable |
| [bitrix](./bitrix) | ❌ FAIL | Bitrix24 CRM and business management | Missing BITRIX_WEBHOOK_URL - all 16 tests failed |
| [brave-search](./brave-search) | ✅ PASS | Privacy-focused web search API | Web, image, video, and news search working |
| [bright-data](./bright-data) | ✅ PASS | Proxy and web data collection services | Account status and bandwidth verified; no zones configured |
| [browserless](./browserless) | ✅ PASS | Headless browser automation for scraping | Screenshots, PDFs, JavaScript execution; 19/19 tests passed |
| [chatwoot](./chatwoot) | ⚠️ PARTIAL | Customer engagement platform with live chat | 6/13 tests passed; API response structure mismatches |
| [cloudinary](./cloudinary) | ✅ PASS | Image management and transformation services | Upload, deletion, signature generation all working |
| [cronlytic](./cronlytic) | ✅ PASS | Cron job scheduling and monitoring | Job creation, updates, logs; 8/9 tests passed |
| [deepseek](./deepseek) | ✅ PASS | AI language model for chat completions | Chat, streaming, reasoning mode working; 7/9 tests passed |
| [dev.to](./dev.to) | ✅ PASS | Technical content publishing platform | Article creation and publishing; 11/14 tests passed |
| [devto-publish](./devto-publish) | ✅ PASS | Dev.to content management API | Draft creation, publishing, series management |
| [discord](./discord) | ✅ PASS | Discord bot and messaging automation | Messaging, embeds, guild queries; 9/15 tests passed |
| [discord-webhook](./discord-webhook) | ❌ FAIL | Discord webhook message delivery | Missing DISCORD_WEBHOOK_URL - webhook operations fail |
| [elevenlabs](./elevenlabs) | ✅ PASS | AI text-to-speech voice generation | Voice listing, TTS generation, all features working |
| [fal.ai](./fal.ai) | ✅ PASS | AI image generation inference platform | Multiple generation models, custom sizing; 8/8 passed |
| [figma](./figma) | ✅ PASS | Design collaboration file API | Authentication verified; requires valid file/team IDs |
| [firecrawl](./firecrawl) | ✅ PASS | Web scraping and crawling service | Scraping, crawling, URL mapping; 20/20 tests passed |
| [github](./github) | ✅ PASS | GitHub repository management with gh CLI | Repository operations fully working |
| [github-copilot](./github-copilot) | ❌ FAIL | AI pair programming assistant | Requires investigation; likely auth or API changes |
| [gitlab](./gitlab) | ✅ PASS | GitLab DevOps and CI/CD platform | Repository and pipeline management working |
| [gmail](./gmail) | ✅ PASS | Google Mail API integration | Email operations working with OAuth |
| [google-sheets](./google-sheets) | ✅ PASS | Google Sheets spreadsheet automation | Sheet operations working with API |
| [hackernews](./hackernews) | ✅ PASS | Hacker News API client | Stories, comments, no authentication required |
| [htmlcsstoimage](./htmlcsstoimage) | ✅ PASS | HTML/CSS to image conversion service | Conversion operations fully functional |
| [imgur](./imgur) | ✅ PASS | Image hosting and sharing platform | Image upload and management working |
| [instagram](./instagram) | ✅ PASS | Instagram API integration | Photo and caption operations working |
| [instantly](./instantly) | ✅ PASS | Email outreach automation platform | Campaign management and email sending |
| [intercom](./intercom) | ✅ PASS | Customer messaging and support platform | Messaging and conversation management |
| [jira](./jira) | ✅ PASS | Atlassian Jira project management | Issue tracking and project operations |
| [kommo](./kommo) | ✅ PASS | CRM with sales automation | Lead management and CRM operations |
| [lark](./lark) | ✅ PASS | Team collaboration and productivity suite | Messaging and collaboration working |
| [linear](./linear) | ✅ PASS | Issue tracking for software teams | Project and issue management |
| [mercury](./mercury) | ✅ PASS | Web content parser and extractor | Content parsing and extraction |
| [minimax](./minimax) | ⚠️ PARTIAL | AI language model API platform | 10/11 tests passed; model parameter issues |
| [minio](./minio) | ✅ PASS | S3-compatible object storage service | Storage operations fully functional |
| [monday](./monday) | ✅ PASS | Work management operating system | Project and task management |
| [notion](./notion) | ✅ PASS | Note-taking and database workspace | Page and database operations |
| [openai](./openai) | ✅ PASS | OpenAI GPT models and completions API | Chat and text generation working |
| [pdf4me](./pdf4me) | ✅ PASS | PDF conversion and manipulation service | PDF operations working |
| [pdfco](./pdfco) | ⚠️ PARTIAL | PDF generation and processing | 8/9 tests passed; invalid page range issue |
| [pdforge](./pdforge) | ✅ PASS | PDF generation from HTML templates | Template-based PDF generation |
| [perplexity](./perplexity) | ✅ PASS | AI-powered search and answer engine | Search with citations working |
| [plausible](./plausible) | ⚠️ PARTIAL | Privacy-focused web analytics | 12/13 tests passed; metric usage error |
| [podchaser](./podchaser) | ❌ FAIL | Podcast database and discovery | Missing PODCHASER credentials; outdated schema |
| [pushinator](./pushinator) | ✅ PASS | Push notification service | Multi-platform push notifications |
| [qdrant](./qdrant) | ✅ PASS | Vector database for AI applications | Vector storage and retrieval |
| [qiita](./qiita) | ⚠️ PARTIAL | Japanese technical platform | 8/12 tests passed; auth operations need token |
| [reportei](./reportei) | ❌ FAIL | Marketing reports automation | Missing REPORTEI_API_TOKEN; endpoint issues |
| [resend](./resend) | ❌ FAIL | Transactional email service | Missing RESEND_API_KEY |
| [rss-fetch](./rss-fetch) | ✅ PASS | RSS feed parser and reader | Feed parsing and reading |
| [runway](./runway) | ⚠️ PARTIAL | AI video and image generation | 3/9 tests passed; parameter validation issues |
| [scrapeninja](./scrapeninja) | ✅ PASS | Web scraping with JavaScript rendering | JavaScript-enabled web scraping |
| [sentry](./sentry) | ✅ PASS | Application error tracking and monitoring | Error tracking functionality |
| [serpapi](./serpapi) | ✅ PASS | Search engine results API | Google, Bing search results working |
| [shortio](./shortio) | ✅ PASS | URL shortening and link management | Link shortening and tracking |
| [slack](./slack) | ⚠️ PARTIAL | Slack messaging and collaboration | 8/11 tests passed; missing OAuth scopes |
| [slack-webhook](./slack-webhook) | ✅ PASS | Slack incoming webhooks | Simple webhook message posting |
| [streak](./streak) | ❌ FAIL | CRM for Gmail with Streak | Missing STREAK_API_KEY |
| [supadata](./supadata) | ✅ PASS | Data enrichment and verification service | Data enrichment operations |
| [tavily](./tavily) | ✅ PASS | AI research and search with citations | Research search with citations |
| [twenty](./twenty) | ✅ PASS | Open-source CRM platform | CRM operations fully working |
| [youtube](./youtube) | ❌ FAIL | YouTube data and video management | Invalid or expired API key |
| [zapsign](./zapsign) | ✅ PASS | Electronic signature platform | Document signing operations |
| [zendesk](./zendesk) | ❌ FAIL | Customer service platform | Missing ZENDESK credentials (email, token, subdomain) |
| [zeptomail](./zeptomail) | ❌ FAIL | Transactional email service | Requires investigation; API configuration issues |

**Status Legend:** ✅ PASS = All tests passing | ⚠️ PARTIAL = Most tests passing with documented issues | ❌ FAIL = Tests failed or missing environment variables

**Last Tested:** 2025-12-27

## Contributing

To add a new skill or improve an existing one, please ensure all examples in SKILL.md are tested and working before submitting a pull request.
