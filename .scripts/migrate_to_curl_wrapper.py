#!/usr/bin/env python3
"""
Migrate skills from bash -c pattern to /tmp/xxx-curl wrapper pattern.
"""

import re
import os
import sys
from pathlib import Path

def extract_skill_info(content):
    """Extract skill name and token from frontmatter."""
    # Try to get token from vm0_secrets
    token_match = re.search(r'vm0_secrets:\s*\n((?:\s*-\s*\w+\s*\n?)+)', content)
    if token_match:
        tokens = re.findall(r'-\s*(\w+)', token_match.group(1))
        return tokens[0] if tokens else None
    return None

def get_auth_header(content, token_var):
    """Determine the auth header format used in the skill."""
    # Check for X-API-Key pattern
    if re.search(r'X-API-Key[:\s]', content):
        return f'"X-API-Key: ${token_var}"'
    if re.search(r'api-key[:\s]', content, re.IGNORECASE):
        return f'"api-key: ${token_var}"'
    # Default to Bearer
    return f'"Authorization: Bearer ${token_var}"'

def create_wrapper_script(skill_name, auth_header):
    """Create the wrapper script section."""
    return f"""### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/{skill_name}-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H {auth_header} "$@"
EOF
chmod +x /tmp/{skill_name}-curl
```

**Usage:** All examples below use `/tmp/{skill_name}-curl` instead of direct `curl` calls.
"""

def replace_bash_c_patterns(content, skill_name):
    """Replace bash -c curl patterns with wrapper."""

    # Pattern 1: bash -c 'curl -s -X METHOD "URL" --header ... ' | jq ...
    # Replace with: /tmp/skill-curl -X METHOD "URL" | jq ...

    def replacer(match):
        # Get the full curl command inside bash -c
        inner = match.group(1)

        # Extract method
        method_match = re.search(r'-X\s+(\w+)', inner)
        method = f'-X {method_match.group(1)}' if method_match else ''

        # Extract URL
        url_match = re.search(r'"(https?://[^"]+)"', inner)
        url = url_match.group(1) if url_match else 'https://api.example.com'

        # Extract -d @file
        data_match = re.search(r'-d\s+(@/tmp/\S+)', inner)
        data = f'-d {data_match.group(1)}' if data_match else ''

        # Build new command
        parts = [f'/tmp/{skill_name}-curl']
        if method:
            parts.append(method)
        parts.append(f'"{url}"')
        if data:
            parts.append(data)

        return ' '.join(parts)

    # Replace patterns
    content = re.sub(
        r"bash -c 'curl -s ([^']+)'",
        replacer,
        content
    )

    return content

def process_skill(skill_path):
    """Process a single skill file."""
    skill_name = skill_path.parent.name

    with open(skill_path, 'r') as f:
        content = f.read()

    # Check if already updated
    if f'/tmp/{skill_name}-curl' in content and 'bash -c' not in content:
        print(f"SKIP: {skill_name} (already updated)")
        return False

    if 'bash -c' not in content:
        print(f"SKIP: {skill_name} (no bash -c pattern)")
        return False

    print(f"PROCESSING: {skill_name}")

    # Get token variable
    token_var = extract_skill_info(content)
    if not token_var:
        # Try to infer from content
        token_match = re.search(r'\b(\w+_TOKEN|\w+_API_KEY)\b', content)
        if token_match:
            token_var = token_match.group(1)
        else:
            token_var = f'{skill_name.upper().replace("-", "_")}_TOKEN'

    # Get auth header format
    auth_header = get_auth_header(content, token_var)

    # Find Prerequisites section and add wrapper
    wrapper = create_wrapper_script(skill_name, auth_header)

    # Remove old Important warning blocks
    content = re.sub(r'> \*\*Important:.*?\n(> .*?\n)*', '', content, flags=re.DOTALL)
    content = re.sub(r'> \*\*When using \$VAR.*?\n(> .*?\n)*', '', content, flags=re.DOTALL)

    # Insert wrapper after Prerequisites section
    prereq_match = re.search(r'(## Prerequisites\s*\n.*?)(## [^#])', content, re.DOTALL)
    if prereq_match:
        prereq_end = prereq_match.end(1)
        content = content[:prereq_end] + '\n' + wrapper + '\n' + content[prereq_end:]
    else:
        # Try to find where to insert
        first_section = re.search(r'## (Prerequisites|When to Use|Authentication)', content)
        if first_section:
            insert_pos = first_section.end()
            content = content[:insert_pos] + '\n\n' + wrapper + '\n' + content[insert_pos:]

    # Replace bash -c patterns
    content = replace_bash_c_patterns(content, skill_name)

    # Clean up any remaining --header/-H flags (they're now in wrapper)
    # But be careful to only remove from curl commands, not from wrapper itself
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        # Skip if this is the wrapper script line
        if 'cat > /tmp/' in line or 'curl -s -H' in line and 'EOF' in ''.join(lines[max(0, len(new_lines)-5):len(new_lines)]):
            new_lines.append(line)
            continue

        # Remove --header/-H flags from example commands
        if line.startswith('```') or line.startswith('/tmp/'):
            line = re.sub(r'(--header|-H)\s+"[^"]+"\s*', '', line)
            line = re.sub(r"(--header|-H)\s+'[^']+'\s*", '', line)

        new_lines.append(line)

    content = '\n'.join(new_lines)

    # Clean up extra blank lines
    content = re.sub(r'\n{4,}', '\n\n\n', content)

    with open(skill_path, 'w') as f:
        f.write(content)

    print(f"DONE: {skill_name}")
    return True

def main():
    skills_dir = Path('/tmp/vm0-skills')

    # Find all SKILL.md files
    skill_files = list(skills_dir.glob('*/SKILL.md'))

    updated = 0
    skipped = 0

    for skill_path in sorted(skill_files):
        try:
            if process_skill(skill_path):
                updated += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"ERROR: {skill_path.parent.name} - {e}")
            skipped += 1

    print(f"\n{'='*60}")
    print(f"Total: {updated} updated, {skipped} skipped")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
