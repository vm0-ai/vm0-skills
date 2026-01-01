# SKILL.md Bad Smells

Common anti-patterns to avoid when writing SKILL.md documentation.

---

## 1. Environment Variables with Pipes (Claude Code Bug)

**Problem:** Using `$VAR` in commands with pipes triggers a Claude Code variable substitution bug where environment variables get silently cleared.

### ❌ Bad Case

```bash
curl -H "Authorization: Bearer ${API_TOKEN}" https://api.example.com | jq '.[0]'
```

**Issue:** The environment variable `${API_TOKEN}` will be cleared when the pipe is processed, causing authentication to fail silently.

### ✅ Good Case

```bash
bash -c 'curl -H "Authorization: Bearer ${API_TOKEN}" https://api.example.com' | jq .
```

**Solution:** Wrap the command containing `$VAR` in `bash -c '...'`, keeping the pipe **outside** the wrapper. This ensures the variable is properly substituted before the pipe processes the output.

---

## 2. Useless `| jq .`

**Problem:** Using `| jq .` without any transformation only formats JSON but adds no value, making commands unnecessarily complex.

### ❌ Bad Case

```bash
bash -c 'curl -s -X POST "https://api.example.com/data" -H "Content-Type: application/json" -d @/tmp/request.json' | jq .
```

**Issue:** The `| jq .` only pretty-prints the JSON without extracting or transforming any data.

### ✅ Good Case

**Option 1: Remove jq entirely**
```bash
bash -c 'curl -s -X POST "https://api.example.com/data" -H "Content-Type: application/json" -d @/tmp/request.json'
```

**Option 2: Use jq for actual transformation**
```bash
bash -c 'curl -s -X POST "https://api.example.com/data" -H "Content-Type: application/json" -d @/tmp/request.json' | jq '.data.items[] | {id, name}'
```

**When to keep jq:**
- ✅ Extracting specific fields: `| jq '.data.id'`
- ✅ Transforming structure: `| jq '.items[] | {name: .title}'`
- ✅ Filtering: `| jq '.[] | select(.active == true)'`
- ❌ Just formatting: `| jq .` (remove it)

---

## 3. Inline JSON in curl Commands

**Problem:** Constructing complex JSON directly in curl commands leads to escaping hell and makes examples hard to read and maintain.

### ❌ Bad Case

```bash
curl -X POST "https://api.example.com/sessions" -H "Content-Type: application/json" -d "{\"projectId\": \"${PROJECT_ID}\", \"browserSettings\": {\"context\": {\"id\": \"${CONTEXT_ID}\", \"persist\": true}}}"
```

**Issues:**
- Complex quote escaping: `\"`
- Hard to read nested JSON
- Difficult to maintain
- Error-prone when copying

### ✅ Good Case

**Write to file and reference it in curl**

Write to `/tmp/request.json`:

```json
{
  "projectId": "your-project-id",
  "browserSettings": {
    "context": {
      "id": "<your-context-id>",
      "persist": true
    }
  }
}
```

```bash
curl -X POST "https://api.example.com/sessions" -H "Content-Type: application/json" -d @/tmp/request.json
```

**Benefits:**
- ✅ Clean, readable JSON
- ✅ No escaping issues
- ✅ Easy to modify
- ✅ Works with any content (JSON, JS, form data)

**Alternative for URL-encoded data:**
```bash
# Write query.txt with: user_metadata['env']:'production'
curl -G "https://api.example.com/sessions" --data-urlencode "q@/tmp/query.txt"
```

---

## 4. Using $VAR for URL Parameters

**Problem:** Using shell variables like `$CONTEXT_ID` in URLs creates dependency on unstable variable expansion and makes examples harder to follow.

### When to Use `${VAR}` vs `<placeholder>`

| Type | Format | Example | Keep as Variable? |
|------|--------|---------|-------------------|
| **Prerequisites env vars** | `${VAR}` | `${API_KEY}`, `${API_TOKEN}`, `${DOMAIN}` | ✅ Yes |
| **Dynamic values from API** | `<placeholder>` | `<context-id>`, `<session-id>`, `<item-id>` | ❌ No, use placeholder |

**Keep as `${VAR}`** — Environment variables defined in the Prerequisites section:
- API tokens/keys: `${API_KEY}`, `${API_TOKEN}`, `${ACCESS_TOKEN}`
- Base URLs/domains: `${API_HOST}`, `${DOMAIN}`, `${BASE_URL}`
- Account identifiers: `${ACCOUNT_ID}`, `${ORG_ID}` (when set in Prerequisites)
- Credentials: `${EMAIL}`, `${USERNAME}` (when set in Prerequisites)

**Use `<placeholder>`** — Dynamic values obtained from previous API responses:
- Resource IDs: `<context-id>`, `<session-id>`, `<project-id>`
- Temporary tokens: `<upload-token>`, `<refresh-token>`
- User-specific values: `<your-item-id>`, `<your-file-key>`
- Any value returned from a previous API call that the user needs to copy

### ❌ Bad Case

**Example 1: Save Parameter**
```bash
CONTEXT_ID=$(curl -X POST "https://api.example.com/contexts" -H "X-API-Key: ${API_KEY}" -d '{"projectId": "proj123"}' | jq -r '.id')
```

**Example 2: Use Parameter**
```bash
curl -X POST "https://api.example.com/sessions" -H "X-API-Key: ${API_KEY}" -d "{\"contextId\": \"${CONTEXT_ID}\"}"
```

**Example 3: Use Parameter**
```bash
DATASET_ID="gd_xxxxx"

bash -c 'curl -s -X POST "https://api.brightdata.com/datasets/v3/trigger?dataset_id=${DATASET_ID}" \
  -H "Authorization: Bearer ${BRIGHTDATA_API_KEY}" \
  -H "Content-Type: application/json" \
  -d @/tmp/brightdata_request.json'
```

**Issues:**
- Requires setting shell variable between examples
- Variable expansion can fail
- Examples become interdependent
- Users must understand shell variable mechanics

### ✅ Good Case

**Example 1: Create context**
```bash
curl -X POST "https://api.example.com/contexts" -H "X-API-Key: ${API_KEY}" -d @/tmp/request.json
```

**Example 2: Use context**
Replace `<your-context-id>` with the actual context ID from the previous response:

```
{
    "id": "<your-context-id>",
}
```

```bash
curl -X POST "https://api.example.com/sessions" -H "X-API-Key: ${API_KEY}" -d @/tmp/request.json
```

Or more explicitly:

```bash
curl -X DELETE "https://api.example.com/contexts/<your-context-id>" -H "X-API-Key: ${API_KEY}"
```

**Example 3: Use Parameter**

Replace `<dataset-id>` with the actual dataset id.

```bash

bash -c 'curl -s -X POST "https://api.brightdata.com/datasets/v3/trigger?dataset_id=<dataset-id>" \
  -H "Authorization: Bearer ${BRIGHTDATA_API_KEY}" \
  -H "Content-Type: application/json" \
  -d @/tmp/brightdata_request.json'
```

**Documentation Pattern:**
Use clear placeholder text and instructions:

```markdown
### Delete Context

Delete a context when no longer needed. Replace `your-context-id` with the actual context ID:

```bash
curl -X DELETE "https://api.example.com/contexts/your-context-id" -H "X-API-Key: ${API_KEY}"
```

**Benefits:**
- ✅ Clear, self-contained examples
- ✅ No shell variable dependencies
- ✅ Easier for AI agents to parse and execute
- ✅ Works in any context

---

## Quick Checklist

When writing SKILL.md, verify:

- [ ] All commands with `$VAR` and `|` use `bash -c '...' | command` pattern
- [ ] Remove `| jq .` unless doing actual transformation
- [ ] Use `/tmp/file` with `-d @/tmp/file` instead of inline JSON/data
- [ ] Use placeholder text (`<your-context-id>`) instead of shell variables (`$CONTEXT_ID`) in URLs
- [ ] Include the "Important" warning about `$VAR` and pipes in Prerequisites section
