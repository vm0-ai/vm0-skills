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
bash -c 'curl -s -X POST "https://api.tavily.com/search" --header "Content-Type: application/json" --header "Authorization: Bearer $TAVILY_API_KEY" -d '"'"'{"query": "Notion API authentication guide", "search_depth": "advanced", "max_results": 5}'"'"' | jq .'
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

1. <How to register / obtain access>
2. <What API keys or tokens are needed>

Set environment variables:

\`\`\`bash
export ENV_VAR_1="your-value"
export ENV_VAR_2="your-value"
\`\`\`

---

## How to Use

### 1. <Feature Name>

\`\`\`bash
bash -c 'curl -s -X GET "https://api.example.com/endpoint" --header "Authorization: Bearer $ENV_VAR_1" | jq .'
\`\`\`

### 2. <Feature Name>

\`\`\`bash
bash -c 'curl -s -X POST "https://api.example.com/endpoint" --header "Content-Type: application/json" --header "Authorization: Bearer $ENV_VAR_1" -d '"'"'{"key": "value"}'"'"' | jq .'
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
- Pass sensitive information (tokens, keys) via environment variables
- **CRITICAL: Never use variables and pipes together** - see below

### Claude Code Bash Bug Workaround

Claude Code has a known bug where **environment variables are silently cleared when used with pipe operators**. This affects curl commands with API keys in headers.

**Related issues:**
- [#11225](https://github.com/anthropics/claude-code/issues/11225) - Comprehensive bash preprocessing bugs
- [#8318](https://github.com/anthropics/claude-code/issues/8318) - Environment variables cleared with pipes

**The Problem:**

```bash
# BAD - variable is silently cleared, API call fails with auth error
curl -s "https://api.example.com" --header "Authorization: Bearer $API_KEY" | jq .
```

**The Workaround:**

Wrap the entire command in `bash -c '...'` to bypass Claude Code's preprocessing:

```bash
# GOOD - bash -c creates a subshell that bypasses preprocessing
bash -c 'curl -s "https://api.example.com" --header "Authorization: Bearer $API_KEY" | jq .'
```

**Rules:**
1. Always use `bash -c '...'` when combining `$VAR` with pipes
2. Escape single quotes inside as `'"'"'` (end quote, literal quote, start quote)
3. Use `$VAR` instead of `${VAR}` (simpler, less prone to parsing issues)

**Example with JSON body (escaping single quotes):**
```bash
bash -c 'curl -s "https://api.example.com" --header "Authorization: Bearer $API_KEY" -d '"'"'{"key": "value"}'"'"' | jq .'
```

**For command substitution:**
```bash
VAR=$(bash -c 'curl -s "https://api.example.com" --header "Authorization: Bearer $API_KEY" | jq -r .id')
```

**For loops:**
```bash
for id in $(bash -c 'curl -s "https://api.example.com/ids" --header "Authorization: Bearer $API_KEY" | jq -r ".[]"'); do
  echo "Processing $id"
done
```

---

## 3. Document How to Obtain API Tokens

In the Prerequisites section of SKILL.md, clearly explain:

1. How to register an account
2. How to create an API key / token
3. What permissions or scopes are required

Users can store their tokens in `$HOME/.env.local`:

```bash
# $HOME/.env.local
export EXAMPLE_API_KEY="your-api-key"
export EXAMPLE_ACCOUNT_ID="your-account-id"
```

Source the file before use:

```bash
source $HOME/.env.local
```

---

## 4. Test Every Example

After writing, test each curl example in SKILL.md:

```bash
# Set environment variables
source $HOME/.env.local

# Execute example commands and verify results
bash -c 'curl -s -X GET "https://api.example.com/endpoint" --header "Authorization: Bearer $EXAMPLE_API_KEY" | jq .'
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
| API returns 401 but token is correct | Claude Code bug: variables cleared with pipes | Wrap in `bash -c '...'` |
| Variable appears empty in pipe | Claude Code preprocessing bug | Use `bash -c 'curl ... \| jq'` |

After fixing SKILL.md, re-test until all examples work correctly.

---

## After Completion

1. Update `docs/saas.md` and mark the corresponding API as `[x]` completed
2. Commit changes: `git add <skill-name>/ docs/saas.md && git commit`
3. Push to remote repository
