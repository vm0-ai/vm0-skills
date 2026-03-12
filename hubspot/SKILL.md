---
name: hubspot
description: HubSpot CRM API for marketing and sales. Use when user mentions "HubSpot",
  "CRM", "HubSpot contacts", or asks about marketing automation.
vm0_secrets:
  - HUBSPOT_TOKEN
---

# HubSpot CRM API

Manage contacts, companies, deals, tickets, and their associations with the HubSpot CRM API v3.

> Official docs: `https://developers.hubspot.com/docs/api/overview`

## When to Use

- Create, update, and search contacts
- Manage companies, deals, and tickets
- Create associations between CRM objects
- Search and filter CRM records
- List pipeline stages for deals and tickets

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **HubSpot**. vm0 will automatically inject the required `HUBSPOT_TOKEN` environment variable.

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

## Core APIs

### List Contacts

```bash
bash -c 'curl -s "https://api.hubapi.com/crm/v3/objects/contacts?limit=10&properties=firstname,lastname,email" --header "Authorization: Bearer $HUBSPOT_TOKEN"' | jq '.results[] | {id, properties: {firstname: .properties.firstname, lastname: .properties.lastname, email: .properties.email}}'
```

Docs: https://developers.hubspot.com/docs/api/crm/contacts

---

### Get Contact

Replace `<contact-id>` with the actual contact ID:

```bash
bash -c 'curl -s "https://api.hubapi.com/crm/v3/objects/contacts/<contact-id>?properties=firstname,lastname,email,phone,company" --header "Authorization: Bearer $HUBSPOT_TOKEN"' | jq '{id, properties}'
```

---

### Create Contact

Write to `/tmp/hubspot_request.json`:

```json
{
  "properties": {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0100",
    "company": "Acme Corp"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://api.hubapi.com/crm/v3/objects/contacts" --header "Authorization: Bearer $HUBSPOT_TOKEN" --header "Content-Type: application/json" -d @/tmp/hubspot_request.json' | jq '{id, properties: {firstname: .properties.firstname, lastname: .properties.lastname, email: .properties.email}}'
```

Docs: https://developers.hubspot.com/docs/api/crm/contacts

---

### Update Contact

Replace `<contact-id>` with the actual contact ID.

Write to `/tmp/hubspot_request.json`:

```json
{
  "properties": {
    "phone": "+1-555-0200",
    "company": "New Corp"
  }
}
```

```bash
bash -c 'curl -s -X PATCH "https://api.hubapi.com/crm/v3/objects/contacts/<contact-id>" --header "Authorization: Bearer $HUBSPOT_TOKEN" --header "Content-Type: application/json" -d @/tmp/hubspot_request.json' | jq '{id, properties}'
```

---

### Search Contacts

Write to `/tmp/hubspot_request.json`:

```json
{
  "filterGroups": [
    {
      "filters": [
        {
          "propertyName": "email",
          "operator": "CONTAINS_TOKEN",
          "value": "example.com"
        }
      ]
    }
  ],
  "properties": ["firstname", "lastname", "email"],
  "limit": 10
}
```

```bash
bash -c 'curl -s -X POST "https://api.hubapi.com/crm/v3/objects/contacts/search" --header "Authorization: Bearer $HUBSPOT_TOKEN" --header "Content-Type: application/json" -d @/tmp/hubspot_request.json' | jq '.results[] | {id, properties}'
```

Docs: https://developers.hubspot.com/docs/api/crm/search

---

### Delete Contact

Replace `<contact-id>` with the actual contact ID:

```bash
bash -c 'curl -s -X DELETE "https://api.hubapi.com/crm/v3/objects/contacts/<contact-id>" --header "Authorization: Bearer $HUBSPOT_TOKEN" -w "\nHTTP Status: %{http_code}\n"'
```

---

### List Companies

```bash
bash -c 'curl -s "https://api.hubapi.com/crm/v3/objects/companies?limit=10&properties=name,domain,industry" --header "Authorization: Bearer $HUBSPOT_TOKEN"' | jq '.results[] | {id, properties: {name: .properties.name, domain: .properties.domain, industry: .properties.industry}}'
```

---

### Create Company

Write to `/tmp/hubspot_request.json`:

```json
{
  "properties": {
    "name": "Acme Corp",
    "domain": "acme.com",
    "industry": "Technology"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://api.hubapi.com/crm/v3/objects/companies" --header "Authorization: Bearer $HUBSPOT_TOKEN" --header "Content-Type: application/json" -d @/tmp/hubspot_request.json' | jq '{id, properties: {name: .properties.name, domain: .properties.domain}}'
```

---

### List Deals

```bash
bash -c 'curl -s "https://api.hubapi.com/crm/v3/objects/deals?limit=10&properties=dealname,amount,dealstage,closedate" --header "Authorization: Bearer $HUBSPOT_TOKEN"' | jq '.results[] | {id, properties: {dealname: .properties.dealname, amount: .properties.amount, dealstage: .properties.dealstage}}'
```

---

### Create Deal

Write to `/tmp/hubspot_request.json`:

```json
{
  "properties": {
    "dealname": "Enterprise License",
    "amount": "50000",
    "dealstage": "appointmentscheduled",
    "pipeline": "default"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://api.hubapi.com/crm/v3/objects/deals" --header "Authorization: Bearer $HUBSPOT_TOKEN" --header "Content-Type: application/json" -d @/tmp/hubspot_request.json' | jq '{id, properties: {dealname: .properties.dealname, amount: .properties.amount, dealstage: .properties.dealstage}}'
```

---

### List Tickets

```bash
bash -c 'curl -s "https://api.hubapi.com/crm/v3/objects/tickets?limit=10&properties=subject,content,hs_pipeline_stage" --header "Authorization: Bearer $HUBSPOT_TOKEN"' | jq '.results[] | {id, properties: {subject: .properties.subject, stage: .properties.hs_pipeline_stage}}'
```

---

### Create Ticket

Write to `/tmp/hubspot_request.json`:

```json
{
  "properties": {
    "subject": "Login issue",
    "content": "User cannot log in after password reset",
    "hs_pipeline": "0",
    "hs_pipeline_stage": "1"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://api.hubapi.com/crm/v3/objects/tickets" --header "Authorization: Bearer $HUBSPOT_TOKEN" --header "Content-Type: application/json" -d @/tmp/hubspot_request.json' | jq '{id, properties: {subject: .properties.subject}}'
```

---

### Get Deal Pipelines

```bash
bash -c 'curl -s "https://api.hubapi.com/crm/v3/pipelines/deals" --header "Authorization: Bearer $HUBSPOT_TOKEN"' | jq '.results[] | {id, label, stages: [.stages[] | {id, label, displayOrder}]}'
```

---

### Get Ticket Pipelines

```bash
bash -c 'curl -s "https://api.hubapi.com/crm/v3/pipelines/tickets" --header "Authorization: Bearer $HUBSPOT_TOKEN"' | jq '.results[] | {id, label, stages: [.stages[] | {id, label}]}'
```

---

### Create Association

Associate a contact with a company. Replace `<contact-id>` and `<company-id>`:

Write to `/tmp/hubspot_request.json`:

```json
[
  {
    "associationCategory": "HUBSPOT_DEFINED",
    "associationTypeId": 1
  }
]
```

```bash
bash -c 'curl -s -X PUT "https://api.hubapi.com/crm/v4/objects/contacts/<contact-id>/associations/companies/<company-id>" --header "Authorization: Bearer $HUBSPOT_TOKEN" --header "Content-Type: application/json" -d @/tmp/hubspot_request.json' | jq '{fromObjectTypeId, fromObjectId, toObjectTypeId, toObjectId}'
```

Common association type IDs: 1 (contact→company), 3 (deal→contact), 5 (deal→company)

---

### Get Account Info

```bash
bash -c 'curl -s "https://api.hubapi.com/account-info/v3/details" --header "Authorization: Bearer $HUBSPOT_TOKEN"' | jq '{portalId, accountType, timeZone, companyCurrency}'
```

---

## Guidelines

1. **CRM object types**: contacts, companies, deals, tickets, line_items, quotes — all follow the same CRUD pattern at `/crm/v3/objects/{objectType}`
2. **Properties**: Always specify `properties` query param to control which fields are returned
3. **Search operators**: EQ, NEQ, LT, LTE, GT, GTE, CONTAINS_TOKEN, NOT_CONTAINS_TOKEN, HAS_PROPERTY, NOT_HAS_PROPERTY
4. **Pagination**: Use `after` cursor from response `paging.next.after` for next page
5. **Rate limits**: 100 requests per 10 seconds for OAuth apps
