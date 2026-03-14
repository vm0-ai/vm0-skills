#!/bin/bash
set -e

SKILLS_DIR="/tmp/vm0-skills"
cd "$SKILLS_DIR"

# Function to update a skill
update_skill() {
    local skill_dir="$1"
    local skill_name=$(basename "$skill_dir")
    local skill_file="$skill_dir/SKILL.md"

    if [[ ! -f "$skill_file" ]]; then
        return
    fi

    # Check if already updated
    if grep -q "/tmp/${skill_name}-curl" "$skill_file" 2>/dev/null && ! grep -q "bash -c.*curl" "$skill_file" 2>/dev/null; then
        echo "SKIP: $skill_name (already updated)"
        return
    fi

    # Check if needs update
    if ! grep -q "bash -c.*curl" "$skill_file" 2>/dev/null; then
        echo "SKIP: $skill_name (no bash -c pattern)"
        return
    fi

    echo "UPDATING: $skill_name"

    # Get token variable name from frontmatter or content
    local token_var=$(grep -oP '(?<=vm0_secrets:\s*\n\s*-\s)\w+' "$skill_file" | head -1)
    if [[ -z "$token_var" ]]; then
        token_var=$(grep -oP '\b\w+_TOKEN\b|\bAPI_KEY\b' "$skill_file" | head -1)
    fi
    if [[ -z "$token_var" ]]; then
        token_var="${skill_name^^}_TOKEN"
    fi

    # Determine auth header format
    local auth_header="Authorization: Bearer \${$token_var}"
    if grep -q "X-API-Key" "$skill_file" 2>/dev/null; then
        auth_header="X-API-Key: \${$token_var}"
    elif grep -q "api-key:" "$skill_file" 2>/dev/null; then
        auth_header="api-key: \${$token_var}"
    fi

    # Create wrapper script content
    local wrapper="### Setup API Wrapper

Create a helper script for API calls:

\`\`\`bash
cat > /tmp/${skill_name}-curl << 'EOF'
#!/bin/bash
curl -s -H \"Content-Type: application/json\" -H \"${auth_header}\" \"\$@\"
EOF
chmod +x /tmp/${skill_name}-curl
\`\`\`

**Usage:** All examples below use \`/tmp/${skill_name}-curl\` instead of direct \`curl\` calls."

    # Create temp file
    local temp_file=$(mktemp)

    # Read file and process
    awk -v wrapper="$wrapper" -v skill_name="$skill_name" '
    BEGIN { in_prereq = 0; added_wrapper = 0; }

    /^## Prerequisites/ { in_prereq = 1; }

    /^## [^#]/ && in_prereq && !added_wrapper && NR > 10 {
        print ""
        print wrapper
        print ""
        in_prereq = 0
        added_wrapper = 1
    }

    { print }

    END {
        if (in_prereq && !added_wrapper) {
            print ""
            print wrapper
        }
    }
    ' "$skill_file" > "$temp_file"

    # Replace bash -c patterns with wrapper
    # Pattern: bash -c 'curl -s ... [HEADERS] ...' | jq ...
    # Replace with: /tmp/skill-curl ... | jq ...

    sed -i.bak -E "s|bash -c 'curl -s (-X (GET|POST|PUT|PATCH|DELETE) )?\"([^\"]+)\"[^']*'|/tmp/${skill_name}-curl \1\"\3\"|g" "$temp_file"

    # Clean up remaining header flags (they are now in wrapper)
    sed -i.bak -E 's/(--header|-H) "[^"]+"\s*//g' "$temp_file"
    sed -i.bak -E 's/--header '\''[^'\'']+'\''\s*//g' "$temp_file"

    # Remove old Important warnings
    sed -i.bak '/^> \*\*Important:.*\$VAR/d' "$temp_file"
    sed -i.bak '/^> ```bash/,/^> ```/d' "$temp_file"
    sed -i.bak '/^> bash -c/d' "$temp_file"

    # Clean up empty lines at section boundaries
    sed -i.bak -E '/^$/N;/^\n$/d' "$temp_file"

    # Move temp file back
    mv "$temp_file" "$skill_file"
    rm -f "$temp_file.bak"

    echo "DONE: $skill_name"
}

# Main loop
for skill_dir in "$SKILLS_DIR"/*/; do
    update_skill "$skill_dir"
done

echo ""
echo "Batch update complete!"
