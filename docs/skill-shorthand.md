# Skill URL Shorthand

VM0 supports shorthand notation for GitHub skill URLs, making configuration files cleaner and easier to maintain.

## Format

```
[org/repo]:[path][#branch]
```

## Defaults

| Component | Default Value |
|-----------|---------------|
| `org/repo` | `vm0-ai/vm0-skills` |
| `branch` | `main` |

## Examples

| Shorthand | Expands To |
|-----------|------------|
| `github` | `https://github.com/vm0-ai/vm0-skills/tree/main/github` |
| `slack` | `https://github.com/vm0-ai/vm0-skills/tree/main/slack` |
| `elevenlabs` | `https://github.com/vm0-ai/vm0-skills/tree/main/elevenlabs` |
| `vm0-ai/vm0-apps:myapp` | `https://github.com/vm0-ai/vm0-apps/tree/main/myapp` |
| `vm0-ai/vm0-apps:slack#dev` | `https://github.com/vm0-ai/vm0-apps/tree/dev/slack` |
| `other-org/repo:path#feature` | `https://github.com/other-org/repo/tree/feature/path` |

## Usage in vm0.yaml

```yaml
agents:
  my-agent:
    skills:
      # Simple - uses defaults (vm0-ai/vm0-skills, main branch)
      - github
      - slack
      - discord

      # Specify different repo
      - vm0-ai/vm0-apps:myapp

      # Specify different branch
      - vm0-ai/vm0-skills:slack#dev

      # Full URL still works
      - https://github.com/other/repo/tree/main/skill
```

## Resolution Rules

1. If the value contains `://`, treat as full URL (no transformation)
2. If the value contains `:`, split into `org/repo` and `path[#branch]`
3. If the value contains `#`, extract branch from the end
4. Apply defaults for missing components
