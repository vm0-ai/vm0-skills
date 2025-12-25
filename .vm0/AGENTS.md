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
   - Create a `TODO.md` file to track testing progress

2. **Generate Todo List**
   - For each skill folder in the repo, add a todo item to `TODO.md`

3. **Test Each Skill**
   - Create a sub-agent for each skill to test
   - Each sub-agent should:
     - Verify all required environment variables exist
     - Test each example command in the skill's SKILL.md
     - Write a temporary test result markdown file
     - Record whether the test passed, and specifically note any shell command failures or jq parsing errors

4. **Summarize Results**
   - Aggregate all test results into `result.md`

5. **Update README**
   - Based on `result.md`, update the `README.md`
   - Update or insert a skill list section with:
     - Brief description of each skill's capabilities
     - Test status (passed/failed)

6. **Commit and Push**
   - Only commit `README.md`
   - Push to the repository using `GITHUB_TOKEN` for authentication

7. **Report Issues**
   - For skills with test failures, create a GitHub issue summarizing all problems

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
