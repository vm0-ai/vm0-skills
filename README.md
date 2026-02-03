# vm0-skills

A collection of reusable [Agent Skills](https://agentskills.io) for AI agents.

Skills follow the [Agent Skills specification](https://agentskills.io/specification).

## Why use this?

```
No MCPs.
No SDKs.
No CLI apps.

Just curl.

Organic skills that any AI agent can learn and use.
```

## Principles

1. **Focus on SaaS API Integration**: Focus on common SaaS API use cases, providing practical integration solutions
2. **Clean, Zero Scripts**: Keep code simple and clear, no redundant scripts, easy for AI Agents to learn and understand
3. **Security First**: All API calls are documented in SKILL.md for easy security auditing and compliance checks

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

## Contributing

To add a new skill or improve an existing one:

1. Follow the [Agent Skills specification](https://agentskills.io/specification)
2. Include a `SKILL.md` file with usage examples
3. Ensure all examples are tested and working
4. Submit a pull request


## Resources

- [Agent Skills Specification](https://agentskills.io/specification)
