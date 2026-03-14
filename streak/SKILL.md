---
name: streak
description: Streak CRM API for Gmail. Use when user mentions "Streak", "Gmail CRM",
  "email CRM", or pipeline in Gmail.
vm0_secrets:
  - STREAK_TOKEN
---

# Streak CRM

Streak is a CRM built entirely inside Gmail. Use this skill to manage pipelines, boxes (deals), contacts, organizations, tasks, and email threads via the Streak API.

> Official docs: `https://streak.readme.io/reference`

---

## When to Use

Use this skill when you need to:

- Manage sales pipelines and deal stages
- Track leads, contacts, and organizations
- Associate email threads with deals
- Create tasks and comments on deals
- Search across boxes, contacts, and organizations

---

## Prerequisites

1. Install the Streak extension in Gmail
2. Navigate to Gmail > Streak icon > Integrations > Streak API > Create New Key
3. Copy your API key

Set environment variable:

```bash
export STREAK_TOKEN="your-api-key"
```

---


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/streak-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $STREAK_TOKEN" "$@"
EOF
chmod +x /tmp/streak-curl
```

**Usage:** All examples below use `/tmp/streak-curl` instead of direct `curl` calls.

## How to Use

### Authentication

Streak uses HTTP Basic Auth with your API key as the username and no password. In curl, use `-u ${STREAK_TOKEN}:` (note the trailing colon).

---

### 1. Get Current User

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/users/me"
```

---

### 2. List All Pipelines

Pipelines represent business processes (Sales, Hiring, Projects, etc.).

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/pipelines"
```

---

### 3. Get a Pipeline

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/pipelines/{pipelineKey}"
```

---

### 4. Create a Pipeline

Write to `/tmp/streak_request.json`:

```json
{
  "name": "New Sales Pipeline"
}
```

Then run:

```bash
/tmp/streak-curl -X PUT "https://api.streak.com/api/v1/pipelines" -d @/tmp/streak_request.json
```

---

### 5. List Boxes in Pipeline

Boxes are the core data objects (deals, leads, projects) within a pipeline.

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/pipelines/{pipelineKey}/boxes"
```

---

### 6. Get a Box

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/boxes/{boxKey}"
```

---

### 7. Create a Box

Write to `/tmp/streak_request.json`:

```json
{
  "name": "Acme Corp Deal"
}
```

Then run:

```bash
/tmp/streak-curl -X POST "https://api.streak.com/api/v1/pipelines/{pipelineKey}/boxes" -d @/tmp/streak_request.json
```

---

### 8. Update a Box

Write to `/tmp/streak_request.json`:

```json
{
  "name": "Updated Deal Name",
  "stageKey": "stageKey123"
}
```

Then run:

```bash
/tmp/streak-curl -X POST "https://api.streak.com/api/v1/boxes/{boxKey}" -d @/tmp/streak_request.json
```

---

### 9. List Stages in Pipeline

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/pipelines/{pipelineKey}/stages"
```

---

### 10. List Fields in Pipeline

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/pipelines/{pipelineKey}/fields"
```

---

### 11. Get a Contact

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/contacts/{contactKey}"
```

---

### 12. Create a Contact

Write to `/tmp/streak_request.json`:

```json
{
  "teamKey": "teamKey123",
  "emailAddresses": ["john@example.com"],
  "givenName": "John",
  "familyName": "Doe"
}
```

Then run:

```bash
/tmp/streak-curl -X POST "https://api.streak.com/api/v1/contacts" -d @/tmp/streak_request.json
```

---

### 13. Get an Organization

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/organizations/{organizationKey}"
```

---

### 14. Search Boxes, Contacts, and Organizations

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/search?query=acme"
```

---

### 15. Get Tasks in a Box

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/tasks"
```

---

### 16. Create a Task

Write to `/tmp/streak_request.json`:

```json
{
  "text": "Follow up with client",
  "dueDate": 1735689600000
}
```

Then run:

```bash
/tmp/streak-curl -X POST "https://api.streak.com/api/v1/boxes/{boxKey}/tasks" -d @/tmp/streak_request.json
```

---

### 17. Get Comments in a Box

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/comments"
```

---

### 18. Create a Comment

Write to `/tmp/streak_request.json`:

```json
{
  "message": "Spoke with client today, they are interested."
}
```

Then run:

```bash
/tmp/streak-curl -X POST "https://api.streak.com/api/v1/boxes/{boxKey}/comments" -d @/tmp/streak_request.json
```

---

### 19. Get Threads in a Box

Email threads associated with a box.

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/threads"
```

---

### 20. Get Files in a Box

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/files"
```

---

### 21. Get Meetings in a Box

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/meetings"
```

---

### 22. Create a Meeting Note

Write to `/tmp/streak_request.json`:

```json
{
  "meetingDate": 1735689600000,
  "meetingNotes": "Discussed pricing and timeline.",
  "title": "Sales Call"
}
```

Then run:

```bash
/tmp/streak-curl -X POST "https://api.streak.com/api/v1/boxes/{boxKey}/meetings" -d @/tmp/streak_request.json
```

---

### 23. Get Box Timeline

```bash
/tmp/streak-curl -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/timeline"
```

---

## Guidelines

1. **Keys**: Pipeline keys, box keys, and other identifiers are alphanumeric strings returned by the API
2. **Timestamps**: Use Unix timestamps in milliseconds for date fields (e.g., `dueDate`, `meetingDate`)
3. **Rate Limits**: Be mindful of API rate limits; add delays between bulk operations
4. **Stages**: To move a box to a different stage, update the box with the new `stageKey`
5. **Email Integration**: Streak is tightly integrated with Gmail; threads are Gmail thread IDs
6. **Team Key**: When creating contacts, you need a `teamKey` which can be obtained from the teams endpoint
