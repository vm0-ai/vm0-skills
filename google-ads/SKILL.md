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
5. Google Data Manager requests require the Google Ads connector to have the `https://www.googleapis.com/auth/datamanager` OAuth scope.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name GOOGLE_ADS_TOKEN` or `zero doctor check-connector --url https://googleads.googleapis.com/v24/customers/1234567890/googleAds:search --method POST`

For Data Manager calls, use `zero doctor check-connector --url https://datamanager.googleapis.com/v1/requestStatus:retrieve --method GET --env-name GOOGLE_ADS_TOKEN`.

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

## Data Manager API

Use Data Manager when the user asks to send customer data, upload consented audience members, ingest conversion or event data, remove audience members, or check the status of a previous Data Manager request. These calls use `https://datamanager.googleapis.com` and require `GOOGLE_ADS_TOKEN` with the `datamanager` OAuth scope. They do not use GAQL.

Only upload user data that the user confirms is consented and permitted for the destination account. Prefer a test customer, test user list, or `validateOnly: true` while verifying request shape. For real audience or event ingestion, ask the user to confirm the target Google Ads customer ID, the destination ID, and that Customer Match / destination terms are accepted.

### Data Manager Destination Shape

Most Data Manager requests include one or more `destinations`. For Google Ads, set `accountType` to `GOOGLE_ADS`. If the user is not using an MCC / manager account, omit `loginAccount`.

```json
{
  "reference": "google_ads_demo_destination",
  "loginAccount": {
    "accountId": "{manager-id}",
    "accountType": "GOOGLE_ADS"
  },
  "operatingAccount": {
    "accountId": "{customer-id}",
    "accountType": "GOOGLE_ADS"
  },
  "productDestinationId": "{user-list-id-or-conversion-destination-id}"
}
```

### Hash User Identifiers

Data Manager `UserData` identifiers such as email addresses and phone numbers must be normalized and SHA-256 hashed. For email demos, lowercase and trim the address before hashing.

```bash
NORMALIZED_EMAIL="$(printf "%s" "oauth-demo@example.com" | tr '[:upper:]' '[:lower:]' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
EMAIL_SHA256="$(printf "%s" "$NORMALIZED_EMAIL" | sha256sum | awk '{print $1}')"
```

### Ingest Audience Members

Uploads consented users to a Google Ads audience or user list. Replace `{customer-id}`, `{manager-id}`, and `{user-list-id}` with real IDs. Remove `validateOnly` or set it to `false` only when the user confirms that the upload should be executed.

```bash
cat > /tmp/google_ads_data_manager_audience.json << EOF
{
  "destinations": [
    {
      "reference": "google_ads_demo_audience",
      "loginAccount": {
        "accountId": "{manager-id}",
        "accountType": "GOOGLE_ADS"
      },
      "operatingAccount": {
        "accountId": "{customer-id}",
        "accountType": "GOOGLE_ADS"
      },
      "productDestinationId": "{user-list-id}"
    }
  ],
  "audienceMembers": [
    {
      "destinationReferences": ["google_ads_demo_audience"],
      "userData": {
        "userIdentifiers": [
          {
            "emailAddress": "$EMAIL_SHA256"
          }
        ]
      },
      "consent": {
        "adUserData": "CONSENT_GRANTED",
        "adPersonalization": "CONSENT_GRANTED"
      }
    }
  ],
  "consent": {
    "adUserData": "CONSENT_GRANTED",
    "adPersonalization": "CONSENT_GRANTED"
  },
  "validateOnly": true,
  "encoding": "HEX",
  "termsOfService": {
    "customerMatchTermsOfServiceStatus": "ACCEPTED"
  }
}
EOF

curl -s -X POST "https://datamanager.googleapis.com/v1/audienceMembers:ingest" \
  --header "Authorization: Bearer $GOOGLE_ADS_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/google_ads_data_manager_audience.json | tee /tmp/google_ads_data_manager_audience_response.json
```

The response should include a `requestId`. Save it and retrieve status:

```bash
REQUEST_ID="$(jq -r '.requestId' /tmp/google_ads_data_manager_audience_response.json)"
curl -s "https://datamanager.googleapis.com/v1/requestStatus:retrieve?requestId=${REQUEST_ID}" \
  --header "Authorization: Bearer $GOOGLE_ADS_TOKEN" | jq
```

### Remove Audience Members

Use the same destination and audience member shape to remove users from the target audience. The remove request body only includes `destinations` and `audienceMembers`. Confirm with the user before executing a real removal.

```bash
jq '{destinations, audienceMembers}' /tmp/google_ads_data_manager_audience.json > /tmp/google_ads_data_manager_remove.json

curl -s -X POST "https://datamanager.googleapis.com/v1/audienceMembers:remove" \
  --header "Authorization: Bearer $GOOGLE_ADS_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/google_ads_data_manager_remove.json | tee /tmp/google_ads_data_manager_remove_response.json
```

### Ingest Conversion or Event Data

Use `events:ingest` to send consented conversion or event data to a configured destination. For `UserData`, keep `encoding` set to `HEX`.

```bash
cat > /tmp/google_ads_data_manager_event.json << EOF
{
  "destinations": [
    {
      "reference": "google_ads_demo_event",
      "loginAccount": {
        "accountId": "{manager-id}",
        "accountType": "GOOGLE_ADS"
      },
      "operatingAccount": {
        "accountId": "{customer-id}",
        "accountType": "GOOGLE_ADS"
      },
      "productDestinationId": "{conversion-destination-id}"
    }
  ],
  "events": [
    {
      "destinationReferences": ["google_ads_demo_event"],
      "transactionId": "vm0-demo-$(date +%s)",
      "eventTimestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
      "eventName": "purchase",
      "userData": {
        "userIdentifiers": [
          {
            "emailAddress": "$EMAIL_SHA256"
          }
        ]
      },
      "consent": {
        "adUserData": "CONSENT_GRANTED",
        "adPersonalization": "CONSENT_GRANTED"
      },
      "currency": "USD",
      "conversionValue": 1.0,
      "conversionCount": 1
    }
  ],
  "consent": {
    "adUserData": "CONSENT_GRANTED",
    "adPersonalization": "CONSENT_GRANTED"
  },
  "validateOnly": true,
  "encoding": "HEX"
}
EOF

curl -s -X POST "https://datamanager.googleapis.com/v1/events:ingest" \
  --header "Authorization: Bearer $GOOGLE_ADS_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/google_ads_data_manager_event.json | tee /tmp/google_ads_data_manager_event_response.json
```

Retrieve the request status:

```bash
REQUEST_ID="$(jq -r '.requestId' /tmp/google_ads_data_manager_event_response.json)"
curl -s "https://datamanager.googleapis.com/v1/requestStatus:retrieve?requestId=${REQUEST_ID}" \
  --header "Authorization: Bearer $GOOGLE_ADS_TOKEN" | jq
```

For OAuth review demos, show the Google Ads connector OAuth consent screen, then run one Data Manager ingest request that returns a `requestId`, then run `requestStatus:retrieve` and show the returned per-destination status. If reviewer-visible Google Ads UI does not expose individual uploaded members, the API request ID and status response are the evidence of Data Manager usage.

## Guidelines

1. `cost_micros` is in micro-currency units — divide by 1,000,000 for the actual currency amount (e.g., `1000000` = 1.00 USD).
2. Always create campaigns and ad groups with `"status": "PAUSED"` first, then activate after review.
3. Wait for the user to confirm before activating campaigns or modifying live campaigns.
4. Date macros: `TODAY`, `YESTERDAY`, `LAST_7_DAYS`, `LAST_30_DAYS`, `THIS_MONTH`, `LAST_MONTH`.
5. Use `searchStream` instead of `search` for queries expected to return more than 10,000 rows.
6. Campaign types: `SEARCH`, `DISPLAY`, `VIDEO`, `SHOPPING`, `HOTEL`, `PERFORMANCE_MAX`, `DEMAND_GEN`, `TRAVEL`.
7. Page size max is 10,000 for `search`. Use `next_page_token` for pagination.
8. Never include hyphens in customer IDs — use `1234567890`, not `123-456-7890`.
9. Do not upload, remove, or simulate customer data unless the user confirms consent, destination ownership, and whether the request should be `validateOnly` or live.
