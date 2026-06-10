---
name: meta-ads
description: Meta Ads API for Facebook/Instagram advertising. Use when user mentions
  "Meta Ads", "Facebook Ads", "Instagram Ads", or ad campaigns.
---

## Prerequisites

1. Connect Meta Ads in Zero at Settings > Connectors > Meta Ads.
2. Requests require `META_ADS_TOKEN`.
3. Ad account IDs usually use the `act_<account-id>` format when calling ad account endpoints.

## Authentication

Normal connector requests require this header:

```
Authorization: Bearer $META_ADS_TOKEN
```

Do not pass `META_ADS_TOKEN` as an `access_token` query parameter or in the request body. Zero connector tokens are placeholders that are resolved at the network boundary when sent as the `Authorization` header to `https://graph.facebook.com`. Putting the placeholder in `access_token=` can send it literally and cause Meta to return a malformed access token error.

Exception: Page access tokens returned by Graph API are real secondary tokens, not Zero placeholders. For Page-token-only endpoints such as `/{page-id}/ads_posts`, get the Page access token with the connector token first, then use `Authorization: Bearer $page_token` for that Page-token request.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name META_ADS_TOKEN` or `zero doctor check-connector --url https://graph.facebook.com/v22.0/me/adaccounts --method GET`

If `/{page-id}/ads_posts` returns `(#200) Not enough permission to call this endpoint` while `/me/permissions` shows `pages_manage_ads` is granted, verify that the request is using a real Page access token. Calling `/me?fields=id,name,category` with `Authorization: Bearer $page_token` should return the Page ID, not the user ID.

## Pages

### List Pages

```bash
curl -sS --get "https://graph.facebook.com/v22.0/me/accounts" \
  --data-urlencode "fields=id,name,tasks" \
  --header "Authorization: Bearer $META_ADS_TOKEN" | jq '.data[] | {id, name, tasks}'
```

### Test Page Ads Posts (`pages_manage_ads`)

Use a real Page access token for Page Ads Posts. Do not use `META_ADS_TOKEN` for this endpoint.

```bash
PAGE_ID="{page-id}"

page_token=$(curl -sS --get "https://graph.facebook.com/v22.0/$PAGE_ID" \
  --data-urlencode "fields=id,name,access_token" \
  --header "Authorization: Bearer $META_ADS_TOKEN" | jq -r '.access_token')

curl -sS --get "https://graph.facebook.com/v22.0/$PAGE_ID/ads_posts" \
  --data-urlencode "fields=id,created_time" \
  --data-urlencode "limit=1" \
  --header "Authorization: Bearer $page_token" | jq .
```

An empty response such as `{"data":[]}` is a successful call when the Page has no ad posts.

## Ad Accounts

### List Ad Accounts

```bash
curl -s "https://graph.facebook.com/v22.0/me/adaccounts?fields=id,name,account_status,currency,timezone_name,amount_spent" \
  --header "Authorization: Bearer $META_ADS_TOKEN" | jq '.data[] | {id, name, account_status, currency}'
```

### Get Ad Account Details

```bash
curl -s "https://graph.facebook.com/v22.0/{ad-account-id}?fields=id,name,account_status,currency,timezone_name,balance,amount_spent,spend_cap" \
  --header "Authorization: Bearer $META_ADS_TOKEN"
```

## Campaigns

### List Campaigns

```bash
curl -s "https://graph.facebook.com/v22.0/{ad-account-id}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time" \
  --header "Authorization: Bearer $META_ADS_TOKEN" | jq '.data[] | {id, name, status, objective}'
```

### Get Campaign Details

```bash
curl -s "https://graph.facebook.com/v22.0/{campaign-id}?fields=id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time,created_time,updated_time" \
  --header "Authorization: Bearer $META_ADS_TOKEN"
```

### Create Campaign

Write the request body to a temp file, then send it:

```bash
cat > /tmp/campaign.json << 'EOF'
{
  "name": "My Campaign",
  "objective": "OUTCOME_AWARENESS",
  "status": "PAUSED",
  "is_adset_budget_sharing_enabled": false,
  "special_ad_categories": []
}
EOF
curl -s -X POST "https://graph.facebook.com/v22.0/{ad-account-id}/campaigns" \
  --header "Authorization: Bearer $META_ADS_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/campaign.json
```

### Update Campaign

```bash
cat > /tmp/campaign-update.json << 'EOF'
{
  "name": "Updated Campaign Name",
  "status": "PAUSED"
}
EOF
curl -s -X POST "https://graph.facebook.com/v22.0/{campaign-id}" \
  --header "Authorization: Bearer $META_ADS_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/campaign-update.json
```

### Delete Campaign

```bash
curl -s -X DELETE "https://graph.facebook.com/v22.0/{campaign-id}" \
  --header "Authorization: Bearer $META_ADS_TOKEN"
```

## Ad Sets

### List Ad Sets

```bash
curl -s "https://graph.facebook.com/v22.0/{ad-account-id}/adsets?fields=id,name,status,campaign_id,daily_budget,lifetime_budget,start_time,end_time,targeting" \
  --header "Authorization: Bearer $META_ADS_TOKEN" | jq '.data[] | {id, name, status, campaign_id, daily_budget}'
```

### Get Ad Set Details

```bash
curl -s "https://graph.facebook.com/v22.0/{adset-id}?fields=id,name,status,campaign_id,daily_budget,lifetime_budget,bid_amount,billing_event,optimization_goal,start_time,end_time,targeting" \
  --header "Authorization: Bearer $META_ADS_TOKEN"
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
curl -s -X POST "https://graph.facebook.com/v22.0/{ad-account-id}/adsets" \
  --header "Authorization: Bearer $META_ADS_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/adset.json
```

## Ads

### List Ads

```bash
curl -s "https://graph.facebook.com/v22.0/{ad-account-id}/ads?fields=id,name,status,adset_id,campaign_id,created_time" \
  --header "Authorization: Bearer $META_ADS_TOKEN" | jq '.data[] | {id, name, status, adset_id}'
```

### Get Ad Details

```bash
curl -s "https://graph.facebook.com/v22.0/{ad-id}?fields=id,name,status,adset_id,campaign_id,creative,created_time,updated_time" \
  --header "Authorization: Bearer $META_ADS_TOKEN"
```

## Insights (Performance Analytics)

### Account-Level Insights

Get overall account performance for the last 7 days:

```bash
curl -s "https://graph.facebook.com/v22.0/{ad-account-id}/insights?fields=impressions,clicks,spend,ctr,cpc,cpm,reach,frequency&date_preset=last_7d" \
  --header "Authorization: Bearer $META_ADS_TOKEN" | jq '.data[0]'
```

### Campaign-Level Insights

```bash
curl -s "https://graph.facebook.com/v22.0/{ad-account-id}/insights?fields=campaign_name,campaign_id,impressions,clicks,spend,ctr,cpc,actions&level=campaign&date_preset=last_30d" \
  --header "Authorization: Bearer $META_ADS_TOKEN" | jq '.data[] | {campaign_name, impressions, clicks, spend, ctr}'
```

### Insights with Date Range

```bash
curl -s "https://graph.facebook.com/v22.0/{ad-account-id}/insights?fields=impressions,clicks,spend,ctr,cpc,reach,actions&time_range={\"since\":\"2026-01-01\",\"until\":\"2026-01-31\"}" \
  --header "Authorization: Bearer $META_ADS_TOKEN" | jq '.data[0]'
```

### Insights with Daily Breakdown

```bash
curl -s "https://graph.facebook.com/v22.0/{ad-account-id}/insights?fields=impressions,clicks,spend,ctr&date_preset=last_7d&time_increment=1" \
  --header "Authorization: Bearer $META_ADS_TOKEN" | jq '.data[] | {date_start, impressions, clicks, spend}'
```

### Insights by Age and Gender

```bash
curl -s "https://graph.facebook.com/v22.0/{ad-account-id}/insights?fields=impressions,clicks,spend&date_preset=last_30d&breakdowns=age,gender" \
  --header "Authorization: Bearer $META_ADS_TOKEN" | jq '.data[] | {age, gender, impressions, clicks, spend}'
```

## Custom Audiences

### List Custom Audiences

```bash
curl -s "https://graph.facebook.com/v22.0/{ad-account-id}/customaudiences?fields=id,name,approximate_count_lower_bound,approximate_count_upper_bound" \
  --header "Authorization: Bearer $META_ADS_TOKEN" | jq '.data[] | {id, name, approximate_count_lower_bound}'
```

## Guidelines

1. All monetary values (budgets, bids, spend) are in the account's currency smallest unit (e.g., cents for USD). A `daily_budget` of `1000` = $10.00 USD.
2. Always create campaigns with `"status": "PAUSED"` first, then activate after review.
3. Campaign objectives must be one of: `OUTCOME_AWARENESS`, `OUTCOME_ENGAGEMENT`, `OUTCOME_LEADS`, `OUTCOME_SALES`, `OUTCOME_TRAFFIC`, `OUTCOME_APP_PROMOTION`.
4. Use `date_preset` values: `today`, `yesterday`, `last_7d`, `last_30d`, `this_month`, `last_month`, `maximum`.
5. Pagination: if results have a `paging.next` URL, fetch it to get more results.
6. Rate limits apply. If you get a rate limit error (code 17 or 32), wait before retrying.
