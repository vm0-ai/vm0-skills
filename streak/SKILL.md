name: streak
description: Gmail-integrated CRM for managing pipelines, deals (boxes), contacts, and email threads
vm0_env:

- STREAK_API_KEY

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
export STREAK_API_KEY="your-api-key"
```

---

## How to Use

### Authentication

Streak uses HTTP Basic Auth with your API key as the username and no password. In curl, use `-u ${STREAK_API_KEY}:` (note the trailing colon).

---

### 1. Get Current User

```bash
curl -s -X GET "https://api.streak.com/api/v1/users/me" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 2. List All Pipelines

Pipelines represent business processes (Sales, Hiring, Projects, etc.).

```bash
curl -s -X GET "https://api.streak.com/api/v1/pipelines" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 3. Get a Pipeline

```bash
curl -s -X GET "https://api.streak.com/api/v1/pipelines/{pipelineKey}" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 4. Create a Pipeline

```bash
curl -s -X PUT "https://api.streak.com/api/v1/pipelines" \
  -u "${STREAK_API_KEY}:" \
  --header "Content-Type: application/json" \
  -d '{"name": "New Sales Pipeline"}' \
  | jq .
```

---

### 5. List Boxes in Pipeline

Boxes are the core data objects (deals, leads, projects) within a pipeline.

```bash
curl -s -X GET "https://api.streak.com/api/v1/pipelines/{pipelineKey}/boxes" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 6. Get a Box

```bash
curl -s -X GET "https://api.streak.com/api/v1/boxes/{boxKey}" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 7. Create a Box

```bash
curl -s -X POST "https://api.streak.com/api/v1/pipelines/{pipelineKey}/boxes" \
  -u "${STREAK_API_KEY}:" \
  --header "Content-Type: application/json" \
  -d '{"name": "Acme Corp Deal"}' \
  | jq .
```

---

### 8. Update a Box

```bash
curl -s -X POST "https://api.streak.com/api/v1/boxes/{boxKey}" \
  -u "${STREAK_API_KEY}:" \
  --header "Content-Type: application/json" \
  -d '{"name": "Updated Deal Name", "stageKey": "stageKey123"}' \
  | jq .
```

---

### 9. List Stages in Pipeline

```bash
curl -s -X GET "https://api.streak.com/api/v1/pipelines/{pipelineKey}/stages" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 10. List Fields in Pipeline

```bash
curl -s -X GET "https://api.streak.com/api/v1/pipelines/{pipelineKey}/fields" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 11. Get a Contact

```bash
curl -s -X GET "https://api.streak.com/api/v1/contacts/{contactKey}" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 12. Create a Contact

```bash
curl -s -X POST "https://api.streak.com/api/v1/contacts" \
  -u "${STREAK_API_KEY}:" \
  --header "Content-Type: application/json" \
  -d '{
    "teamKey": "teamKey123",
    "emailAddresses": ["john@example.com"],
    "givenName": "John",
    "familyName": "Doe"
  }' \
  | jq .
```

---

### 13. Get an Organization

```bash
curl -s -X GET "https://api.streak.com/api/v1/organizations/{organizationKey}" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 14. Search Boxes, Contacts, and Organizations

```bash
curl -s -X GET "https://api.streak.com/api/v1/search?query=acme" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 15. Get Tasks in a Box

```bash
curl -s -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/tasks" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 16. Create a Task

```bash
curl -s -X POST "https://api.streak.com/api/v1/boxes/{boxKey}/tasks" \
  -u "${STREAK_API_KEY}:" \
  --header "Content-Type: application/json" \
  -d '{"text": "Follow up with client", "dueDate": 1735689600000}' \
  | jq .
```

---

### 17. Get Comments in a Box

```bash
curl -s -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/comments" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 18. Create a Comment

```bash
curl -s -X POST "https://api.streak.com/api/v1/boxes/{boxKey}/comments" \
  -u "${STREAK_API_KEY}:" \
  --header "Content-Type: application/json" \
  -d '{"message": "Spoke with client today, they are interested."}' \
  | jq .
```

---

### 19. Get Threads in a Box

Email threads associated with a box.

```bash
curl -s -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/threads" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 20. Get Files in a Box

```bash
curl -s -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/files" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 21. Get Meetings in a Box

```bash
curl -s -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/meetings" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

### 22. Create a Meeting Note

```bash
curl -s -X POST "https://api.streak.com/api/v1/boxes/{boxKey}/meetings" \
  -u "${STREAK_API_KEY}:" \
  --header "Content-Type: application/json" \
  -d '{
    "meetingDate": 1735689600000,
    "meetingNotes": "Discussed pricing and timeline.",
    "title": "Sales Call"
  }' \
  | jq .
```

---

### 23. Get Box Timeline

```bash
curl -s -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/timeline" \
  -u "${STREAK_API_KEY}:" \
  | jq .
```

---

## Guidelines

1. **Keys**: Pipeline keys, box keys, and other identifiers are alphanumeric strings returned by the API
2. **Timestamps**: Use Unix timestamps in milliseconds for date fields (e.g., `dueDate`, `meetingDate`)
3. **Rate Limits**: Be mindful of API rate limits; add delays between bulk operations
4. **Stages**: To move a box to a different stage, update the box with the new `stageKey`
5. **Email Integration**: Streak is tightly integrated with Gmail; threads are Gmail thread IDs
6. **Team Key**: When creating contacts, you need a `teamKey` which can be obtained from the teams endpoint
