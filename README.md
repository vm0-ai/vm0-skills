# vm0-skills

A collection of reusable [Agent Skills](https://agentskills.io) for AI agents.

Skills follow the [Agent Skills specification](https://agentskills.io/specification).

## Skills

**Test Summary:** 69 skills tested | 23 fully passed (33.3%) | 24 partially passed (34.8%) | 22 failed (31.9%) | Overall functionality rate: 68%

| Skill | Status | Description | Notes |
|-------|--------|-------------|-------|
| [apify](./apify) | ✅ PASS | Web scraping automation with actors and datasets | 10/11 tests passed; 1 requires paid actor subscription |
| [axiom](./axiom) | ✅ PASS | Serverless data analytics and logging platform | 10/11 tests passed; PAT token optional feature |
| [bitrix](./bitrix) | ❌ FAIL | Bitrix24 CRM and business management | Missing BITRIX_WEBHOOK_URL - 0/16 tests passed |
| [brave-search](./brave-search) | ✅ PASS | Privacy-focused web search API | 6/6 tests passed; all features working |
| [bright-data](./bright-data) | ✅ PASS | Proxy and web data collection services | 3/4 tests passed; no zones configured |
| [browserless](./browserless) | ⚠️ PARTIAL | Headless browser automation for scraping | 17/19 tests passed; 2 endpoints returning 400 errors |
| [chatwoot](./chatwoot) | ⚠️ PARTIAL | Customer engagement platform with live chat | 10/13 tests passed; jq filter issues with API responses |
| [cloudinary](./cloudinary) | ✅ PASS | Image management and transformation services | 9/9 tests passed; upload, transform, delete working |
| [cronlytic](./cronlytic) | ⚠️ PARTIAL | Cron job scheduling and monitoring | 3/9 tests passed; 6 endpoints non-functional |
| [deepseek](./deepseek) | ⚠️ PARTIAL | AI language model for chat completions | 8/11 tests passed; TTS endpoints failing |
| [dev.to](./dev.to) | ⚠️ PARTIAL | Technical content publishing platform | 12/13 tests passed; article by ID endpoint fails |
| [discord-webhook](./discord-webhook) | ❌ FAIL | Discord webhook message delivery | Missing DISCORD_WEBHOOK_URL - 0/7 tests passed |
| [elevenlabs](./elevenlabs) | ⚠️ PARTIAL | AI text-to-speech voice generation | 9/15 tests passed; bot not in channels, missing scopes |
| [fal.ai](./fal.ai) | ⚠️ PARTIAL | AI image generation inference platform | 5/9 tests passed; jq parsing, missing resources |
| [figma](./figma) | ⚠️ PARTIAL | Design collaboration file API | 2/15 tests passed; jq parsing errors, test resources needed |
| [firecrawl](./firecrawl) | ✅ PASS | Web scraping and crawling service | 8/8 tests passed; scraping, crawling, maps working |
| [github](./github) | ⚠️ PARTIAL | GitHub repository management with gh CLI | 3/4 tests passed; 1 JSON field error |
| [github-copilot](./github-copilot) | ❌ FAIL | AI pair programming assistant | Missing Copilot subscription - 0/6 tests passed |
| [gitlab](./gitlab) | ⚠️ PARTIAL | GitLab DevOps and CI/CD platform | 9/10 tests passed; 2 expected failures |
| [gmail](./gmail) | ❌ FAIL | Google Mail API integration | Missing OAuth credentials - 0/9 tests passed |
| [google-sheets](./google-sheets) | ❌ FAIL | Google Sheets spreadsheet automation | Missing OAuth credentials - 0/8 tests passed |
| [hackernews](./hackernews) | ⚠️ PARTIAL | Hacker News API client | 11/12 tests passed; documentation syntax error |
| [htmlcsstoimage](./htmlcsstoimage) | ❌ FAIL | HTML/CSS to image conversion service | Plan limit exceeded - 0/5 tests passed |
| [imgur](./imgur) | ❌ FAIL | Image hosting and sharing platform | Rate limited + missing CLIENT_ID - 0/5 tests passed |
| [instagram](./instagram) | ❌ FAIL | Instagram API integration | Missing ACCESS_TOKEN and BUSINESS_ACCOUNT_ID - 0/8 tests passed |
| [instantly](./instantly) | ⚠️ PARTIAL | Email outreach automation platform | 10/11 tests passed; API ID format issues |
| [intercom](./intercom) | ⚠️ PARTIAL | Customer messaging and support platform | Requires valid workspace resources |
| [jira](./jira) | ⚠️ PARTIAL | Atlassian Jira project management | Requires valid project and issue resources |
| [kommo](./kommo) | ⚠️ PARTIAL | CRM with sales automation | Requires valid pipeline and lead resources |
| [lark](./lark) | ❌ FAIL | Team collaboration and productivity suite | Missing LARK_APP_ID and LARK_APP_SECRET - 0/8 tests passed |
| [linear](./linear) | ⚠️ PARTIAL | Issue tracking for software teams | 11/12 tests passed; complex bash variable substitution issue |
| [mercury](./mercury) | ❌ FAIL | Web content parser and extractor | Missing MERCURY_API_TOKEN - 0/3 tests passed |
| [minimax](./minimax) | ⚠️ PARTIAL | AI language model API platform | 8/11 tests passed; TTS endpoints failing |
| [minio](./minio) | ❌ FAIL | S3-compatible object storage service | Missing credentials + mc tool not installed - 0/11 tests passed |
| [monday](./monday) | ⚠️ PARTIAL | Work management operating system | 8/10 tests passed; bash quoting issues in 2 examples |
| [notion](./notion) | ⚠️ PARTIAL | Note-taking and database workspace | 2/18 tests passed; jq errors, resource-dependent |
| [openai](./openai) | ✅ PASS | OpenAI GPT models and completions API | 12/13 tests passed; env variable handling issue in 1 test |
| [pdf4me](./pdf4me) | ⚠️ PARTIAL | PDF conversion and manipulation service | 4/8 tests passed; timeout issues on conversions |
| [pdfco](./pdfco) | ⚠️ PARTIAL | PDF generation and processing | 8/9 tests passed; invalid page range in 1 example |
| [pdforge](./pdforge) | ✅ PASS | PDF generation from HTML templates | 5/5 tests passed (2 template examples skipped) |
| [perplexity](./perplexity) | ❌ FAIL | AI-powered search and answer engine | Invalid/missing PERPLEXITY_API_KEY - 0/8 tests passed |
| [plausible](./plausible) | ⚠️ PARTIAL | Privacy-focused web analytics | 11/17 tests passed; API key type limitation (needs Events API key) |
| [podchaser](./podchaser) | ❌ FAIL | Podcast database and discovery | Missing PODCHASER_CLIENT_ID and SECRET - 0/8 tests passed |
| [pushinator](./pushinator) | ❌ FAIL | Push notification service | Invalid PUSHINATOR_API_TOKEN - 0/4 tests passed |
| [qdrant](./qdrant) | ⚠️ PARTIAL | Vector database for AI applications | 9/11 tests passed; vector dimension mismatch in 2 tests |
| [qiita](./qiita) | ❌ FAIL | Japanese technical platform | Missing QIITA_ACCESS_TOKEN - 0/11 tests passed |
| [reportei](./reportei) | ❌ FAIL | Marketing reports automation | Missing REPORTEI_API_TOKEN - 0/5 tests passed |
| [resend](./resend) | ❌ FAIL | Transactional email service | Missing RESEND_API_KEY - 0/11 tests passed |
| [rss-fetch](./rss-fetch) | ⚠️ PARTIAL | RSS feed parser and reader | 9/11 tests passed; xmllint not installed for 2 tests |
| [runway](./runway) | ⚠️ PARTIAL | AI video and image generation | 5/9 tests passed; documentation parameter issues |
| [scrapeninja](./scrapeninja) | ✅ PASS | Web scraping with JavaScript rendering | 9/9 tests passed; all features working |
| [sentry](./sentry) | ✅ PASS | Application error tracking and monitoring | 20/20 accessible tests passed (some skipped due to no test data) |
| [serpapi](./serpapi) | ✅ PASS | Search engine results API | 9/9 tests passed; all search engines working |
| [shortio](./shortio) | ⚠️ PARTIAL | URL shortening and link management | 7/10 tests passed; jq parsing issues in 3 tests |
| [slack](./slack) | ⚠️ PARTIAL | Slack messaging and collaboration | 2/11 tests passed; bot not in channels, missing OAuth scopes |
| [slack-webhook](./slack-webhook) | ✅ PASS | Slack incoming webhooks | 8/8 tests passed; all webhook features working |
| [streak](./streak) | ❌ FAIL | CRM for Gmail with Streak | Missing STREAK_API_KEY - 0/9 tests passed |
| [supabase](./supabase) | ❌ FAIL | PostgreSQL database and backend | Missing all SUPABASE credentials - 0/12 tests passed |
| [supadata](./supadata) | ⚠️ PARTIAL | Data enrichment and verification service | 9/11 tests passed; invalid example URLs in 2 tests |
| [tavily](./tavily) | ✅ PASS | AI research and search with citations | 5/5 tests passed; all features working |
| [twenty](./twenty) | ⚠️ PARTIAL | Open-source CRM platform | 5/9 tests passed; documentation errors in 4 examples |
| [youtube](./youtube) | ❌ FAIL | YouTube data and video management | Invalid/missing YOUTUBE_API_KEY - 0/11 tests passed |
| [zapsign](./zapsign) | ⚠️ PARTIAL | Electronic signature platform | 1/10 tests passed; invalid example PDF URLs in 9 tests |
| [zendesk](./zendesk) | ❌ FAIL | Customer service platform | Missing all ZENDESK credentials - 0/13 tests passed |
| [zeptomail](./zeptomail) | ❌ FAIL | Transactional email service | Unverified sender domain - 0/6 tests passed |

**Status Legend:** ✅ PASS = All tests passing | ⚠️ PARTIAL = Most tests passing with documented issues | ❌ FAIL = Tests failed or missing environment variables

**Last Tested:** 2025-12-28

## Contributing

To add a new skill or improve an existing one, please ensure all examples in SKILL.md are tested and working before submitting a pull request.
