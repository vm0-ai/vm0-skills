# Skill Authoring Guide

This document explains how to create a new skill for vm0-skills.

---

## Overview

1. Read the target SaaS API documentation
2. Write SKILL.md
3. Document how to obtain API tokens
4. Test every example
5. Summarize issues and fix SKILL.md

---

## 1. Read the Target SaaS API Documentation

Before writing a skill, thoroughly understand the target API:

- Use **Firecrawl** to scrape official documentation pages
- Use **Tavily** to search for API usage examples and best practices
- Focus on: authentication methods, common endpoints, request/response formats, rate limits

```bash
# Example: search API docs with Tavily
curl -s -X POST "https://api.tavily.com/search" --header "Content-Type: application/json" --header "Authorization: Bearer $TAVILY_API_KEY" -d '{"query": "Notion API authentication guide", "search_depth": "advanced", "max_results": 5}' | jq .
```

---

## 2. Write SKILL.md

Create `<skill-name>/SKILL.md` in the project root with the following structure:

```markdown
---
name: <skill-name>
description: <One-line description of what this skill does>
vm0_env:
  - ENV_VAR_1
  - ENV_VAR_2
---

# <Skill Name>

<Brief introduction explaining the purpose>

> Official docs: `<API documentation URL>`

---

## When to Use

Use this skill when you need to:

- <Use case 1>
- <Use case 2>
- <Use case 3>

---

## Prerequisites

Connect the **<Service Name>** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name ENV_VAR_1` or `zero doctor check-connector --url https://api.example.com/endpoint --method GET`

---

## How to Use

### 1. <Feature Name>

\`\`\`bash
curl -s -X GET "https://api.example.com/endpoint" --header "Authorization: Bearer $ENV_VAR_1" | jq .
\`\`\`

### 2. <Feature Name>

\`\`\`bash
curl -s -X POST "https://api.example.com/endpoint" --header "Content-Type: application/json" --header "Authorization: Bearer $ENV_VAR_1" -d '{"key": "value"}' | jq .
\`\`\`

---

## Guidelines

1. <Best practice 1>
2. <Best practice 2>
3. <Important notes>
```

### Writing Principles

- **Write everything in English** - all text, comments, and examples must be in English
- **Prefer curl examples** over shell scripts
- **Write curl commands on a single line** - do NOT use backslash (`\`) for line continuation, as it may cause issues in Claude Code
- Use `--header` instead of `-H` (better compatibility)
- All examples should be copy-paste executable
- Include the API documentation URL so agents can look up additional endpoints
- Reference tokens via environment variables (e.g. `$SERVICE_TOKEN`) — users connect the service at app.vm0.ai/connectors, never via manual `export`

---

## 3. Document How to Obtain API Tokens

In the Prerequisites section of SKILL.md, instruct users to connect the service at **app.vm0.ai/connectors**. Do NOT ask users to manually export environment variables.

The Prerequisites section must follow this exact format:

```markdown
## Prerequisites

Connect the **{Service Name}** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name {SERVICE}_TOKEN` or `zero doctor check-connector --url <base-url>/<representative-endpoint> --method GET`
```

Rules:
- One connector entry per token variable
- Always include the `zero doctor` troubleshooting line with a representative endpoint from the skill
- Do NOT write step-by-step account registration or API key creation steps — those belong in the vm0 Connector UI, not in SKILL.md

---

## 4. Test Every Example

After writing, test each curl example in SKILL.md. Environment variables are injected by vm0 at runtime from the configured connector — no manual sourcing needed:

```bash
curl -s -X GET "https://api.example.com/endpoint" --header "Authorization: Bearer $EXAMPLE_API_KEY" | jq .
```

Checklist:

- Does the command execute correctly?
- Is the response format as expected?
- Is error handling reasonable?
- Are environment variable names consistent?

---

## 5. Summarize Issues and Fix SKILL.md

Based on test results, document any issues encountered:

| Issue | Cause | Fix |
|-------|-------|-----|
| curl reports blank argument | `-H` has issues in some environments | Use `--header` instead |
| Authentication failed | Incorrect token format | Check Bearer prefix |
| Returns 404 | API version outdated | Update version number |

After fixing SKILL.md, re-test until all examples work correctly.

---

## After Completion

1. Update `docs/saas.md` and mark the corresponding API as `[x]` completed
2. Commit changes: `git add <skill-name>/ docs/saas.md && git commit`
3. Push to remote repository
