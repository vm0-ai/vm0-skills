# vm0-skills

A collection of reusable [Agent Skills](https://agentskills.io) for AI agents.

Skills follow the [Agent Skills specification](https://agentskills.io/specification).

## Skills

**Test Summary:** 66 skills tested | 37 passed (56%) | 29 failed (44%) | Last tested: 2025-12-31

| Skill | Status | Description | Notes |
|-------|--------|-------------|-------|
| [apify](./apify) | ❌ FAIL | Web scraping automation with actors and datasets | 11/12 tests passed; Amazon Crawler requires paid subscription |
| [axiom](./axiom) | ❌ FAIL | Serverless data analytics and logging platform | 9/11 tests passed; Missing AXIOM_PERSONAL_ACCESS_TOKEN and AXIOM_ORG_ID |
| [bitrix](./bitrix) | ✅ PASS | Bitrix24 CRM and business management | All core functionality working |
| [brave-search](./brave-search) | ✅ PASS | Privacy-focused web search API | All search operations working |
| [bright-data](./bright-data) | ❌ FAIL | Proxy and web data collection services | Missing BRIGHTDATA_API_KEY |
| [chatwoot](./chatwoot) | ❌ FAIL | Customer engagement platform with live chat | 5/13 tests passed; Missing CHATWOOT credentials |
| [cloudinary](./cloudinary) | ✅ PASS | Image management and transformation services | Media management working |
| [cronlytic](./cronlytic) | ✅ PASS | Cron job scheduling and monitoring | Cron monitoring working |
| [deepseek](./deepseek) | ✅ PASS | AI language model for chat completions | AI model working |
| [dev.to](./dev.to) | ❌ FAIL | Technical content publishing platform | 12/13 tests passed; Rate limit reached on publish example |
| [discord](./discord) | ✅ PASS | Discord bot API for messaging and automation | All core functionality working |
| [discord-webhook](./discord-webhook) | ❌ FAIL | Discord webhook message delivery | 9/10 tests passed; File attachment test failed |
| [elevenlabs](./elevenlabs) | ✅ PASS | AI text-to-speech voice generation | Text-to-speech working |
| [fal.ai](./fal.ai) | ✅ PASS | AI image generation inference platform | Image generation working |
| [firecrawl](./firecrawl) | ✅ PASS | Web scraping and crawling service | All core functionality working |
| [github](./github) | ❌ FAIL | GitHub repository management with gh CLI | 13/14 tests passed; Missing permissions to create issues |
| [github-copilot](./github-copilot) | ✅ PASS | AI pair programming assistant | Code suggestions working |
| [gitlab](./gitlab) | ❌ FAIL | GitLab DevOps and CI/CD platform | 17/20 tests passed; Merge request creation failed |
| [gmail](./gmail) | ❌ FAIL | Google Mail API integration | Missing OAuth credentials |
| [google-sheets](./google-sheets) | ✅ PASS | Google Sheets spreadsheet automation | All core functionality working |
| [hackernews](./hackernews) | ✅ PASS | Hacker News API client | All API queries working |
| [htmlcsstoimage](./htmlcsstoimage) | ✅ PASS | HTML/CSS to image conversion service | Screenshot generation working |
| [imgur](./imgur) | ✅ PASS | Image hosting and sharing platform | Image upload working |
| [instagram](./instagram) | ✅ PASS | Instagram API integration | All core functionality working |
| [instantly](./instantly) | ❌ FAIL | Email outreach automation platform | 13/15 tests passed; API status format and variable substitution errors |
| [jira](./jira) | ❌ FAIL | Atlassian Jira project management | 15/16 tests failed; JQL syntax error in documentation |
| [kommo](./kommo) | ❌ FAIL | CRM with sales automation | Missing KOMMO_DOMAIN, KOMMO_ACCESS_TOKEN |
| [lark](./lark) | ✅ PASS | Team collaboration and productivity suite | All core functionality working |
| [linear](./linear) | ✅ PASS | Issue tracking for software teams | Issue tracking working |
| [mercury](./mercury) | ❌ FAIL | Web content parser and extractor | API endpoint failures |
| [minimax](./minimax) | ✅ PASS | AI language model API platform | AI model working |
| [minio](./minio) | ✅ PASS | S3-compatible object storage service | All core functionality working |
| [monday](./monday) | ❌ FAIL | Work management operating system | API endpoint failures |
| [notion](./notion) | ✅ PASS | Note-taking and database workspace | Database operations working |
| [openai](./openai) | ❌ FAIL | OpenAI GPT models and completions API | API failures |
| [pdf4me](./pdf4me) | ❌ FAIL | PDF conversion and manipulation service | Missing PDF4ME_API_KEY |
| [pdfco](./pdfco) | ❌ FAIL | PDF generation and processing | Missing PDFCO_API_KEY |
| [pdforge](./pdforge) | ❌ FAIL | PDF generation from HTML templates | API endpoint failures |
| [perplexity](./perplexity) | ❌ FAIL | AI-powered search and answer engine | API failures |
| [plausible](./plausible) | ✅ PASS | Privacy-focused web analytics | Analytics working |
| [podchaser](./podchaser) | ❌ FAIL | Podcast database and discovery | API endpoint failures |
| [pushinator](./pushinator) | ✅ PASS | Push notification service | Push notifications working |
| [qdrant](./qdrant) | ❌ FAIL | Vector database for AI applications | API endpoint failures |
| [qiita](./qiita) | ✅ PASS | Japanese technical publishing platform | Article API working |
| [reportei](./reportei) | ❌ FAIL | Marketing reports automation | Missing REPORTEI_API_KEY |
| [resend](./resend) | ❌ FAIL | Transactional email service | API failures |
| [rss-fetch](./rss-fetch) | ✅ PASS | RSS feed parser and reader | Feed parsing working |
| [runway](./runway) | ❌ FAIL | AI video and image generation | 4/9 tests passed; validation errors on example URLs |
| [scrapeninja](./scrapeninja) | ✅ PASS | Web scraping with JavaScript rendering | All core functionality working |
| [serpapi](./serpapi) | ✅ PASS | Search engine results API | Search working |
| [shortio](./shortio) | ❌ FAIL | URL shortening and link management | 8/10 tests failed; missing SHORTIO_DOMAIN_ID and invalid stats endpoint |
| [slack](./slack) | ❌ FAIL | Slack messaging and collaboration | 2/11 tests failed; bot not in channels, missing OAuth scopes |
| [slack-webhook](./slack-webhook) | ✅ PASS | Slack incoming webhooks | All core functionality working |
| [streak](./streak) | ❌ FAIL | CRM for Gmail with Streak | Missing STREAK_API_KEY |
| [supadata](./supadata) | ✅ PASS | Data enrichment and verification service | All core functionality working |
| [supabase](./supabase) | ✅ PASS | PostgreSQL database and backend | All core functionality working |
| [tavily](./tavily) | ✅ PASS | AI research and search with citations | All core functionality working |
| [youtube](./youtube) | ✅ PASS | YouTube data and video management | All core functionality working |
| [zapsign](./zapsign) | ✅ PASS | Electronic signature platform | All core functionality working |
| [zendesk](./zendesk) | ✅ PASS | Customer service platform | All core functionality working |
| [zeptomail](./zeptomail) | ✅ PASS | Transactional email service | All core functionality working |
| [browserless](./browserless) | ✅ PASS | Headless browser automation | All core functionality working |
| [figma](./figma) | ✅ PASS | Design tool API integration | All core functionality working |
| [twenty](./twenty) | ✅ PASS | CRM platform | All core functionality working |

**Status Legend:** ✅ PASS = All tests passing or mostly passing with minor issues | ❌ FAIL = Tests failed due to missing credentials or critical errors

**Last Tested:** 2025-12-31

## Contributing

To add a new skill or improve an existing one, please ensure all examples in SKILL.md are tested and working before submitting a pull request.
