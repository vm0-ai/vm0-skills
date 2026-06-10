---
name: tiktok-ads
description: TikTok Ads API for advertising campaign management. Use when user mentions
  "TikTok Ads", "TikTok for Business", "TikTok advertising", ad campaigns, or
  TikTok ad reporting.
---

## Prerequisites

1. Connect TikTok Ads in Zero at Settings > Connectors > TikTok Ads.
2. Requests require `TIKTOK_ADS_TOKEN`.
3. Most Ads API endpoints require an `advertiser_id`. Ask the user which ad account to use when it is not clear.
4. Use the v1.3 business API base URL: `https://business-api.tiktok.com/open_api/v1.3`.

## Authentication

Every request requires this header:

```bash
Access-Token: $TIKTOK_ADS_TOKEN
```

Do not use `Authorization: Bearer ...` for TikTok Ads requests. TikTok API for Business expects the OAuth token in the `Access-Token` header.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name TIKTOK_ADS_TOKEN`.

TikTok responses usually include `code`, `message`, and `request_id`. Treat `code: 0` as success. Include `request_id` when summarizing API failures.

## Campaigns

### List Campaigns

```bash
curl -sS --get "https://business-api.tiktok.com/open_api/v1.3/campaign/get/" \
  --data-urlencode "advertiser_id={advertiser-id}" \
  --data-urlencode "page_size=20" \
  --header "Access-Token: $TIKTOK_ADS_TOKEN" | jq .
```

### Get Campaign Details

```bash
curl -sS --get "https://business-api.tiktok.com/open_api/v1.3/campaign/get/" \
  --data-urlencode "advertiser_id={advertiser-id}" \
  --data-urlencode 'filtering={"campaign_ids":["{campaign-id}"]}' \
  --header "Access-Token: $TIKTOK_ADS_TOKEN" | jq .
```

### Create Campaign

Create campaigns paused unless the user explicitly asks to launch live traffic. Check the advertiser currency and current TikTok Ads docs before setting budgets.

```bash
cat > /tmp/tiktok-campaign.json << 'EOF'
{
  "advertiser_id": "{advertiser-id}",
  "campaign_name": "My TikTok Campaign",
  "objective_type": "REACH",
  "budget_mode": "BUDGET_MODE_DAY",
  "budget": 50,
  "operation_status": "DISABLE"
}
EOF
curl -sS -X POST "https://business-api.tiktok.com/open_api/v1.3/campaign/create/" \
  --header "Access-Token: $TIKTOK_ADS_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/tiktok-campaign.json | jq .
```

### Update Campaign Status

```bash
cat > /tmp/tiktok-campaign-update.json << 'EOF'
{
  "advertiser_id": "{advertiser-id}",
  "campaign_id": "{campaign-id}",
  "operation_status": "DISABLE"
}
EOF
curl -sS -X POST "https://business-api.tiktok.com/open_api/v1.3/campaign/update/" \
  --header "Access-Token: $TIKTOK_ADS_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/tiktok-campaign-update.json | jq .
```

## Ad Groups

### List Ad Groups

```bash
curl -sS --get "https://business-api.tiktok.com/open_api/v1.3/adgroup/get/" \
  --data-urlencode "advertiser_id={advertiser-id}" \
  --data-urlencode "page_size=20" \
  --header "Access-Token: $TIKTOK_ADS_TOKEN" | jq .
```

### Get Ad Group Details

```bash
curl -sS --get "https://business-api.tiktok.com/open_api/v1.3/adgroup/get/" \
  --data-urlencode "advertiser_id={advertiser-id}" \
  --data-urlencode 'filtering={"adgroup_ids":["{adgroup-id}"]}' \
  --header "Access-Token: $TIKTOK_ADS_TOKEN" | jq .
```

## Ads

### List Ads

```bash
curl -sS --get "https://business-api.tiktok.com/open_api/v1.3/ad/get/" \
  --data-urlencode "advertiser_id={advertiser-id}" \
  --data-urlencode "page_size=20" \
  --header "Access-Token: $TIKTOK_ADS_TOKEN" | jq .
```

### Get Ad Details

```bash
curl -sS --get "https://business-api.tiktok.com/open_api/v1.3/ad/get/" \
  --data-urlencode "advertiser_id={advertiser-id}" \
  --data-urlencode 'filtering={"ad_ids":["{ad-id}"]}' \
  --header "Access-Token: $TIKTOK_ADS_TOKEN" | jq .
```

## Reporting

### Campaign Performance

```bash
cat > /tmp/tiktok-report.json << 'EOF'
{
  "advertiser_id": "{advertiser-id}",
  "report_type": "BASIC",
  "data_level": "AUCTION_CAMPAIGN",
  "dimensions": ["campaign_id"],
  "metrics": ["spend", "impressions", "clicks", "ctr", "cpc", "cpm", "conversion"],
  "start_date": "2026-06-01",
  "end_date": "2026-06-10",
  "page_size": 100
}
EOF
curl -sS -X POST "https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/" \
  --header "Access-Token: $TIKTOK_ADS_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/tiktok-report.json | jq .
```

### Daily Campaign Performance

```bash
cat > /tmp/tiktok-daily-report.json << 'EOF'
{
  "advertiser_id": "{advertiser-id}",
  "report_type": "BASIC",
  "data_level": "AUCTION_CAMPAIGN",
  "dimensions": ["campaign_id", "stat_time_day"],
  "metrics": ["spend", "impressions", "clicks", "ctr", "cpc", "cpm", "conversion"],
  "start_date": "2026-06-01",
  "end_date": "2026-06-10",
  "page_size": 100
}
EOF
curl -sS -X POST "https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/" \
  --header "Access-Token: $TIKTOK_ADS_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/tiktok-daily-report.json | jq .
```

## Pagination

For list and report endpoints, pass `page` and `page_size`, then continue while the response indicates more data. Preserve the original filters exactly across pages.
