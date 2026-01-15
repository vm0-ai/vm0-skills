# Local Claude Code Workflow to VM0 Migration

**Description**: Migrate local Claude Code workflows with custom skills to VM0 agents, preserving functionality and automation logic.

**Required Environment Variables**: None

---

## When to Use This Skill

Use when the user wants to:
- "Migrate my local Claude Code workflow to VM0"
- "Convert my Claude Code skills to VM0 agent"
- "Run my local automation on VM0"
- "Move my Claude Code setup to VM0 cloud"
- "Deploy my local skill to VM0"

---

## How It Works

### Step 1: Identify the Local Skill to Migrate

**Ask the user**:
- Which skill do they want to migrate?
- Where is the skill located? (usually `~/.claude/skills/{skill-name}/`)

**Discover local skills**:
```bash
# List all local Claude Code skills
ls -la ~/.claude/skills/

# Show available skills
find ~/.claude/skills -name "SKILL.md" -type f
```

**Read the skill definition**:
```bash
# Read the skill's SKILL.md file
cat ~/.claude/skills/{skill-name}/SKILL.md
```

**IMPORTANT**: Claude Code skills are defined in `SKILL.md` files with natural language descriptions, not YAML config files.

### Step 2: Analyze the Skill

For the skill found, understand:
1. **Purpose**: What does this skill do?
2. **Commands**: What scripts/commands does it run?
3. **Dependencies**: What tools/languages does it need?
4. **Environment**: What env vars/secrets does it use?
5. **Triggers**: When/how is it invoked?

**Read skill files**:
```bash
# Read the main skill definition
cat ~/.claude/skills/{skill-name}/SKILL.md

# Check for local .env file
cat ~/.claude/skills/{skill-name}/.env 2>/dev/null

# Check for dependencies
ls ~/.claude/skills/{skill-name}/requirements.txt 2>/dev/null
ls ~/.claude/skills/{skill-name}/package.json 2>/dev/null

# Check for helper scripts
ls -la ~/.claude/skills/{skill-name}/scripts/ 2>/dev/null
```

**Extract environment variables from SKILL.md**:
- Look for mentions of environment variables (e.g., `NOTION_API_KEY`, `DATABASE_ID`)
- Find patterns like `$VARIABLE_NAME` or `env.VARIABLE_NAME`
- Note which variables are required vs optional

### Step 3: Detect and Confirm Environment Variables

**Auto-detect environment variables**:

1. **Extract from local skill's .env file**:
```bash
# If skill has a .env file, read it
if [ -f ~/.claude/skills/{skill-name}/.env ]; then
  cat ~/.claude/skills/{skill-name}/.env
fi
```

2. **Parse SKILL.md for environment variable references**:
```bash
# Look for patterns like $VAR_NAME, ${VAR_NAME}, or mentions of env vars
grep -E '\$\{?[A-Z_]+\}?|NOTION_|DATABASE_|API_|TOKEN|SECRET' ~/.claude/skills/{skill-name}/SKILL.md
```

3. **Read current environment values**:
```bash
# For each detected variable, get its current value
echo $NOTION_API_KEY
echo $DATABASE_ID
# etc.
```

**Present to user for confirmation**:
```
I detected the following environment variables from your local skill:

✓ CLAUDE_CODE_OAUTH_TOKEN: sk-ant-oat01-... (found in environment)
✓ NOTION_API_KEY: ntn_F391... (found in ~/.claude/skills/world-news-summary/.env)
✓ NOTION_TOKEN: ntn_F391... (found in ~/.claude/skills/world-news-summary/.env)
✓ DATABASE_ID: 2e80e96f... (found in ~/.claude/skills/world-news-summary/.env)
✓ NEWS_CATEGORIES: ai_agents,international,business (found in .env)

Should I use these values for the VM0 agent? (y/n)
If no, I'll ask you to provide the values manually.
```

**If user confirms**, proceed with these values.
**If user declines**, ask for each variable individually.

### Step 4: Create VM0 Agent Configuration

**Ask the user**:
- Where to create the VM0 project? (default: `~/Desktop/{skill-name}/`)

Generate `vm0.yaml` (NOT `.vm0/vm0.yaml`) with detected environment variables:

```yaml
version: "1.0"

agents:
  {skill-name}:
    provider: claude-code
    instructions: AGENTS.md

    # Include VM0 skills based on what the local skill uses
    skills:
      - https://github.com/vm0-ai/vm0-skills/tree/main/notion    # if uses Notion
      - https://github.com/vm0-ai/vm0-skills/tree/main/github    # if uses GitHub
      - https://github.com/vm0-ai/vm0-skills/tree/main/slack     # if uses Slack

    environment:
      # Claude Code OAuth token (if needed)
      CLAUDE_CODE_OAUTH_TOKEN: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}

      # Map all environment variables from local skill
      API_KEY: ${{ secrets.API_KEY }}
      DATABASE_ID: ${{ secrets.DATABASE_ID }}
      # Add more as needed
```

**IMPORTANT**:
- Use `vm0.yaml` at project root, NOT `.vm0/vm0.yaml`
- Use `agents:` structure with skill name as key
- Use `instructions: AGENTS.md` (relative path)

**Also generate `.env` file for local testing** (using detected values):
```bash
# Auto-generate .env file with detected values
cat > .env << EOF
CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat01-...
NOTION_API_KEY=ntn_F391...
NOTION_TOKEN=ntn_F391...
DATABASE_ID=2e80e96f...
NEWS_CATEGORIES=ai_agents,international,business
EOF
```

**Security note**: Remind user that `.env` is for local testing only. For production, use VM0 secrets.

### Step 5: Convert SKILL.md to AGENTS.md

Create `AGENTS.md` at project root that translates the local skill's logic into agent instructions.

**Key Principle**: Translate the skill's natural language description into agent instructions that accomplish the same tasks.

**Conversion approach**:
1. Read the local `SKILL.md` carefully
2. Understand the workflow steps and logic
3. Preserve the same structure and steps
4. Add VM0-specific guidance (e.g., using VM0 skills instead of raw API calls)
5. Include error handling and verification steps

**Template**:
```markdown
# {Project Name} Agent

You are an automation agent that performs the same tasks as the local Claude Code workflow.

## Your Mission

{High-level description of what the local workflow accomplishes}

## Available Skills (from local setup)

### Skill 1: {Skill Name}
**Purpose**: {What this skill does}

**How to use**:
{Step-by-step instructions in natural language}

**Commands**:
{Actual commands/scripts to run}

**Verification**:
{How to verify success}

### Skill 2: {Skill Name}
...

## Common Workflows

### Workflow 1: {Workflow Name}
When asked to {task description}, execute:
1. {Step 1}
2. {Step 2}
...

### Workflow 2: {Workflow Name}
...

## Environment Variables

{List all env vars needed}

## Error Handling

{How to handle errors}
```

### Step 6: Create Dockerfile with Dependencies

Generate `Dockerfile` at project root with all tools/dependencies:

**Choose base image based on skill's language**:
- Python skills → `python:3.11-slim`
- Node.js skills → `node:20-slim`
- Shell scripts → `ubuntu:22.04`
- Multi-language → `ubuntu:22.04` with multiple runtimes

```dockerfile
FROM {base-image}

WORKDIR /workspace

# Install system dependencies
RUN apt-get update && apt-get install -y \
    bash curl jq git \
    {additional-tools} \
    && rm -rf /var/lib/apt/lists/*

# Install language-specific dependencies
COPY requirements.txt* ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy scripts and helper files (if any)
COPY scripts/ ./scripts/ 2>/dev/null || true
COPY SKILL.md ./

# Create any necessary directories
RUN mkdir -p ~/reports

CMD ["/bin/bash"]
```

**Also create `.dockerignore`**:
```
.git
.gitignore
*.md
README.md
.env*
vm0.yaml
__pycache__
*.pyc
.pytest_cache
*.log
.DS_Store
reports/
```

---

## Complete Real Example: world-news-summary

This is a real migration case showing exactly how to convert a local Claude Code skill to VM0.

### Original Local Skill

**Location**: `~/.claude/skills/world-news-summary/SKILL.md`

**What it does**: Generates daily world news summaries with bilingual content and publishes to Notion automatically.

**Key features**:
- Searches web for latest news (AI/Agent products, international affairs, business)
- Fetches full article content
- Generates bilingual summaries
- Publishes structured reports to Notion database

**Required environment variables**:
- `CLAUDE_CODE_OAUTH_TOKEN`
- `NOTION_API_KEY` / `NOTION_TOKEN`
- `DATABASE_ID`

### Generated VM0 Configuration

**Project structure**:
```
~/Desktop/world-news-summary/
├── vm0.yaml              # VM0 configuration
├── AGENTS.md             # Agent instructions (converted from SKILL.md)
├── Dockerfile            # Container definition
├── .dockerignore         # Docker build exclusions
├── .env                  # Local environment variables (for testing)
└── README.md            # Migration documentation
```

**`vm0.yaml`**:
```yaml
version: "1.0"

agents:
  world-news-summary:
    provider: claude-code
    instructions: AGENTS.md

    # VM0 skills for Notion integration
    skills:
      - https://github.com/vm0-ai/vm0-skills/tree/main/notion

    environment:
      # Claude Code OAuth token
      CLAUDE_CODE_OAUTH_TOKEN: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}

      # Notion credentials (skill uses NOTION_API_KEY)
      NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
      NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
      DATABASE_ID: ${{ secrets.DATABASE_ID }}

      # Optional: News categories to cover
      NEWS_CATEGORIES: ${{ vars.NEWS_CATEGORIES }}
```

**`AGENTS.md`** (excerpt - showing key sections):
```markdown
# World News Summary Agent

You are an intelligent news aggregation and reporting agent that generates
comprehensive daily world news summaries and publishes them to Notion.

## Your Mission

Automatically gather the latest world news from reliable sources, create
bilingual summaries organized by category, and publish structured reports
to a Notion database. Focus particularly on AI and Agent product developments.

## Workflow: Daily News Generation

When triggered (typically daily at 8:00 AM), execute the following workflow:

### Step 1: Gather News from Multiple Sources

**Objective**: Collect latest news articles from diverse, reliable sources.

**Sources to query**:
- **International News**: Reuters, BBC, CNN, Bloomberg
- **Tech News**: TechCrunch, The Verge, Ars Technica
- **AI/ML News**: Anthropic blog, OpenAI blog, Google AI blog
- **Agent Ecosystem**: LangChain blog, AI agent product announcements

**How to execute**:
1. Use WebSearch tool to find latest breaking news for each category
2. Use WebFetch tool to retrieve full article content from key stories
3. Focus on news from the last 24 hours
4. Prioritize stories with significant impact or novelty

### Step 2: Categorize and Extract Key Information

**Categories** (in priority order):
1. 🤖 AI & Agent Products (HIGHEST PRIORITY)
2. 🌍 International Affairs
3. 💼 Business & Economy

**For each story, extract**:
- Headline (original language)
- Brief summary (2-3 sentences)
- Source name and URL
- Publication timestamp

### Step 3: Generate Bilingual Summaries

**Format for each story**:
- Headline in both languages
- Summary in both languages
- Source link and timestamp

### Step 4: Structure the Report

**Report structure**:
- Title: World News Daily - [YYYY-MM-DD]
- Sections by category
- Quick facts summary
- Sources list

### Step 5: Publish to Notion

**IMPORTANT: Use the Notion skill's simple commands instead of raw API calls**

[Detailed instructions on Notion API format and error handling...]

## Error Handling

- If news fetching fails: Retry with alternative source
- If Notion API fails: Save report locally to ~/reports/
- Minimum requirement: At least 10 total stories to publish

## Success Criteria

✅ At least 10 news stories collected across all categories
✅ All stories have bilingual summaries
✅ Successfully published to Notion database
```

**`Dockerfile`**:
```dockerfile
FROM python:3.11-slim

WORKDIR /workspace

# Install system dependencies
RUN apt-get update && apt-get install -y \
    bash curl jq git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy scripts and helper files (if any)
COPY scripts/ ./scripts/ 2>/dev/null || true
COPY SKILL.md ./

# Create necessary directories
RUN mkdir -p ~/reports

CMD ["/bin/bash"]
```

**`.env`** (for local testing):
```bash
CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat01-...
NOTION_API_KEY=ntn_...
NOTION_TOKEN=ntn_...
DATABASE_ID=2e80e96f...
NEWS_CATEGORIES=ai_agents,international,business
```

### Testing the Migration

```bash
# Navigate to project directory
cd ~/Desktop/world-news-summary

# Load environment variables
source .env

# Test with VM0
vm0 cook --yes "Generate today's news report"

# Check logs
vm0 logs

# View the Notion page created
```

### Results

✅ **Migration successful!**
- Agent collected 19 news stories (6 AI, 6 international, 7 business)
- Generated bilingual summaries for all stories
- Successfully published to Notion: [View Page](https://www.notion.so/World-News-Daily-2026-01-15-...)
- Completed in ~5 minutes
- Cost: $1.51

---

## Migration Process

When user asks to migrate their local workflow, follow these steps:

### 1. Identify the Skill

**Ask the user**:
```
I'll help migrate your local Claude Code skill to VM0!

Questions:
1. Which skill do you want to migrate? (skill name)
2. Is it located in ~/.claude/skills/{skill-name}/?
3. Where should I create the VM0 project? (default: ~/Desktop/{skill-name}/)
```

### 2. Read and Analyze

**Read the skill definition**:
```bash
# Read the skill's SKILL.md
cat ~/.claude/skills/{skill-name}/SKILL.md

# Check for any helper scripts
ls -la ~/.claude/skills/{skill-name}/

# Check if there are local dependencies
cat ~/.claude/skills/{skill-name}/requirements.txt 2>/dev/null
cat ~/.claude/skills/{skill-name}/package.json 2>/dev/null
```

**Analyze and understand**:
- What is the skill's purpose?
- What tools/APIs does it use? (Notion, GitHub, Slack, etc.)
- What are the workflow steps?
- What environment variables are needed?
- What language/runtime is required?

### 3. Auto-Detect Environment Variables

**Automatically detect from multiple sources**:
```bash
# Check skill's .env file
cat ~/.claude/skills/{skill-name}/.env 2>/dev/null

# Parse SKILL.md for environment variable mentions
grep -E '\$\{?[A-Z_]+\}?|NOTION_|DATABASE_|API_|TOKEN|SECRET' ~/.claude/skills/{skill-name}/SKILL.md

# Read from current shell environment
env | grep -E 'NOTION_|DATABASE_|API_|CLAUDE_|TOKEN'
```

**Present detected values to user**:
```
I detected these environment variables:

✓ CLAUDE_CODE_OAUTH_TOKEN: sk-ant-oat01-... (from environment)
✓ NOTION_API_KEY: ntn_F391... (from ~/.claude/skills/{skill-name}/.env)
✓ DATABASE_ID: 2e80e96f... (from .env)

Use these values? (y/n)
```

**Only ask for values that couldn't be detected or if user declines.**

### 4. Generate VM0 Configuration

**Create project directory**:
```bash
mkdir -p ~/Desktop/{skill-name}
cd ~/Desktop/{skill-name}
```

**Generate files** (using auto-detected environment variables):
1. `vm0.yaml` - Agent configuration with correct format
2. `AGENTS.md` - Translate SKILL.md into agent instructions
3. `Dockerfile` - Container with all dependencies
4. `.dockerignore` - Exclude unnecessary files
5. `.env` - **Auto-populated** with detected environment variables
6. `README.md` - Migration documentation
7. `requirements.txt` or `package.json` - If needed

### 5. Test the Migration

**Test locally first**:
```bash
cd ~/Desktop/{skill-name}

# Load environment variables
source .env

# Test with VM0
vm0 cook --yes "{test command}"

# Check logs
vm0 logs
```

**If test succeeds**:
- ✅ Confirm the agent works as expected
- ✅ Verify output matches local skill behavior
- ✅ Check that all features work

**If test fails**:
- Read error messages carefully
- Fix AGENTS.md instructions if needed
- Add missing dependencies to Dockerfile
- Verify environment variables are correct (check .env file)
- Retry until it works

### 6. Finalize and Document

**Create deployment instructions**:
```
✅ Migration complete!

Your VM0 agent is ready. Here's how to use it:

1. Deploy to VM0 cloud:
   vm0 cook

2. Run your workflow:
   vm0 run "{trigger phrase}"

3. View logs:
   vm0 logs

Files created:
- vm0.yaml: Agent configuration
- AGENTS.md: Agent instructions
- Dockerfile: Container definition
- .env: Environment variables (local only)
- README.md: Documentation

Next steps:
- Set secrets in VM0 dashboard for production use
- Schedule periodic runs if needed
- Monitor agent performance
```

---

## Tips for Good Migrations

### 1. Understand the Workflow First
- **Read SKILL.md carefully** - Understand what the skill does before converting
- **Identify dependencies** - What tools, APIs, languages are used?
- **Auto-detect environment variables** - Check skill's .env, parse SKILL.md, read shell env
- **Preserve the logic** - Don't change how the workflow works, just migrate it

### 2. Environment Variable Detection
- **Check multiple sources**: skill's .env file, SKILL.md content, current shell environment
- **Mask sensitive values** when displaying (e.g., `sk-ant-oat01-...` instead of full token)
- **Ask for confirmation** before using detected values
- **Only prompt** for values that couldn't be auto-detected
- **Generate .env automatically** with detected values for local testing

### 3. Use Correct File Structure
- ✅ `vm0.yaml` at project root (NOT `.vm0/vm0.yaml`)
- ✅ `AGENTS.md` at project root (NOT `.vm0/AGENTS.md`)
- ✅ `Dockerfile` at project root
- ✅ Use `agents:` structure in vm0.yaml
- ✅ Use `instructions: AGENTS.md` (relative path)

### 4. Leverage VM0 Skills
Instead of raw API calls, use VM0 skills when available:
- Notion API → Use `https://github.com/vm0-ai/vm0-skills/tree/main/notion`
- GitHub API → Use `https://github.com/vm0-ai/vm0-skills/tree/main/github`
- Slack API → Use `https://github.com/vm0-ai/vm0-skills/tree/main/slack`

### 5. Test Before Declaring Success
- **Run the agent** with `vm0 cook --yes "test command"`
- **Verify output** matches the local skill's behavior
- **Check logs** for any errors or warnings
- **Iterate** until it works correctly

### 6. Document the Migration
- Create README.md explaining the migration
- Document environment variables and their purpose
- Include deployment instructions
- Note any differences from local behavior

---

## Common Migration Patterns

### Pattern 1: Daily Data Sync
**Local**: Skill that fetches data and syncs to Notion/database
**VM0**: Agent with data fetching → processing → uploading workflow
**Example**: world-news-summary (news aggregation + Notion sync)

### Pattern 2: API Monitoring
**Local**: Skill that checks API health and sends alerts
**VM0**: Agent that monitors endpoints and uses Slack skill for notifications

### Pattern 3: Content Generation
**Local**: Skill that generates reports, summaries, or content
**VM0**: Agent with content generation logic preserved in AGENTS.md

### Pattern 4: Multi-service Integration
**Local**: Skill that orchestrates multiple services (GitHub + Slack + Notion)
**VM0**: Agent that uses multiple VM0 skills for each service

---

## Troubleshooting

### Issue: "vm0.yaml format error"
**Solution**: Make sure you're using the correct format with `agents:` structure and `version: "1.0"` (quoted)

### Issue: "Notion API validation error"
**Solution**: Use VM0 Notion skill instead of raw API calls, or ensure JSON formatting is correct (no empty `annotations` objects)

### Issue: "Environment variable not found"
**Solution**:
- Check that all variables are defined in `environment:` section of vm0.yaml
- Verify .env file was auto-generated with correct values
- If auto-detection failed, manually check `~/.claude/skills/{skill-name}/.env`
- Use `source .env` before running `vm0 cook` for local testing

### Issue: "Auto-detection didn't find my environment variables"
**Solution**:
- Check if skill has a `.env` file in `~/.claude/skills/{skill-name}/`
- Verify environment variables are set in current shell: `echo $VARIABLE_NAME`
- Manually provide missing values when prompted
- Check SKILL.md for variable names that might have been missed

### Issue: "Dependency not found in container"
**Solution**: Add missing dependencies to Dockerfile (system packages or language packages)

### Issue: "Agent behavior differs from local skill"
**Solution**: Review AGENTS.md instructions - may need to preserve more details from original SKILL.md

---

## Key Differences: Local Skills vs VM0 Agents

| Aspect | Local Claude Code Skills | VM0 Agents |
|--------|-------------------------|------------|
| **Config file** | `SKILL.md` in `~/.claude/skills/` | `vm0.yaml` + `AGENTS.md` in project |
| **Invocation** | Runs locally with Claude Code | Runs in cloud sandbox |
| **Environment** | User's local machine | Docker container |
| **Dependencies** | User's installed tools | Must be in Dockerfile |
| **Secrets** | Local env vars or `.env` | VM0 secrets or `.env` (testing) |
| **APIs** | Direct API calls | Can use VM0 skills |
| **Execution** | `claude` CLI or IDE | `vm0 run` or `vm0 cook` |

---

## References

- [VM0 Documentation](https://vm0.ai/docs)
- [VM0 Skills Repository](https://github.com/vm0-ai/vm0-skills)
- [Claude Code Documentation](https://code.claude.com/docs)
- [VM0 CLI Reference](https://vm0.ai/docs/cli)
