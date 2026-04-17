---
name: streak
description: Streak CRM API for Gmail. Use when user mentions "Streak", "Gmail CRM",
  "email CRM", or pipeline in Gmail.
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

Connect the **Streak CRM** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name STREAK_TOKEN` or `zero doctor check-connector --url https://api.streak.com/api/v1/users/me --method GET`

## How to Use

### Authentication

Streak uses HTTP Basic Auth with your API key as the username and no password. In curl, use `-u "$STREAK_TOKEN:"` (note the trailing colon).

---

### 1. Get Current User

```bash
curl -s -X GET "https://api.streak.com/api/v1/users/me" -u "$STREAK_TOKEN:"
```

---

### 2. List All Pipelines

Pipelines represent business processes (Sales, Hiring, Projects, etc.).

```bash
curl -s -X GET "https://api.streak.com/api/v1/pipelines" -u "$STREAK_TOKEN:"
```

---

### 3. Get a Pipeline

```bash
curl -s -X GET "https://api.streak.com/api/v1/pipelines/{pipelineKey}" -u "$STREAK_TOKEN:"
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
curl -s -X PUT "https://api.streak.com/api/v1/pipelines" -u "$STREAK_TOKEN:" --header "Content-Type: application/json" -d @/tmp/streak_request.json
```

---

### 5. List Boxes in Pipeline

Boxes are the core data objects (deals, leads, projects) within a pipeline.

```bash
curl -s -X GET "https://api.streak.com/api/v1/pipelines/{pipelineKey}/boxes" -u "$STREAK_TOKEN:"
```

---

### 6. Get a Box

```bash
curl -s -X GET "https://api.streak.com/api/v1/boxes/{boxKey}" -u "$STREAK_TOKEN:"
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
curl -s -X POST "https://api.streak.com/api/v1/pipelines/{pipelineKey}/boxes" -u "$STREAK_TOKEN:" --header "Content-Type: application/json" -d @/tmp/streak_request.json
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
curl -s -X POST "https://api.streak.com/api/v1/boxes/{boxKey}" -u "$STREAK_TOKEN:" --header "Content-Type: application/json" -d @/tmp/streak_request.json
```

---

### 9. List Stages in Pipeline

```bash
curl -s -X GET "https://api.streak.com/api/v1/pipelines/{pipelineKey}/stages" -u "$STREAK_TOKEN:"
```

---

### 10. List Fields in Pipeline

```bash
curl -s -X GET "https://api.streak.com/api/v1/pipelines/{pipelineKey}/fields" -u "$STREAK_TOKEN:"
```

---

### 11. Get a Contact

```bash
curl -s -X GET "https://api.streak.com/api/v1/contacts/{contactKey}" -u "$STREAK_TOKEN:"
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
curl -s -X POST "https://api.streak.com/api/v1/contacts" -u "$STREAK_TOKEN:" --header "Content-Type: application/json" -d @/tmp/streak_request.json
```

---

### 13. Get an Organization

```bash
curl -s -X GET "https://api.streak.com/api/v1/organizations/{organizationKey}" -u "$STREAK_TOKEN:"
```

---

### 14. Search Boxes, Contacts, and Organizations

```bash
curl -s -X GET "https://api.streak.com/api/v1/search?query=acme" -u "$STREAK_TOKEN:"
```

---

### 15. Get Tasks in a Box

```bash
curl -s -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/tasks" -u "$STREAK_TOKEN:"
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
curl -s -X POST "https://api.streak.com/api/v1/boxes/{boxKey}/tasks" -u "$STREAK_TOKEN:" --header "Content-Type: application/json" -d @/tmp/streak_request.json
```

---

### 17. Get Comments in a Box

```bash
curl -s -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/comments" -u "$STREAK_TOKEN:"
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
curl -s -X POST "https://api.streak.com/api/v1/boxes/{boxKey}/comments" -u "$STREAK_TOKEN:" --header "Content-Type: application/json" -d @/tmp/streak_request.json
```

---

### 19. Get Threads in a Box

Email threads associated with a box.

```bash
curl -s -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/threads" -u "$STREAK_TOKEN:"
```

---

### 20. Get Files in a Box

```bash
curl -s -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/files" -u "$STREAK_TOKEN:"
```

---

### 21. Get Meetings in a Box

```bash
curl -s -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/meetings" -u "$STREAK_TOKEN:"
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
curl -s -X POST "https://api.streak.com/api/v1/boxes/{boxKey}/meetings" -u "$STREAK_TOKEN:" --header "Content-Type: application/json" -d @/tmp/streak_request.json
```

---

### 23. Get Box Timeline

```bash
curl -s -X GET "https://api.streak.com/api/v1/boxes/{boxKey}/timeline" -u "$STREAK_TOKEN:"
```

---

## Guidelines

1. **Keys**: Pipeline keys, box keys, and other identifiers are alphanumeric strings returned by the API
2. **Timestamps**: Use Unix timestamps in milliseconds for date fields (e.g., `dueDate`, `meetingDate`)
3. **Rate Limits**: Be mindful of API rate limits; add delays between bulk operations
4. **Stages**: To move a box to a different stage, update the box with the new `stageKey`
5. **Email Integration**: Streak is tightly integrated with Gmail; threads are Gmail thread IDs
6. **Team Key**: When creating contacts, you need a `teamKey` which can be obtained from the teams endpoint
