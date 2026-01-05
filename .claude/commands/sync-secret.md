---
name: sync-secret
description: Sync environment variables from a skill to vm0.yaml, GitHub workflow, and GitHub secrets
args:
  - name: env_vars
    description: Space-separated list of environment variable names to sync
    required: true
    rest: true
---

# Sync Secret Command

Synchronize environment variables from a skill to the VM0 configuration, GitHub workflow, and GitHub repository secrets.

## Usage

```bash
/sync-secret ENV_VAR1 ENV_VAR2 ...
```

## Example

```bash
/sync-secret LARK_APP_ID LARK_APP_SECRET
```

## What This Command Does

1. **Analyze the skill source**
   - Determine which skill the environment variables belong to by searching through `*/SKILL.md` files
   - Check the `vm0_secrets` and `vm0_vars` frontmatter in the skill's SKILL.md

2. **Classify variable types**
   - Determine if each variable is a `secret` (sensitive, from `vm0_secrets`) or `var` (non-sensitive, from `vm0_vars`)
   - Secrets are encrypted in GitHub, vars are stored as plaintext

3. **Update .vm0/vm0.yaml**
   - Add the environment variables to the `skills-tester-2` agent's `environment` section
   - Use the correct template syntax: `${{ secrets.VAR_NAME }}` or `${{ vars.VAR_NAME }}`
   - Maintain alphabetical order within secrets and vars groups

4. **Update .github/workflows/daily-test.yml**
   - Add the variables to the `secrets:` or `vars:` section of the workflow
   - Use proper YAML multiline syntax with the `|` operator
   - Maintain alphabetical order

5. **Sync to GitHub**
   - Read values from `~/.env.local`
   - Use `gh secret set` for secrets: `gh secret set VAR_NAME -b"value"`
   - Use `gh variable set` for vars: `gh variable set VAR_NAME -b"value"`
   - Verify the sync was successful

## Prerequisites

- `~/.env.local` must contain the environment variables with their values
- GitHub CLI (`gh`) must be installed and authenticated
- Proper repository permissions to set secrets and variables

## Error Handling

The command should handle these cases:
- Variable not found in any skill → Show error with list of searched skills
- Variable not found in `~/.env.local` → Show error and skip
- Multiple skills claim the same variable → Show warning and ask user to specify
- GitHub CLI not authenticated → Show error with authentication instructions
- Permission denied → Show error about repository access

## Output Example

```
Analyzing environment variables...
✓ LARK_APP_ID found in skill: lark (type: vars)
✓ LARK_APP_SECRET found in skill: lark (type: secrets)

Updating .vm0/vm0.yaml...
✓ Added LARK_APP_ID to environment section
✓ Added LARK_APP_SECRET to environment section

Updating .github/workflows/daily-test.yml...
✓ Added LARK_APP_ID to vars section (line 85)
✓ Added LARK_APP_SECRET to secrets section (line 56)

Syncing to GitHub repository...
✓ Set GitHub variable: LARK_APP_ID
✓ Set GitHub secret: LARK_APP_SECRET

Done! Environment variables synced successfully.
```

## Implementation Notes

1. **Skill detection**: Search for the variable name in all `*/SKILL.md` files' frontmatter
   ```bash
   grep -l "LARK_APP_ID" */SKILL.md
   ```

2. **Determine type**: Check if it's under `vm0_secrets` or `vm0_vars`
   ```bash
   # Extract frontmatter and check which section contains the variable
   ```

3. **Update vm0.yaml**: Insert in alphabetical order
   ```yaml
   environment:
     LARK_APP_ID: ${{ vars.LARK_APP_ID }}
     LARK_APP_SECRET: ${{ secrets.LARK_APP_SECRET }}
   ```

4. **Update workflow**: Insert in correct section
   ```yaml
   secrets: |
     LARK_APP_SECRET=${{ secrets.LARK_APP_SECRET }}
   vars: |
     LARK_APP_ID=${{ vars.LARK_APP_ID }}
   ```

5. **Sync to GitHub**:
   ```bash
   source ~/.env.local
   gh variable set LARK_APP_ID -b"${LARK_APP_ID}"
   gh secret set LARK_APP_SECRET -b"${LARK_APP_SECRET}"
   ```

## Tips

- Run this command after adding a new skill with environment variables
- Always verify the changes in `git diff` before committing
- Test the workflow after syncing to ensure the variables are accessible
- Use `gh secret list` and `gh variable list` to verify the sync

## Related Commands

- `gh secret list` - List all repository secrets
- `gh variable list` - List all repository variables
- `gh secret set NAME` - Set a repository secret
- `gh variable set NAME` - Set a repository variable
