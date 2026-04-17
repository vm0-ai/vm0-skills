---
name: plain
description: Plain.com GraphQL API for customer support. Use when user mentions "Plain", "Plain.com", "support threads", or managing customers in Plain.
vm0_env:
  - PLAIN_TOKEN
---

# Plain

Manage customer support threads, customers, and labels via Plain's GraphQL API.

> Official docs: `https://www.plain.com/docs/graphql/introduction`

---

## When to Use

Use this skill when you need to:

- List and search support threads by status or customer
- Get thread details and conversation history
- Reply to customer threads
- Create or update customer records
- Add labels to threads for categorization
- Create customer events for lifecycle tracking

---

## Prerequisites

Connect the **Plain** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name PLAIN_TOKEN` or `zero doctor check-connector --url https://core-api.uk.plain.com/graphql/v1 --method POST`

## Threads

### List Threads

Write to `/tmp/plain_request.json`:

```json
{
  "query": "query listThreads($first: Int, $filters: ThreadsFilter) { threads(first: $first, filters: $filters) { edges { node { id externalId title status priority createdAt { iso8601 } customer { id fullName email { email } } assignedTo { ... on User { id fullName } ... on MachineUser { id fullName } } } } pageInfo { hasNextPage endCursor } } }",
  "variables": {
    "first": 20,
    "filters": {
      "statuses": ["TODO", "SNOOZED"]
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://core-api.uk.plain.com/graphql/v1" --header "Authorization: Bearer $PLAIN_TOKEN" --header "Content-Type: application/json" -d @/tmp/plain_request.json | jq '.data.threads.edges[].node | {id, title, status, customer: .customer.email.email}'
```

### Get Thread by ID

Replace `<thread-id>` with the actual thread ID from the list threads response:

Write to `/tmp/plain_request.json`:

```json
{
  "query": "query getThread($threadId: ID!) { thread(threadId: $threadId) { id externalId title status priority createdAt { iso8601 } updatedAt { iso8601 } customer { id fullName email { email } } assignedTo { ... on User { id fullName } ... on MachineUser { id fullName } } labels { id labelType { id name } } } }",
  "variables": {
    "threadId": "<thread-id>"
  }
}
```

Then run:

```bash
curl -s -X POST "https://core-api.uk.plain.com/graphql/v1" --header "Authorization: Bearer $PLAIN_TOKEN" --header "Content-Type: application/json" -d @/tmp/plain_request.json
```

### Reply to Thread

Replace `<thread-id>` with the actual thread ID:

Write to `/tmp/plain_request.json`:

```json
{
  "query": "mutation replyToThread($input: ReplyToThreadInput!) { replyToThread(input: $input) { timelineEntry { id timestamp { iso8601 } } error { message type code } } }",
  "variables": {
    "input": {
      "threadId": "<thread-id>",
      "textContent": "Thank you for reaching out. I'm looking into your issue and will follow up shortly."
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://core-api.uk.plain.com/graphql/v1" --header "Authorization: Bearer $PLAIN_TOKEN" --header "Content-Type: application/json" -d @/tmp/plain_request.json
```

---

## Customers

### Upsert Customer

Create a new customer or update an existing one by email:

Write to `/tmp/plain_request.json`:

```json
{
  "query": "mutation upsertCustomer($input: UpsertCustomerInput!) { upsertCustomer(input: $input) { customer { id fullName email { email isVerified } externalId createdAt { iso8601 } } result error { message type code fields { field message type } } } }",
  "variables": {
    "input": {
      "identifier": {
        "emailAddress": "alice@example.com"
      },
      "onCreate": {
        "fullName": "Alice Thompson",
        "email": {
          "email": "alice@example.com",
          "isVerified": true
        },
        "externalId": "user_123"
      },
      "onUpdate": {
        "fullName": { "value": "Alice Thompson" }
      }
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://core-api.uk.plain.com/graphql/v1" --header "Authorization: Bearer $PLAIN_TOKEN" --header "Content-Type: application/json" -d @/tmp/plain_request.json
```

### Get Customer by Email

Write to `/tmp/plain_request.json`:

```json
{
  "query": "query getCustomerByEmail($email: String!) { customerByEmail(email: $email) { id fullName email { email isVerified } externalId createdAt { iso8601 } } }",
  "variables": {
    "email": "alice@example.com"
  }
}
```

Then run:

```bash
curl -s -X POST "https://core-api.uk.plain.com/graphql/v1" --header "Authorization: Bearer $PLAIN_TOKEN" --header "Content-Type: application/json" -d @/tmp/plain_request.json
```

---

## Labels

### List Label Types

Write to `/tmp/plain_request.json`:

```json
{
  "query": "query listLabelTypes { labelTypes(first: 50) { edges { node { id name } } } }"
}
```

Then run:

```bash
curl -s -X POST "https://core-api.uk.plain.com/graphql/v1" --header "Authorization: Bearer $PLAIN_TOKEN" --header "Content-Type: application/json" -d @/tmp/plain_request.json | jq '.data.labelTypes.edges[].node | {id, name}'
```

### Add Labels to Thread

Replace `<thread-id>` and `<label-type-id>` with actual values from the list threads and list label types responses:

Write to `/tmp/plain_request.json`:

```json
{
  "query": "mutation addLabels($input: AddLabelsInput!) { addLabels(input: $input) { labels { id labelType { id name } } error { message type code } } }",
  "variables": {
    "input": {
      "threadId": "<thread-id>",
      "labelTypeIds": ["<label-type-id>"]
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://core-api.uk.plain.com/graphql/v1" --header "Authorization: Bearer $PLAIN_TOKEN" --header "Content-Type: application/json" -d @/tmp/plain_request.json
```

---

## Error Handling

All mutations return an `error` field. Always check it — a `200` HTTP response can still contain an error:

```json
{
  "data": {
    "replyToThread": {
      "timelineEntry": null,
      "error": {
        "message": "Thread not found",
        "type": "NOT_FOUND",
        "code": "thread_not_found"
      }
    }
  }
}
```

---

## Guidelines

1. **GraphQL only**: All requests go to `POST https://core-api.uk.plain.com/graphql/v1`
2. **Check `error` fields**: Mutations return errors in the response body, not via HTTP status codes
3. **Pagination**: Use Relay-style cursor pagination — pass `first` and `after` (from `pageInfo.endCursor`) for subsequent pages
4. **Machine User permissions**: Grant the minimum permissions needed (e.g., `threads:read`, `customers:write`)
5. **Thread statuses**: `TODO` (needs action), `SNOOZED` (waiting), `DONE` (resolved)
6. **Full schema**: Available at `https://core-api.uk.plain.com/graphql/v1/schema.graphql`

---

## API Reference

- GraphQL endpoint: `https://core-api.uk.plain.com/graphql/v1`
- Schema: `https://core-api.uk.plain.com/graphql/v1/schema.graphql`
- Documentation: `https://www.plain.com/docs/graphql/introduction`
