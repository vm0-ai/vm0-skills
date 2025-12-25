# vm0-skills

A collection of reusable [Agent Skills](https://agentskills.io) for AI agents.

Skills follow the [Agent Skills specification](https://agentskills.io/specification).

## Test Results Summary

**Last Tested**: 2025-12-25

### Overview
- **Total Skills**: 61
- **Passed**: 27 (44%)
- **Failed**: 12 (20%)
- **Partial**: 22 (36%)
- **Overall Pass Rate**: 44%

### Skills by Status

#### ✅ Fully Passing Skills (27)
Skills with all or most examples passing:
- bitrix, brave-search, bright-data, cloudinary, cronlytic, deepseek
- devto-publish, discord, elevenlabs, fal.ai, firecrawl, github, gitlab
- hackernews, htmlcsstoimage, jira, kommo, lark, linear, minimax, minio
- notion, openai, pdfco, pdforge, perplexity, pushinator

#### ⚠️ Partial/Warning Skills (22)
Skills with some working features but issues:
- apify (5/12 passed), browserless (15/19 passed), monday (7/10 passed)
- pdf4me (3/8 passed), qdrant (11/13 passed), scrapeninja (7/9 passed)
- rss-fetch, sentry, serpapi, slack, slack-webhook, qiita, streak
- supadata, tavily, twenty, youtube, zapsign, zendesk, zeptomail
- github-copilot, runway, shortio

#### ❌ Failed Skills (12)
Skills requiring API keys or configuration:
- axiom (invalid/expired token)
- chatwoot (env vars not set)
- discord-webhook (missing webhook URL)
- figma (missing API token)
- google-sheets (invalid access token)
- imgur (missing client ID)
- instagram (missing credentials)
- instantly (API validation issues)
- intercom (missing access token)
- plausible (missing/invalid API key)
- reportei (authentication issues)

### Common Issues

1. **Missing or Invalid API Keys** (15 skills) - Credentials not configured or expired
2. **API Plan/Quota Limitations** (8 skills) - Free tier restrictions or exceeded limits
3. **Documentation Errors** (5 skills) - Outdated examples or incorrect parameters
4. **Permission Issues** (4 skills) - Insufficient token scopes or access rights
5. **Shell Command Syntax** (3 skills) - JSON escaping or quoting issues in examples

### Detailed Results

For comprehensive test results including all tested examples, detailed notes, and recommendations, see [result.md](./result.md).

## Contributing

To add a new skill or improve an existing one, please ensure all examples in SKILL.md are tested and working before submitting a pull request.
