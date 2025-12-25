# Skills Tester Agent

## Overview

This agent performs automated testing of all skills in the vm0-skills repository.

## Critical Requirements

**MANDATORY: Complete All Tests Without Exception**

- No matter how long the task takes, it MUST be completed in full
- Continue until ALL items in `TODO.md` are tested - no early termination
- **NO skipping tasks** - every skill must be tested
- **NO selective testing** - do not cherry-pick which skills to test
- **Every example MUST have a result** - each example command in every skill's SKILL.md must be executed and recorded
- If a test fails, record the failure and continue to the next test
- Do not stop or pause until the entire test suite is complete

## Instructions

1. **Clone and Initialize**
   - Clone the repo `vm0-ai/vm0-skills`
   - Create a `TODO.md` file  in /tmp directory to track testing progress

2. **Generate Todo List**
   - For each skill folder in the repo, add a todo item to `TODO.md`

3. **Test Each Skill**
   - Create a sub-agent for each skill to test
   - Each sub-agent should:
     - Verify all required environment variables exist
     - Test each example command in the skill's SKILL.md
     - Write a temporary test result markdown file in /tmp directory
     - Record whether the test passed, and specifically note any shell command failures or jq parsing errors
   - **For Slack/Discord skills:** Use `bot-test` channel for all message sending tests to avoid spamming production channels

4. **Summarize Results**
   - Aggregate all test results into a `result.md` in /tmp directory
   - **Note:** Process documents like `result.md`, `TODO.md`, and temporary test files will NOT be committed

5. **Update README**
   - Based on `result.md`, update the `README.md`
   - Update or insert a skill list section with:
     - Brief description of each skill's capabilities
     - Test status (passed/failed)

6. **Commit and Push**
   - Only commit `README.md`
   - Push to the repository using `GITHUB_TOKEN` for authentication

7. **Report Issues (IMPORTANT)**
   - Create a GitHub issue with **detailed** test results - not just a summary
   - The issue MUST include for each failing skill:
     - Skill name
     - Environment variables status (present/missing)
     - Each failing API example with:
       - The exact command that was tested
       - The error response or failure reason
       - HTTP status code if applicable
     - Root cause analysis (e.g., "missing token", "API endpoint changed", "permission denied")
   - Group failures by category (missing env vars, API errors, permission issues, etc.)
   - This detailed report is critical because process documents are not committed

8. **Notify Slack**
   - Post a message to Slack channel `#dev` with:
     - Total number of skills
     - Number of passed tests
     - Number of failed tests
     - Brief summary of issues
     - Link to the GitHub issue (if created)

9. **Notify Discord**
   - Post a message to the Discord `skills` channel with:
     - Confirmation that routine testing is complete
     - Number of skills that passed
     - Total number of skills tested
