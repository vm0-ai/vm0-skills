# vm0-skills

A collection of reusable [Agent Skills](https://agentskills.io) for AI agents.

Skills follow the [Agent Skills specification](https://agentskills.io/specification).

## 🎯 Principles

1. **Focus on SaaS API Integration** - Focus on common SaaS API use cases, providing practical integration solutions

2. **Clean, Zero Scripts** - Keep code simple and clear, no redundant scripts, easy for AI Agents to learn and understand

3. **Security First** - All API calls are documented in SKILL.md for easy security auditing and compliance checks

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

### Popular Working Skills

**AI & ML:**
- [openai](./openai) - GPT models and completions
- [deepseek](./deepseek) - AI language model for chat
- [minimax](./minimax) - AI language model API
- [elevenlabs](./elevenlabs) - Text-to-speech voice generation
- [fal.ai](./fal.ai) - AI image generation

**Web & Data:**
- [brave-search](./brave-search) - Privacy-focused web search
- [serpapi](./serpapi) - Search engine results
- [firecrawl](./firecrawl) - Web scraping and crawling
- [scrapeninja](./scrapeninja) - Web scraping with JS rendering
- [browserless](./browserless) - Headless browser automation

**Communication:**
- [discord](./discord) - Discord bot API
- [slack-webhook](./slack-webhook) - Slack incoming webhooks
- [gmail](./gmail) - Google Mail API
- [resend](./resend) - Transactional email service
- [zeptomail](./zeptomail) - Email service

**Productivity:**
- [notion](./notion) - Note-taking and database
- [linear](./linear) - Issue tracking for software teams
- [github-copilot](./github-copilot) - AI pair programming
- [tavily](./tavily) - AI research with citations
- [google-sheets](./google-sheets) - Spreadsheet automation

**Media & Content:**
- [youtube](./youtube) - YouTube data and video management
- [cloudinary](./cloudinary) - Image management and transformation
- [imgur](./imgur) - Image hosting and sharing
- [figma](./figma) - Design tool API
- [htmlcsstoimage](./htmlcsstoimage) - HTML/CSS to image conversion

**Full test report available at [docs/test-report.md](./docs/test-report.md)**

## Contributing

To add a new skill or improve an existing one:

1. Follow the [Agent Skills specification](https://agentskills.io/specification)
2. Include a `SKILL.md` file with usage examples
3. Ensure all examples are tested and working
4. Submit a pull request


## Resources

- [Agent Skills Specification](https://agentskills.io/specification)
