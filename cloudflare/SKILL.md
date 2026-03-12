---
name: cloudflare
description: Cloudflare API for DNS and zone management. Use when user mentions "Cloudflare",
  "DNS record", "zone", or "CDN settings".
vm0_secrets:
  - CLOUDFLARE_TOKEN
---

# Cloudflare

Cloudflare provides a comprehensive platform for DNS management, CDN, security, serverless computing (Workers), object storage (R2), and more. Use the REST API to manage zones, DNS records, Workers scripts, KV namespaces, R2 buckets, and firewall rules programmatically.

> Official docs: `https://developers.cloudflare.com/api/`

---

## When to Use

Use this skill when you need to:

- Manage DNS records (create, update, delete A, AAAA, CNAME, MX, TXT records)
- List and configure zones and zone settings
- Deploy and manage Workers scripts
- Manage R2 object storage buckets
- Configure firewall rules and security settings
- Query analytics and logs

---

## Prerequisites

1. Create a Cloudflare account at https://dash.cloudflare.com/sign-up
2. Go to **My Profile** > **API Tokens** and click **Create Token**
3. Choose a template (e.g., "Edit zone DNS") or create a custom token with required permissions
4. Copy the generated token immediately (it is only shown once)

Set environment variables:

```bash
export CLOUDFLARE_TOKEN="your-api-token"
```

For zone-specific operations, you also need your Zone ID (found on the zone overview page in the dashboard):

```bash
export CLOUDFLARE_ZONE_ID="your-zone-id"
```

For account-level operations (Workers, R2), you need your Account ID (found on the dashboard overview):

```bash
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
```

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.cloudflare.com/client/v4/zones" --header "Authorization: Bearer $CLOUDFLARE_TOKEN"' | jq .
> ```

## How to Use

### Base URL

All API requests use: `https://api.cloudflare.com/client/v4`

### 1. Verify Token

```bash
bash -c 'curl -s "https://api.cloudflare.com/client/v4/user/tokens/verify" --header "Authorization: Bearer $CLOUDFLARE_TOKEN"' | jq .
```

### 2. List Zones

```bash
bash -c 'curl -s "https://api.cloudflare.com/client/v4/zones" --header "Authorization: Bearer $CLOUDFLARE_TOKEN"' | jq .
```

### 3. Get Zone Details

```bash
bash -c 'curl -s "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID" --header "Authorization: Bearer $CLOUDFLARE_TOKEN"' | jq .
```

### 4. List DNS Records

```bash
bash -c 'curl -s "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" --header "Authorization: Bearer $CLOUDFLARE_TOKEN"' | jq .
```

### 5. Create DNS Record

Write to `/tmp/cloudflare_request.json`:

```json
{
  "type": "A",
  "name": "sub.example.com",
  "content": "1.2.3.4",
  "ttl": 3600,
  "proxied": false
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" --header "Authorization: Bearer $CLOUDFLARE_TOKEN" --header "Content-Type: application/json" -d @/tmp/cloudflare_request.json' | jq .
```

### 6. Update DNS Record

Write to `/tmp/cloudflare_request.json`:

```json
{
  "type": "A",
  "name": "sub.example.com",
  "content": "5.6.7.8",
  "ttl": 3600,
  "proxied": true
}
```

Then run:

```bash
bash -c 'curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records/RECORD_ID" --header "Authorization: Bearer $CLOUDFLARE_TOKEN" --header "Content-Type: application/json" -d @/tmp/cloudflare_request.json' | jq .
```

### 7. Delete DNS Record

```bash
bash -c 'curl -s -X DELETE "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records/RECORD_ID" --header "Authorization: Bearer $CLOUDFLARE_TOKEN"' | jq .
```

### 8. List Workers Scripts

```bash
bash -c 'curl -s "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts" --header "Authorization: Bearer $CLOUDFLARE_TOKEN"' | jq .
```

### 9. List KV Namespaces

```bash
bash -c 'curl -s "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces" --header "Authorization: Bearer $CLOUDFLARE_TOKEN"' | jq .
```

### 10. List R2 Buckets

```bash
bash -c 'curl -s "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/r2/buckets" --header "Authorization: Bearer $CLOUDFLARE_TOKEN"' | jq .
```

### 11. Purge Zone Cache

Write to `/tmp/cloudflare_request.json`:

```json
{
  "purge_everything": true
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" --header "Authorization: Bearer $CLOUDFLARE_TOKEN" --header "Content-Type: application/json" -d @/tmp/cloudflare_request.json' | jq .
```

### 12. List Firewall Rules

```bash
bash -c 'curl -s "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/firewall/rules" --header "Authorization: Bearer $CLOUDFLARE_TOKEN"' | jq .
```

### 13. Get Zone Analytics

```bash
bash -c 'curl -s "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/analytics/dashboard?since=-1440&continuous=true" --header "Authorization: Bearer $CLOUDFLARE_TOKEN"' | jq .
```

---

## Common DNS Record Types

| Type | Purpose | Example Content |
|------|---------|-----------------|
| **A** | IPv4 address | `1.2.3.4` |
| **AAAA** | IPv6 address | `2001:db8::1` |
| **CNAME** | Alias to another domain | `example.com` |
| **MX** | Mail server | `mail.example.com` (with priority) |
| **TXT** | Text record (SPF, DKIM, etc.) | `v=spf1 include:_spf.google.com ~all` |
| **NS** | Name server | `ns1.example.com` |
| **SRV** | Service locator | Service-specific format |

---

## Guidelines

1. **Use API Tokens over Global API Key**: API tokens provide scoped, least-privilege access and are the recommended authentication method
2. **Pagination**: List endpoints return paginated results (default 20-100 per page). Use `page` and `per_page` query parameters to iterate
3. **Response Structure**: All responses include `success`, `errors`, `messages`, and `result` fields. Always check `success` before using `result`
4. **Proxied Records**: Setting `proxied: true` routes traffic through Cloudflare CDN and enables security features. Not all record types support proxying
5. **Zone ID vs Domain Name**: Most API endpoints require the Zone ID (a 32-character hex string), not the domain name
6. **Account ID**: Workers, R2, KV, and other account-level resources require the Account ID instead of Zone ID
7. **Rate Limits**: Cloudflare API has rate limits per token. Monitor response headers and implement backoff if you receive 429 responses
