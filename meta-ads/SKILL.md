---
name: meta-ads
description: Meta Ads API for Facebook/Instagram advertising. Use when user mentions
  "Meta Ads", "Facebook Ads", "Instagram Ads", or ad campaigns.
vm0_secrets:
  - META_ADS_TOKEN
---

# Meta Marketing API

Manage Facebook and Instagram advertising campaigns, ad sets, ads, and performance insights via the Meta Marketing API (Graph API).

> Official docs: https://developers.facebook.com/docs/marketing-api/reference/

---

## When to Use

Use this skill when you need to:

- List and manage ad accounts
- Create, update, or pause ad campaigns
- Create and manage ad sets (targeting, budgets, scheduling)
- Create and manage ads (creatives)
- Retrieve performance insights and analytics
- Manage custom audiences

---

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings → Connectors** and connect **Meta Ads**. vm0 will automatically inject the required `META_ADS_TOKEN` environment variable.

---


> **Placeholders:** Values in `{curly-braces}` like `{ad-account-id}` are placeholders. Replace them with actual values when executing. Ad account IDs must be prefixed with `act_` (e.g., `act_123456789`).

---


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/meta-ads-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $META_ADS_TOKEN" "$@"
EOF
chmod +x /tmp/meta-ads-curl
```

**Usage:** All examples below use `/tmp/meta-ads-curl` instead of direct `curl` calls.

## Ad Accounts

### List Ad Accounts

```bash
/tmp/meta-ads-curl "https://graph.facebook.com/v22.0/me/adaccounts?fields=id,name,account_status,currency,timezone_name,amount_spent&access_token=$META_ADS_TOKEN" | jq '.data[] | {id, name, account_status, currency}'
```

### Get Ad Account Details

```bash
/tmp/meta-ads-curl "https://graph.facebook.com/v22.0/{ad-account-id}?fields=id,name,account_status,currency,timezone_name,balance,amount_spent,spend_cap&access_token=$META_ADS_TOKEN"
```

---

## Campaigns

### List Campaigns

```bash
/tmp/meta-ads-curl "https://graph.facebook.com/v22.0/{ad-account-id}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time&access_token=$META_ADS_TOKEN" | jq '.data[] | {id, name, status, objective}'
```

### Get Campaign Details

```bash
/tmp/meta-ads-curl "https://graph.facebook.com/v22.0/{campaign-id}?fields=id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time,created_time,updated_time&access_token=$META_ADS_TOKEN"
```

### Create Campaign

Write the request body to a temp file, then send it:

```bash
cat > /tmp/campaign.json << 'EOF'
{
  "name": "My Campaign",
  "objective": "OUTCOME_AWARENESS",
  "status": "PAUSED",
  "special_ad_categories": []
}
EOF
/tmp/meta-ads-curl -X POST "https://graph.facebook.com/v22.0/{ad-account-id}/campaigns?access_token=$META_ADS_TOKEN" -d @/tmp/campaign.json
```

### Update Campaign

```bash
cat > /tmp/campaign-update.json << 'EOF'
{
  "name": "Updated Campaign Name",
  "status": "PAUSED"
}
EOF
/tmp/meta-ads-curl -X POST "https://graph.facebook.com/v22.0/{campaign-id}?access_token=$META_ADS_TOKEN" -d @/tmp/campaign-update.json
```

### Delete Campaign

```bash
/tmp/meta-ads-curl -X DELETE "https://graph.facebook.com/v22.0/{campaign-id}?access_token=$META_ADS_TOKEN"
```

---

## Ad Sets

### List Ad Sets

```bash
/tmp/meta-ads-curl "https://graph.facebook.com/v22.0/{ad-account-id}/adsets?fields=id,name,status,campaign_id,daily_budget,lifetime_budget,start_time,end_time,targeting&access_token=$META_ADS_TOKEN" | jq '.data[] | {id, name, status, campaign_id, daily_budget}'
```

### Get Ad Set Details

```bash
/tmp/meta-ads-curl "https://graph.facebook.com/v22.0/{adset-id}?fields=id,name,status,campaign_id,daily_budget,lifetime_budget,bid_amount,billing_event,optimization_goal,start_time,end_time,targeting&access_token=$META_ADS_TOKEN"
```

### Create Ad Set

```bash
cat > /tmp/adset.json << 'EOF'
{
  "name": "My Ad Set",
  "campaign_id": "{campaign-id}",
  "daily_budget": "1000",
  "billing_event": "IMPRESSIONS",
  "optimization_goal": "REACH",
  "bid_amount": "500",
  "targeting": {
    "geo_locations": {
      "countries": ["US"]
    },
    "age_min": 18,
    "age_max": 65
  },
  "start_time": "2026-04-01T00:00:00-0700",
  "status": "PAUSED"
}
EOF
/tmp/meta-ads-curl -X POST "https://graph.facebook.com/v22.0/{ad-account-id}/adsets?access_token=$META_ADS_TOKEN" -d @/tmp/adset.json
```

---

## Ads

### List Ads

```bash
/tmp/meta-ads-curl "https://graph.facebook.com/v22.0/{ad-account-id}/ads?fields=id,name,status,adset_id,campaign_id,created_time&access_token=$META_ADS_TOKEN" | jq '.data[] | {id, name, status, adset_id}'
```

### Get Ad Details

```bash
/tmp/meta-ads-curl "https://graph.facebook.com/v22.0/{ad-id}?fields=id,name,status,adset_id,campaign_id,creative,created_time,updated_time&access_token=$META_ADS_TOKEN"
```

---

## Insights (Performance Analytics)

### Account-Level Insights

Get overall account performance for the last 7 days:

```bash
/tmp/meta-ads-curl "https://graph.facebook.com/v22.0/{ad-account-id}/insights?fields=impressions,clicks,spend,ctr,cpc,cpm,reach,frequency&date_preset=last_7d&access_token=$META_ADS_TOKEN" | jq '.data[0]'
```

### Campaign-Level Insights

```bash
/tmp/meta-ads-curl "https://graph.facebook.com/v22.0/{ad-account-id}/insights?fields=campaign_name,campaign_id,impressions,clicks,spend,ctr,cpc,actions&level=campaign&date_preset=last_30d&access_token=$META_ADS_TOKEN" | jq '.data[] | {campaign_name, impressions, clicks, spend, ctr}'
```

### Insights with Date Range

```bash
/tmp/meta-ads-curl "https://graph.facebook.com/v22.0/{ad-account-id}/insights?fields=impressions,clicks,spend,ctr,cpc,reach,actions&time_range={\" | jq '.data[0]'
```

### Insights with Daily Breakdown

```bash
/tmp/meta-ads-curl "https://graph.facebook.com/v22.0/{ad-account-id}/insights?fields=impressions,clicks,spend,ctr&date_preset=last_7d&time_increment=1&access_token=$META_ADS_TOKEN" | jq '.data[] | {date_start, impressions, clicks, spend}'
```

### Insights by Age and Gender

```bash
/tmp/meta-ads-curl "https://graph.facebook.com/v22.0/{ad-account-id}/insights?fields=impressions,clicks,spend&date_preset=last_30d&breakdowns=age,gender&access_token=$META_ADS_TOKEN" | jq '.data[] | {age, gender, impressions, clicks, spend}'
```

---

## Custom Audiences

### List Custom Audiences

```bash
/tmp/meta-ads-curl "https://graph.facebook.com/v22.0/{ad-account-id}/customaudiences?fields=id,name,approximate_count_lower_bound,approximate_count_upper_bound&access_token=$META_ADS_TOKEN" | jq '.data[] | {id, name, approximate_count_lower_bound}'
```

---

## Guidelines

1. All monetary values (budgets, bids, spend) are in the account's currency smallest unit (e.g., cents for USD). A `daily_budget` of `1000` = $10.00 USD.
2. Always create campaigns with `"status": "PAUSED"` first, then activate after review.
3. Campaign objectives must be one of: `OUTCOME_AWARENESS`, `OUTCOME_ENGAGEMENT`, `OUTCOME_LEADS`, `OUTCOME_SALES`, `OUTCOME_TRAFFIC`, `OUTCOME_APP_PROMOTION`.
4. Use `date_preset` values: `today`, `yesterday`, `last_7d`, `last_30d`, `this_month`, `last_month`, `maximum`.
5. Pagination: if results have a `paging.next` URL, fetch it to get more results.
6. Rate limits apply. If you get a rate limit error (code 17 or 32), wait before retrying.
