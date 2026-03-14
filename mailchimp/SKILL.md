---
name: mailchimp
description: Mailchimp API for email marketing. Use when user mentions "Mailchimp",
  "email campaign", "newsletter", or marketing automation.
vm0_secrets:
  - MAILCHIMP_TOKEN
---

# Mailchimp Marketing API

Manage audiences (lists), campaigns, templates, and subscribers with the Mailchimp Marketing API v3.0.

> Official docs: `https://mailchimp.com/developer/marketing/api/`

## When to Use

- Manage audiences/lists and subscribers
- Create, send, and analyze email campaigns
- Manage email templates
- View campaign reports and analytics
- Manage tags and segments

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **Mailchimp**. vm0 will automatically inject the required `MAILCHIMP_TOKEN` environment variable.

#
### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/mailchimp-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $MAILCHIMP_TOKEN" "$@"
EOF
chmod +x /tmp/mailchimp-curl
```

**Usage:** All examples below use `/tmp/mailchimp-curl` instead of direct `curl` calls.

## Datacenter

Mailchimp API keys contain the datacenter suffix (e.g., `xxxxx-us21`). The base URL uses this datacenter: `https://<dc>.api.mailchimp.com/3.0`. vm0 handles datacenter routing automatically.


## Core APIs

### Get Account Info (Ping)

Use this to verify authentication and determine the datacenter:

```bash
/tmp/mailchimp-curl "https://us1.api.mailchimp.com/3.0/ping" | jq '{health_status}'
```

If this returns an error, try other datacenters (us2, us3, etc.) or extract the dc from your API key suffix.

---

### Get Account Details

```bash
/tmp/mailchimp-curl "https://us1.api.mailchimp.com/3.0/" | jq '{account_id, account_name, email, total_subscribers}'
```

---

### List Audiences (Lists)

```bash
/tmp/mailchimp-curl "https://us1.api.mailchimp.com/3.0/lists?count=10" | jq '.lists[] | {id, name, stats: {member_count: .stats.member_count, campaign_count: .stats.campaign_count}}'
```

Docs: https://mailchimp.com/developer/marketing/api/lists/

---

### Get Audience Details

Replace `<list-id>` with the actual list/audience ID:

```bash
/tmp/mailchimp-curl "https://us1.api.mailchimp.com/3.0/lists/<list-id>" | jq '{id, name, stats, date_created}'
```

---

### List Members of Audience

Replace `<list-id>` with the actual list ID:

```bash
/tmp/mailchimp-curl "https://us1.api.mailchimp.com/3.0/lists/<list-id>/members?count=10" | jq '.members[] | {id, email_address, status, full_name}'
```

---

### Add Member to Audience

Replace `<list-id>` with the actual list ID.

Write to `/tmp/mailchimp_request.json`:

```json
{
  "email_address": "new.subscriber@example.com",
  "status": "subscribed",
  "merge_fields": {
    "FNAME": "Jane",
    "LNAME": "Doe"
  }
}
```

```bash
/tmp/mailchimp-curl -X POST "https://us1.api.mailchimp.com/3.0/lists/<list-id>/members" -d @/tmp/mailchimp_request.json | jq '{id, email_address, status, full_name}'
```

Docs: https://mailchimp.com/developer/marketing/api/list-members/

---

### Update Member

Replace `<list-id>` and `<subscriber-hash>` (MD5 hash of lowercase email):

Write to `/tmp/mailchimp_request.json`:

```json
{
  "merge_fields": {
    "FNAME": "Janet"
  },
  "tags": ["vip"]
}
```

```bash
/tmp/mailchimp-curl -X PATCH "https://us1.api.mailchimp.com/3.0/lists/<list-id>/members/<subscriber-hash>" -d @/tmp/mailchimp_request.json | jq '{id, email_address, status, full_name}'
```

To compute the subscriber hash: `echo -n "email@example.com" | md5sum | cut -d' ' -f1`

---

### List Campaigns

```bash
/tmp/mailchimp-curl "https://us1.api.mailchimp.com/3.0/campaigns?count=10&sort_field=send_time&sort_dir=DESC" | jq '.campaigns[] | {id, type, status, settings: {subject_line: .settings.subject_line, title: .settings.title}, send_time}'
```

Docs: https://mailchimp.com/developer/marketing/api/campaigns/

---

### Get Campaign Details

Replace `<campaign-id>` with the actual campaign ID:

```bash
/tmp/mailchimp-curl "https://us1.api.mailchimp.com/3.0/campaigns/<campaign-id>" | jq '{id, type, status, settings, recipients, send_time}'
```

---

### Create Campaign

Write to `/tmp/mailchimp_request.json`:

```json
{
  "type": "regular",
  "recipients": {
    "list_id": "<list-id>"
  },
  "settings": {
    "subject_line": "Monthly Newsletter",
    "title": "March 2026 Newsletter",
    "from_name": "My Company",
    "reply_to": "hello@example.com"
  }
}
```

```bash
/tmp/mailchimp-curl -X POST "https://us1.api.mailchimp.com/3.0/campaigns" -d @/tmp/mailchimp_request.json | jq '{id, type, status, settings: {subject_line: .settings.subject_line, title: .settings.title}}'
```

---

### Get Campaign Report

Replace `<campaign-id>` with the actual campaign ID:

```bash
/tmp/mailchimp-curl "https://us1.api.mailchimp.com/3.0/reports/<campaign-id>" | jq '{id, campaign_title, subject_line, emails_sent, opens: {opens_total: .opens.opens_total, unique_opens: .opens.unique_opens, open_rate: .opens.open_rate}, clicks: {clicks_total: .clicks.clicks_total, unique_clicks: .clicks.unique_clicks}}'
```

Docs: https://mailchimp.com/developer/marketing/api/reports/

---

### List Templates

```bash
/tmp/mailchimp-curl "https://us1.api.mailchimp.com/3.0/templates?count=10" | jq '.templates[] | {id, name, type, date_created}'
```

---

### Search Members

Write to `/tmp/mailchimp_query.txt`:

```
jane@example.com
```

```bash
/tmp/mailchimp-curl "https://us1.api.mailchimp.com/3.0/search-members" | jq '.exact_matches.members[] | {id, email_address, full_name, status}'
```

---

### Create Audience

Write to `/tmp/mailchimp_request.json`:

```json
{
  "name": "My Newsletter",
  "contact": {
    "company": "My Company",
    "address1": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "90210",
    "country": "US"
  },
  "permission_reminder": "You signed up for our newsletter.",
  "campaign_defaults": {
    "from_name": "My Company",
    "from_email": "hello@example.com",
    "subject": "",
    "language": "en"
  },
  "email_type_option": true
}
```

```bash
/tmp/mailchimp-curl -X POST "https://us1.api.mailchimp.com/3.0/lists" -d @/tmp/mailchimp_request.json | jq '{id, name, stats}'
```

---

## Guidelines

1. **Datacenter routing**: The API key suffix (e.g., `-us21`) determines the datacenter. vm0's proxy routes to the correct datacenter automatically
2. **Subscriber hash**: Member endpoints use MD5 hash of lowercase email as the identifier
3. **Status values**: subscribed, unsubscribed, cleaned, pending, transactional
4. **Campaign types**: regular, plaintext, absplit, rss, variate
5. **Rate limits**: 10 concurrent connections; batch operations available for bulk updates
6. **Pagination**: Use `count` and `offset` query parameters
