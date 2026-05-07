---
name: google-ads
description: Google Ads API for advertising campaign management. Use when user mentions
  "Google Ads", "AdWords", "ad campaigns", "GAQL", or Google advertising.
---

## Prerequisites

1. Connect Google Ads in Zero at Settings → Connectors → Google Ads.
2. Requests require both `GOOGLE_ADS_TOKEN` (OAuth access token) and `GOOGLE_ADS_DEVELOPER_TOKEN` (API developer token).
3. If using a manager (MCC) account, set `GOOGLE_ADS_LOGIN_CUSTOMER_ID` to the manager account ID.
4. All customer IDs should be in the format `1234567890` (no hyphens).

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name GOOGLE_ADS_TOKEN` or `zero doctor check-connector --url https://googleads.googleapis.com/v24/customers/1234567890/googleAds:search --method POST`

## Authentication

Every request requires these headers:

```
Authorization: Bearer $GOOGLE_ADS_TOKEN
developer-token: $GOOGLE_ADS_DEVELOPER_TOKEN
login-customer-id: <manager-account-id>  (only when using MCC)
```

## GAQL Queries (Reporting)

Google Ads uses Google Ads Query Language (GAQL), a SQL-like syntax. All queries are POSTed to `googleAds:search` or `googleAds:searchStream`.

### Search (Paginated)

```bash
cat > /tmp/query.json << 'EOF'
{
  "query": "SELECT campaign.id, campaign.name, campaign.status, metrics.impressions, metrics.clicks, metrics.cost_micros FROM campaign WHERE campaign.status = 'ENABLED' AND segments.date DURING LAST_30_DAYS ORDER BY metrics.cost_micros DESC LIMIT 100"
}
EOF
curl -s -X POST "https://googleads.googleapis.com/v24/customers/{customer-id}/googleAds:search" \
  --header "Authorization: Bearer $GOOGLE_ADS_TOKEN" \
  --header "developer-token: $GOOGLE_ADS_DEVELOPER_TOKEN" \
  --header "login-customer-id: {manager-id}" \
  --header "Content-Type: application/json" \
  -d @/tmp/query.json
```

### SearchStream (Large Result Sets)

```bash
cat > /tmp/stream-query.json << 'EOF'
{
  "query": "SELECT campaign.id, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros FROM campaign WHERE segments.date DURING LAST_30_DAYS"
}
EOF
curl -s -X POST "https://googleads.googleapis.com/v24/customers/{customer-id}/googleAds:searchStream" \
  --header "Authorization: Bearer $GOOGLE_ADS_TOKEN" \
  --header "developer-token: $GOOGLE_ADS_DEVELOPER_TOKEN" \
  --header "login-customer-id: {manager-id}" \
  --header "Content-Type: application/json" \
  -d @/tmp/stream-query.json
```

### Common GAQL Queries

**Ad group performance:**
```sql
SELECT ad_group.id, ad_group.name, ad_group.status, campaign.id, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM ad_group WHERE segments.date DURING LAST_30_DAYS
```

**Ad performance:**
```sql
SELECT ad_group_ad.ad.id, ad_group_ad.ad.name, ad_group_ad.ad.type, ad_group.id, campaign.id, metrics.impressions, metrics.clicks, metrics.cost_micros FROM ad_group_ad WHERE segments.date DURING LAST_30_DAYS
```

**Keyword performance:**
```sql
SELECT keyword_view.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.average_cpc FROM keyword_view WHERE segments.date DURING LAST_30_DAYS
```

**Account hierarchy:**
```sql
SELECT customer_client.client_customer, customer_client.descriptive_name, customer_client.id, customer_client.manager, customer_client.status FROM customer_client WHERE customer_client.status = 'ENABLED'
```

## Campaigns

### List Campaigns

```bash
cat > /tmp/list-campaigns.json << 'EOF'
{
  "query": "SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, campaign.start_date, campaign.end_date FROM campaign ORDER BY campaign.id"
}
EOF
curl -s -X POST "https://googleads.googleapis.com/v24/customers/{customer-id}/googleAds:search" \
  --header "Authorization: Bearer $GOOGLE_ADS_TOKEN" \
  --header "developer-token: $GOOGLE_ADS_DEVELOPER_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/list-campaigns.json
```

### Create Campaign

```bash
cat > /tmp/create-campaign.json << 'EOF'
{
  "operations": [
    {
      "create": {
        "name": "My Search Campaign",
        "status": "PAUSED",
        "advertising_channel_type": "SEARCH",
        "campaign_budget": "customers/{customer-id}/campaignBudgets/{budget-id}",
        "bidding_strategy_type": "TARGET_SPEND",
        "target_spend": {
          "cpc_bid_ceiling_micros": "1000000"
        },
        "network_settings": {
          "target_google_search": true,
          "target_search_network": true,
          "target_partner_search_network": false,
          "target_content_network": false
        }
      }
    }
  ]
}
EOF
curl -s -X POST "https://googleads.googleapis.com/v24/customers/{customer-id}/campaigns:mutate" \
  --header "Authorization: Bearer $GOOGLE_ADS_TOKEN" \
  --header "developer-token: $GOOGLE_ADS_DEVELOPER_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/create-campaign.json
```

### Update Campaign Status

```bash
cat > /tmp/update-campaign.json << 'EOF'
{
  "operations": [
    {
      "update": {
        "resource_name": "customers/{customer-id}/campaigns/{campaign-id}",
        "status": "PAUSED"
      },
      "update_mask": "status"
    }
  ]
}
EOF
curl -s -X POST "https://googleads.googleapis.com/v24/customers/{customer-id}/campaigns:mutate" \
  --header "Authorization: Bearer $GOOGLE_ADS_TOKEN" \
  --header "developer-token: $GOOGLE_ADS_DEVELOPER_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/update-campaign.json
```

## Ad Groups

### Create Ad Group

```bash
cat > /tmp/create-adgroup.json << 'EOF'
{
  "operations": [
    {
      "create": {
        "name": "My Ad Group",
        "status": "PAUSED",
        "campaign": "customers/{customer-id}/campaigns/{campaign-id}",
        "type": "SEARCH_STANDARD",
        "cpc_bid_micros": "1000000"
      }
    }
  ]
}
EOF
curl -s -X POST "https://googleads.googleapis.com/v24/customers/{customer-id}/adGroups:mutate" \
  --header "Authorization: Bearer $GOOGLE_ADS_TOKEN" \
  --header "developer-token: $GOOGLE_ADS_DEVELOPER_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/create-adgroup.json
```

## Accessible Customers

List all accounts accessible by the authenticated user:

```bash
curl -s "https://googleads.googleapis.com/v24/customers:listAccessibleCustomers" \
  --header "Authorization: Bearer $GOOGLE_ADS_TOKEN" \
  --header "developer-token: $GOOGLE_ADS_DEVELOPER_TOKEN"
```

## Guidelines

1. `cost_micros` is in micro-currency units — divide by 1,000,000 for the actual currency amount (e.g., `1000000` = 1.00 USD).
2. Always create campaigns and ad groups with `"status": "PAUSED"` first, then activate after review.
3. Wait for the user to confirm before activating campaigns or modifying live campaigns.
4. Date macros: `TODAY`, `YESTERDAY`, `LAST_7_DAYS`, `LAST_30_DAYS`, `THIS_MONTH`, `LAST_MONTH`.
5. Use `searchStream` instead of `search` for queries expected to return more than 10,000 rows.
6. Campaign types: `SEARCH`, `DISPLAY`, `VIDEO`, `SHOPPING`, `HOTEL`, `PERFORMANCE_MAX`, `DEMAND_GEN`, `TRAVEL`.
7. Page size max is 10,000 for `search`. Use `next_page_token` for pagination.
8. Never include hyphens in customer IDs — use `1234567890`, not `123-456-7890`.
