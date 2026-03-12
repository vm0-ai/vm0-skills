---
name: explorium
description: Explorium API for external data enrichment. Use when user mentions "Explorium",
  "data enrichment", "business data", or external datasets.
vm0_secrets:
  - EXPLORIUM_TOKEN
---

# Explorium API

Use the Explorium API via direct `curl` calls to **enrich business and prospect data**, discover leads, and track real-time business events.

> Official docs: `https://developers.explorium.ai/reference/introduction`

---

## When to Use

Use this skill when you need to:

- **Enrich business data** with firmographic, technographic, and financial information
- **Discover and enrich prospects** with contact details, social profiles, and professional history
- **Search and match businesses** by name, domain, or other identifiers
- **Track business events** such as funding rounds, job changes, and company updates
- **Bulk process** up to 50 business or prospect records in a single request

---

## Prerequisites

1. Sign up at [Explorium](https://www.explorium.ai/) and purchase a subscription package
2. Log in to the [Explorium Admin Portal](https://admin.explorium.ai) and navigate to **Access & Authentication > Getting Your API Key**
3. Store your API key in the environment variable `EXPLORIUM_TOKEN`

```bash
export EXPLORIUM_TOKEN="your-api-key"
```

### API Limits

- Rate limit: up to 200 queries per minute
- Bulk endpoints: up to 50 records per request
- Pagination: up to 100 records per page

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" --header "api_key: $EXPLORIUM_TOKEN"' | jq .
> ```

## How to Use

All examples below assume you have `EXPLORIUM_TOKEN` set.

The base URL for the Explorium API is:

- `https://api.explorium.ai`

The API key is passed via the `api_key` header in all requests.

---

### 1. Get Business Statistics

Check the total number of businesses matching your filters before fetching records:

Write to `/tmp/explorium_request.json`:

```json
{
  "filters": {
    "country": {
      "values": ["United States"]
    },
    "industry": {
      "values": ["Software"]
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.explorium.ai/v1/businesses/stats" --header "Content-Type: application/json" --header "api_key: $EXPLORIUM_TOKEN" -d @/tmp/explorium_request.json' | jq .
```

---

### 2. Match a Business

Find a business by name or domain and get its unique `business_id`:

Write to `/tmp/explorium_request.json`:

```json
{
  "name": "Explorium",
  "website": "explorium.ai"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.explorium.ai/v1/businesses/match" --header "Content-Type: application/json" --header "api_key: $EXPLORIUM_TOKEN" -d @/tmp/explorium_request.json' | jq .
```

---

### 3. Fetch Businesses

Retrieve business records matching specific filters:

Write to `/tmp/explorium_request.json`:

```json
{
  "mode": "full",
  "page": 1,
  "page_size": 10,
  "filters": {
    "country": {
      "values": ["United States"]
    },
    "number_of_employees": {
      "values": [{"min": 50, "max": 500}]
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.explorium.ai/v1/businesses" --header "Content-Type: application/json" --header "api_key: $EXPLORIUM_TOKEN" -d @/tmp/explorium_request.json' | jq .
```

---

### 4. Enrich a Business

Enrich a business with specific data categories. Replace `<enrichment_name>` with the enrichment type (e.g., `firmographics`, `technographics`, `financial_metrics`):

Write to `/tmp/explorium_request.json`:

```json
{
  "business_id": "<your-business-id>"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.explorium.ai/v1/businesses/<enrichment_name>/enrich" --header "Content-Type: application/json" --header "api_key: $EXPLORIUM_TOKEN" -d @/tmp/explorium_request.json' | jq .
```

Common enrichment types:
- `firmographics` - Company size, industry, location, revenue
- `technographics` - Technology stack and tools used
- `financial_metrics` - Revenue, funding, financial indicators
- `social_media` - Social media presence and metrics

---

### 5. Bulk Enrich Businesses

Enrich multiple businesses at once (up to 50 per request):

Write to `/tmp/explorium_request.json`:

```json
{
  "business_ids": [
    "8adce3ca1cef0c986b22310e369a0793",
    "a34bacf839b923770b2c360eefa26748"
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.explorium.ai/v1/businesses/<enrichment_name>/bulk_enrich" --header "Content-Type: application/json" --header "api_key: $EXPLORIUM_TOKEN" -d @/tmp/explorium_request.json' | jq .
```

---

### 6. Fetch Prospects

Search for prospects (people) matching specific criteria:

Write to `/tmp/explorium_request.json`:

```json
{
  "mode": "full",
  "page": 1,
  "page_size": 10,
  "filters": {
    "job_level": {
      "values": ["C-Level"]
    },
    "department": {
      "values": ["Engineering"]
    },
    "business_id": {
      "values": ["<your-business-id>"]
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.explorium.ai/v1/prospects" --header "Content-Type: application/json" --header "api_key: $EXPLORIUM_TOKEN" -d @/tmp/explorium_request.json' | jq .
```

---

### 7. Match a Prospect

Find a specific prospect by name and company:

Write to `/tmp/explorium_request.json`:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "company_name": "Explorium"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.explorium.ai/v1/prospects/match" --header "Content-Type: application/json" --header "api_key: $EXPLORIUM_TOKEN" -d @/tmp/explorium_request.json' | jq .
```

---

### 8. Enrich Prospect Contact Information

Get contact details for a specific prospect:

Write to `/tmp/explorium_request.json`:

```json
{
  "prospect_id": "<your-prospect-id>"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.explorium.ai/v1/prospects/contacts_information/enrich" --header "Content-Type: application/json" --header "api_key: $EXPLORIUM_TOKEN" -d @/tmp/explorium_request.json' | jq .
```

---

### 9. Get Prospect Statistics

Check the total number of prospects matching your filters:

Write to `/tmp/explorium_request.json`:

```json
{
  "filters": {
    "job_level": {
      "values": ["C-Level", "VP"]
    },
    "business_id": {
      "values": ["<your-business-id>"]
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.explorium.ai/v1/prospects/stats" --header "Content-Type: application/json" --header "api_key: $EXPLORIUM_TOKEN" -d @/tmp/explorium_request.json' | jq .
```

---

### 10. Autocomplete Businesses

Search for businesses by partial name for quick lookups:

```bash
bash -c 'curl -s -X GET "https://api.explorium.ai/v1/businesses/autocomplete?query=explor" --header "api_key: $EXPLORIUM_TOKEN"' | jq .
```

---

## Guidelines

1. **Use the match endpoint first** to obtain `business_id` or `prospect_id` before calling enrichment endpoints
2. **Check stats before fetching** to understand result set size and optimize pagination
3. **Use bulk endpoints** when enriching multiple records to reduce API calls and stay within rate limits
4. **Paginate large result sets** with `page` and `page_size` parameters (max 100 per page)
5. **Store IDs for reuse** since business and prospect IDs are stable identifiers
6. **Monitor rate limits** of 200 queries per minute to avoid throttling
