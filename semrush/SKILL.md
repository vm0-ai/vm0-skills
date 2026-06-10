---
name: semrush
description: Semrush API for SEO, keyword research, backlinks, domain analytics,
  traffic, and competitive intelligence. Use when user mentions "Semrush", "SEO",
  "keyword research", "backlinks", "domain rankings", or "competitive research".
---

# Semrush

Use the Semrush API to retrieve SEO, keyword, backlink, traffic, and competitive
research data.

> Official docs: `https://developer.semrush.com/api/get-started/quick-start/`

---

## When to Use

Use this skill when you need to:

- Analyze domain rankings, organic keywords, paid keywords, or competitors
- Retrieve backlink overview and referring domain data
- Pull Semrush SEO API reports into an analysis or automation workflow

---

## Prerequisites

Connect the **Semrush** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name SEMRUSH_TOKEN` or `zero doctor check-connector --url "https://api.semrush.com/?type=domain_rank&domain=example.com&database=us&export_columns=Dn,Rk" --method GET`

---

## How to Use

### 1. Get Domain Overview

Replace `<domain>` with a bare domain such as `example.com`. The Semrush SEO API
returns CSV for these reports.

```bash
curl -s "https://api.semrush.com/?type=domain_rank&key=$SEMRUSH_TOKEN&export_columns=Dn,Rk,Or,Ot,Oc,Ad,At,Ac&domain=<domain>&database=us"
```

Docs: `https://developer.semrush.com/api/seo/overview-reports/`

### 2. Get Organic Search Keywords

Replace `<domain>` with a bare domain. `display_limit` controls the number of
returned rows and helps manage API unit usage.

```bash
curl -s "https://api.semrush.com/?type=domain_organic&key=$SEMRUSH_TOKEN&display_limit=10&export_columns=Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr,Td&domain=<domain>&display_sort=tr_desc&database=us"
```

Docs: `https://developer.semrush.com/api/seo/domain-reports/`

### 3. Get Paid Search Keywords

Replace `<domain>` with a bare domain.

```bash
curl -s "https://api.semrush.com/?type=domain_adwords&key=$SEMRUSH_TOKEN&display_limit=10&export_columns=Ph,Po,Pp,Pd,Nq,Cp,Vu,Ur,Tr,Tc,Co,Nr,Td&domain=<domain>&display_sort=tr_desc&database=us"
```

Docs: `https://developer.semrush.com/api/seo/domain-reports/`

### 4. Find Organic Competitors

Replace `<domain>` with a bare domain.

```bash
curl -s "https://api.semrush.com/?type=domain_organic_organic&key=$SEMRUSH_TOKEN&display_limit=10&export_columns=Dn,Cr,Np,Or,Ot,Oc,Ad,At,Ac&domain=<domain>&database=us"
```

Docs: `https://developer.semrush.com/api/seo/domain-reports/`

### 5. Get Backlinks Overview

Replace `<target-domain>` with a bare domain. Use `target_type=root_domain` for
root-domain-level analysis.

```bash
curl -s "https://api.semrush.com/analytics/v1/?type=backlinks_overview&key=$SEMRUSH_TOKEN&target=<target-domain>&target_type=root_domain&export_columns=ascore,total,domains_num,ips_num,follows_num,nofollows_num"
```

Docs: `https://developer.semrush.com/api/seo/backlinks/`

### 6. Get Referring Domains

Replace `<target-domain>` with a bare domain.

```bash
curl -s "https://api.semrush.com/analytics/v1/?type=backlinks_refdomains&key=$SEMRUSH_TOKEN&target=<target-domain>&target_type=root_domain&display_limit=10&export_columns=domain_ascore,domain,backlinks_num,first_seen,last_seen"
```

Docs: `https://developer.semrush.com/api/seo/backlinks/`

---

## Guidelines

1. **Most SEO API reports return CSV**: Do not assume JSON unless the endpoint documentation explicitly says so.
2. **Use `display_limit` aggressively**: Semrush API usage is metered by API units, often per returned line.
3. **Use bare domains**: Pass `example.com`, not `https://example.com`, unless an endpoint explicitly accepts URLs.
4. **Pick the right regional database**: Common values include `us`, `uk`, `de`, and other Semrush regional database codes.
5. **URL-encode filters**: If using `display_filter` or special characters, write the filter to `/tmp/query.txt` and use `--data-urlencode "display_filter@/tmp/query.txt"` with `curl -G`.
