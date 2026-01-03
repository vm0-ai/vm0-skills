# Test Report

**Test Summary:** 66 skills | 37 passed | 17 with issues | 12 not covered | Last tested: 2025-12-31

## Fully Working Skills (37)

### Communication & Messaging
- [bitrix](../bitrix) - Bitrix24 CRM and business management
- [discord](../discord) - Discord bot API for messaging and automation
- [lark](../lark) - Team collaboration and productivity suite
- [slack-webhook](../slack-webhook) - Slack incoming webhooks
- [zendesk](../zendesk) - Customer service platform
- [zeptomail](../zeptomail) - Transactional email service

### AI & Machine Learning
- [deepseek](../deepseek) - AI language model for chat completions
- [elevenlabs](../elevenlabs) - AI text-to-speech voice generation
- [fal.ai](../fal.ai) - AI image generation inference platform
- [github-copilot](../github-copilot) - AI pair programming assistant
- [minimax](../minimax) - AI language model API platform

### Web & Data
- [brave-search](../brave-search) - Privacy-focused web search API
- [firecrawl](../firecrawl) - Web scraping and crawling service
- [hackernews](../hackernews) - Hacker News API client
- [scrapeninja](../scrapeninja) - Web scraping with JavaScript rendering
- [serpapi](../serpapi) - Search engine results API
- [tavily](../tavily) - AI research and search with citations

### Productivity & Development
- [cloudinary](../cloudinary) - Image management and transformation services
- [cronlytic](../cronlytic) - Cron job scheduling and monitoring
- [google-sheets](../google-sheets) - Google Sheets spreadsheet automation
- [htmlcsstoimage](../htmlcsstoimage) - HTML/CSS to image conversion service
- [linear](../linear) - Issue tracking for software teams
- [notion](../notion) - Note-taking and database workspace
- [supabase](../supabase) - PostgreSQL database and backend

### Media & Content
- [imgur](../imgur) - Image hosting and sharing platform
- [instagram](../instagram) - Instagram API integration
- [qiita](../qiita) - Japanese technical publishing platform
- [youtube](../youtube) - YouTube data and video management

### Infrastructure & Utilities
- [browserless](../browserless) - Headless browser automation
- [figma](../figma) - Design tool API integration
- [minio](../minio) - S3-compatible object storage service
- [plausible](../plausible) - Privacy-focused web analytics
- [pushinator](../pushinator) - Push notification service
- [rss-fetch](../rss-fetch) - RSS feed parser and reader
- [supadata](../supadata) - Data enrichment and verification service
- [twenty](../twenty) - CRM platform
- [zapsign](../zapsign) - Electronic signature platform

## Skills with Issues (17)

### Partial Functionality (8)
- [apify](../apify) - 11/12 tests passed; Amazon Crawler requires paid subscription
- [dev.to](../dev.to) - 12/13 tests passed; Rate limit reached on publish example
- [discord-webhook](../discord-webhook) - 9/10 tests passed; File attachment test failed
- [github](../github) - 13/14 tests passed; Missing permissions to create issues
- [gitlab](../gitlab) - 17/20 tests passed; Merge request creation failed
- [instantly](../instantly) - 13/15 tests passed; API status format and variable substitution errors
- [runway](../runway) - 4/9 tests passed; validation errors on example URLs
- [shortio](../shortio) - 8/10 tests failed; missing SHORTIO_DOMAIN_ID and invalid stats endpoint

### API Issues (9)
- [jira](../jira) - 15/16 tests failed; JQL syntax error in documentation
- [mercury](../mercury) - API endpoint failures
- [monday](../monday) - API endpoint failures
- [openai](../openai) - API failures
- [perplexity](../perplexity) - API failures
- [podchaser](../podchaser) - API endpoint failures
- [qdrant](../qdrant) - API endpoint failures
- [resend](../resend) - API failures
- [slack](../slack) - 2/11 tests failed; bot not in channels, missing OAuth scopes

## Not Covered (12)

No automated test coverage due to missing credentials. May work correctly once configured.

- [axiom](../axiom) - AXIOM_PERSONAL_ACCESS_TOKEN, AXIOM_ORG_ID
- [bright-data](../bright-data) - BRIGHTDATA_API_KEY
- [chatwoot](../chatwoot) - CHATWOOT credentials
- [gmail](../gmail) - OAuth credentials
- [kommo](../kommo) - KOMMO_DOMAIN, KOMMO_ACCESS_TOKEN
- [pdf4me](../pdf4me) - PDF4ME_API_KEY
- [pdfco](../pdfco) - PDFCO_API_KEY
- [reportei](../reportei) - REPORTEI_API_KEY
- [streak](../streak) - STREAK_API_KEY
- [figma](../figma) - FIGMA_ACCESS_TOKEN
- [intercom](../intercom) - INTERCOM_ACCESS_TOKEN
- [sentry](../sentry) - SENTRY_AUTH_TOKEN

## Test Categories

### Success Rate by Category
- **Infrastructure & Utilities**: 92% (12/13 working)
- **AI & Machine Learning**: 83% (5/6 working)
- **Communication & Messaging**: 60% (6/10 working)
- **Productivity & Development**: 71% (10/14 working)
- **Media & Content**: 75% (6/8 working)
- **Web & Data**: 86% (6/7 working)

## Recommendations

### High Priority Fixes
1. **jira** - Fix JQL syntax in documentation
2. **openai** - Resolve API connection issues
3. **slack** - Fix OAuth scopes and channel permissions

### API Service Validation
Skills needing API endpoint verification:
- mercury, monday, perplexity, podchaser, qdrant, resend

---

**Note**: This report is generated automatically from test results. Skills in the "Not Covered" section lack automated test coverage due to missing credentials, but may work correctly once configured.