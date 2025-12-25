# vm0-skills

A collection of reusable [Agent Skills](https://agentskills.io) for AI agents.

Skills follow the [Agent Skills specification](https://agentskills.io/specification).

## Test Results Summary

**Last Tested**: 2025-12-25

### Overview
- **Total Skills**: 60
- **Passed**: 20 (33.3%)
- **Partial**: 28 (46.7%)
- **Failed**: 11 (18.3%)
- **Overall Pass Rate**: 54.8% (437/797 examples)

### Skills by Status

#### ✅ Passing Skills (20)
Skills with all examples passing:
- bright-data
- browserless
- cloudinary
- deepseek
- discord-webhook
- elevenlabs
- fal.ai
- firecrawl
- hackernews
- instagram
- openai
- pdforge
- pushinator
- qiita
- scrapeninja
- serpapi
- slack-webhook
- tavily
- youtube
- zeptomail

#### ⚠️ Partially Working Skills (28)
Skills with most examples passing but some failures:
- apify
- brave-search
- chatwoot
- cronlytic
- devto-publish
- discord
- github
- github-copilot
- gitlab
- google-sheets (partial)
- htmlcsstoimage
- instantly
- jira
- kommo
- lark
- linear
- minimax
- monday
- notion
- pdf4me
- pdfco
- perplexity
- plausible
- qdrant
- reportei (partial)
- rss-fetch
- runway
- sentry

#### ❌ Failed Skills (11)
Skills requiring configuration or fixes:
- axiom
- bitrix
- figma
- imgur
- intercom
- minio
- slack
- streak
- supadata
- twenty
- zendesk

### Common Issues

1. **Missing Environment Variables** (38 skills) - API keys or credentials not configured
2. **Invalid Parameters** (35 skills) - Example commands with outdated or incorrect parameters
3. **API Endpoint Changes** (14 skills) - API has changed since skill was created
4. **Insufficient Permissions** (8 skills) - API tokens lack required scopes

### Detailed Results

For comprehensive test results including all tested examples and detailed notes, see [result.md](./result.md).

## Contributing

To add a new skill or improve an existing one, please ensure all examples in SKILL.md are tested and working before submitting a pull request.
