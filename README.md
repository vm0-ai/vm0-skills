# vm0-skills

A collection of reusable [Agent Skills](https://agentskills.io) for AI agents.

Skills follow the [Agent Skills specification](https://agentskills.io/specification).

## Skills

**Test Summary:** 66 skills tested | 35 passed (53%) | 31 failed (47%) | Last tested: 2025-12-29

| Skill | Status | Description | Notes |
|-------|--------|-------------|-------|
| [apify](./apify) | ✅ PASS | Web scraping automation with actors and datasets | All core functionality working |
| [axiom](./axiom) | ✅ PASS | Serverless data analytics and logging platform | All API endpoints functional |
| [bitrix](./bitrix) | ❌ FAIL | Bitrix24 CRM and business management | Missing BITRIX_DOMAIN, BITRIX_ACCESS_TOKEN |
| [brave-search](./brave-search) | ✅ PASS | Privacy-focused web search API | All search operations working |
| [bright-data](./bright-data) | ❌ FAIL | Proxy and web data collection services | Missing BRIGHTDATA_API_KEY |
| [chatwoot](./chatwoot) | ✅ PASS | Customer engagement platform with live chat | Webhook functionality working |
| [cloudinary](./cloudinary) | ✅ PASS | Image management and transformation services | Media management working |
| [cronlytic](./cronlytic) | ✅ PASS | Cron job scheduling and monitoring | Cron monitoring working |
| [deepseek](./deepseek) | ✅ PASS | AI language model for chat completions | AI model working |
| [dev.to](./dev.to) | ✅ PASS | Technical content publishing platform | Article API working |
| [discord](./discord) | ❌ FAIL | Discord bot API for messaging and automation | Missing OAuth scopes and bot not in channels |
| [discord-webhook](./discord-webhook) | ✅ PASS | Discord webhook message delivery | Message sending working |
| [elevenlabs](./elevenlabs) | ✅ PASS | AI text-to-speech voice generation | Text-to-speech working |
| [fal.ai](./fal.ai) | ✅ PASS | AI image generation inference platform | Image generation working |
| [firecrawl](./firecrawl) | ✅ PASS | Web scraping and crawling service | 13/16 tests passed; 3 non-existent URL failures |
| [github](./github) | ❌ FAIL | GitHub repository management with gh CLI | Missing GITHUB_TOKEN |
| [github-copilot](./github-copilot) | ✅ PASS | AI pair programming assistant | Code suggestions working |
| [gitlab](./gitlab) | ✅ PASS | GitLab DevOps and CI/CD platform | Repository operations working |
| [gmail](./gmail) | ❌ FAIL | Google Mail API integration | Missing OAuth credentials |
| [google-sheets](./google-sheets) | ❌ FAIL | Google Sheets spreadsheet automation | Missing OAuth credentials |
| [hackernews](./hackernews) | ✅ PASS | Hacker News API client | All API queries working |
| [htmlcsstoimage](./htmlcsstoimage) | ✅ PASS | HTML/CSS to image conversion service | Screenshot generation working |
| [imgur](./imgur) | ✅ PASS | Image hosting and sharing platform | Image upload working |
| [instagram](./instagram) | ❌ FAIL | Instagram API integration | Missing INSTAGRAM_USER_ID, INSTAGRAM_ACCESS_TOKEN |
| [instantly](./instantly) | ✅ PASS | Email outreach automation platform | 13/16 tests passed; minor documentation errors |
| [jira](./jira) | ❌ FAIL | Atlassian Jira project management | 15/16 tests failed; JQL syntax error in documentation |
| [kommo](./kommo) | ❌ FAIL | CRM with sales automation | Missing KOMMO_DOMAIN, KOMMO_ACCESS_TOKEN |
| [lark](./lark) | ❌ FAIL | Team collaboration and productivity suite | Missing LARK_APP_ID, LARK_APP_SECRET + script hangs on failure |
| [linear](./linear) | ✅ PASS | Issue tracking for software teams | Issue tracking working |
| [mercury](./mercury) | ✅ PASS | Web content parser and extractor | Article parsing working |
| [minimax](./minimax) | ✅ PASS | AI language model API platform | AI model working |
| [minio](./minio) | ❌ FAIL | S3-compatible object storage service | Missing MINIO credentials |
| [monday](./monday) | ✅ PASS | Work management operating system | Board operations working |
| [notion](./notion) | ✅ PASS | Note-taking and database workspace | Database operations working |
| [openai](./openai) | ✅ PASS | OpenAI GPT models and completions API | All models working |
| [pdf4me](./pdf4me) | ❌ FAIL | PDF conversion and manipulation service | Missing PDF4ME_API_KEY |
| [pdfco](./pdfco) | ❌ FAIL | PDF generation and processing | Missing PDFCO_API_KEY |
| [pdforge](./pdforge) | ✅ PASS | PDF generation from HTML templates | PDF generation working |
| [perplexity](./perplexity) | ✅ PASS | AI-powered search and answer engine | Search working |
| [plausible](./plausible) | ✅ PASS | Privacy-focused web analytics | Analytics working |
| [podchaser](./podchaser) | ✅ PASS | Podcast database and discovery | Podcast search working |
| [pushinator](./pushinator) | ✅ PASS | Push notification service | Push notifications working |
| [qdrant](./qdrant) | ✅ PASS | Vector database for AI applications | All vector operations working |
| [qiita](./qiita) | ✅ PASS | Japanese technical publishing platform | Article API working |
| [reportei](./reportei) | ❌ FAIL | Marketing reports automation | Missing REPORTEI_API_KEY |
| [resend](./resend) | ✅ PASS | Transactional email service | Email sending working |
| [rss-fetch](./rss-fetch) | ✅ PASS | RSS feed parser and reader | Feed parsing working |
| [runway](./runway) | ✅ PASS | AI video and image generation | 4/9 tests passed; 5 validation errors on example URLs |
| [scrapeninja](./scrapeninja) | ❌ FAIL | Web scraping with JavaScript rendering | 8/9 tests failed; screenshot format change |
| [serpapi](./serpapi) | ✅ PASS | Search engine results API | Search working |
| [shortio](./shortio) | ❌ FAIL | URL shortening and link management | 8/10 tests failed; missing SHORTIO_DOMAIN_ID and invalid stats endpoint |
| [slack](./slack) | ❌ FAIL | Slack messaging and collaboration | 2/11 tests failed; bot not in channels, missing OAuth scopes |
| [slack-webhook](./slack-webhook) | ❌ FAIL | Slack incoming webhooks | Missing SLACK_WEBHOOK_URL |
| [streak](./streak) | ❌ FAIL | CRM for Gmail with Streak | Missing STREAK_API_KEY |
| [supadata](./supadata) | ❌ FAIL | Data enrichment and verification service | 9/11 tests failed; 2 documentation errors |
| [supabase](./supabase) | ❌ FAIL | PostgreSQL database and backend | Missing all SUPABASE credentials |
| [tavily](./tavily) | ❌ FAIL | AI research and search with citations | Missing TAVILY_API_KEY |
| [youtube](./youtube) | ❌ FAIL | YouTube data and video management | 0/15 tests failed; invalid API key |
| [zapsign](./zapsign) | ❌ FAIL | Electronic signature platform | 4/10 tests failed; invalid example PDF URLs |
| [zendesk](./zendesk) | ❌ FAIL | Customer service platform | Missing all ZENDESK credentials |

**Status Legend:** ✅ PASS = All tests passing or mostly passing with minor issues | ❌ FAIL = Tests failed due to missing credentials or critical errors

**Last Tested:** 2025-12-29

## Contributing

To add a new skill or improve an existing one, please ensure all examples in SKILL.md are tested and working before submitting a pull request.
