---
name: google-contacts
description: Google Contacts management through the People API. Use when user mentions "Google Contacts", "contacts.google.com", address books, contact groups, or asks to list, create, update, or delete Google contacts.
---

# Google Contacts

Use the Google People API to read and manage the authenticated user's contacts
and contact groups.

> Official docs: `https://developers.google.com/people/api/rest/`

## Prerequisites

Connect the **Google Contacts** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name GOOGLE_CONTACTS_TOKEN` or `zero doctor check-connector --url https://people.googleapis.com/v1/contactGroups --method GET`

## How to Use

Base URL: `https://people.googleapis.com/v1`

### List Contacts

```bash
curl -s "https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,organizations,metadata&pageSize=1000" --header "Authorization: Bearer $GOOGLE_CONTACTS_TOKEN" | jq '.connections[]? | {resourceName, etag, names, emailAddresses, phoneNumbers, organizations}'
```

Use `nextPageToken` as `pageToken` to fetch another page when the response is
paginated.

### Get a Contact

Replace `<person-id>` with the ID from a resource name such as
`people/<person-id>`.

```bash
curl -s "https://people.googleapis.com/v1/people/<person-id>?personFields=names,emailAddresses,phoneNumbers,organizations,memberships,metadata" --header "Authorization: Bearer $GOOGLE_CONTACTS_TOKEN" | jq '{resourceName, etag, metadata, names, emailAddresses, phoneNumbers, organizations, memberships}'
```

### Create a Contact

Write to `/tmp/google_contacts_request.json`:

```json
{
  "names": [
    {
      "givenName": "Ada",
      "familyName": "Lovelace"
    }
  ],
  "emailAddresses": [
    {
      "value": "ada@example.com",
      "type": "work"
    }
  ],
  "phoneNumbers": [
    {
      "value": "+1 555 0100",
      "type": "work"
    }
  ],
  "organizations": [
    {
      "name": "Analytical Engines",
      "title": "Mathematician",
      "type": "work"
    }
  ]
}
```

Then run:

```bash
curl -s -X POST "https://people.googleapis.com/v1/people:createContact?personFields=names,emailAddresses,phoneNumbers,organizations,metadata" --header "Authorization: Bearer $GOOGLE_CONTACTS_TOKEN" --header "Content-Type: application/json" -d @/tmp/google_contacts_request.json | jq '.error // {resourceName, etag, names, emailAddresses, phoneNumbers, organizations}'
```

### Update a Contact

First get the contact and copy its current `metadata` object into the update
body. Google rejects stale updates when the contact source `etag` has changed.

Write to `/tmp/google_contacts_request.json`:

```json
{
  "metadata": {
    "sources": [
      {
        "type": "CONTACT",
        "id": "<contact-source-id>",
        "etag": "<current-source-etag>"
      }
    ]
  },
  "emailAddresses": [
    {
      "value": "new-address@example.com",
      "type": "work"
    }
  ],
  "phoneNumbers": [
    {
      "value": "+1 555 0199",
      "type": "mobile"
    }
  ]
}
```

Then run:

```bash
curl -s -X PATCH "https://people.googleapis.com/v1/people/<person-id>:updateContact?updatePersonFields=emailAddresses,phoneNumbers&personFields=names,emailAddresses,phoneNumbers,metadata" --header "Authorization: Bearer $GOOGLE_CONTACTS_TOKEN" --header "Content-Type: application/json" -d @/tmp/google_contacts_request.json | jq '.error // {resourceName, etag, names, emailAddresses, phoneNumbers}'
```

Fields named in `updatePersonFields` are replaced, so include every value that
should remain in those fields.

### Delete a Contact

```bash
curl -s -X DELETE "https://people.googleapis.com/v1/people/<person-id>:deleteContact" --header "Authorization: Bearer $GOOGLE_CONTACTS_TOKEN"
```

### List Contact Groups

```bash
curl -s "https://people.googleapis.com/v1/contactGroups?pageSize=1000&groupFields=name,groupType,memberCount,metadata" --header "Authorization: Bearer $GOOGLE_CONTACTS_TOKEN" | jq '.contactGroups[]? | {resourceName, name, groupType, memberCount, metadata}'
```

### Create a Contact Group

Write to `/tmp/google_contacts_group_request.json`:

```json
{
  "contactGroup": {
    "name": "Project Team"
  }
}
```

Then run:

```bash
curl -s -X POST "https://people.googleapis.com/v1/contactGroups" --header "Authorization: Bearer $GOOGLE_CONTACTS_TOKEN" --header "Content-Type: application/json" -d @/tmp/google_contacts_group_request.json | jq '.error // {resourceName, name, groupType}'
```

### Add Contacts to a Group

Write to `/tmp/google_contacts_group_members_request.json`:

```json
{
  "resourceNamesToAdd": [
    "people/<person-id>"
  ]
}
```

Then run:

```bash
curl -s -X POST "https://people.googleapis.com/v1/contactGroups/<group-id>/members:modify" --header "Authorization: Bearer $GOOGLE_CONTACTS_TOKEN" --header "Content-Type: application/json" -d @/tmp/google_contacts_group_members_request.json | jq '.error // {notFoundResourceNames, canNotRemoveLastContactGroupResourceNames}'
```

## Guidelines

1. Send mutation requests for the same Google account sequentially; the People API warns that concurrent mutations can increase latency and failures.
2. Always request only the needed `personFields` to reduce response size.
3. Preserve the latest contact source metadata and `etag` when updating a contact.
4. Treat field masks as replacements: omitted values inside an updated field are removed.
5. Use `people/<person-id>` resource names exactly as returned by the API.
