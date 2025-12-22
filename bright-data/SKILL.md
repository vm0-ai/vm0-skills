name: bright-data
description: Bright Data API via curl. Use this skill for web scraping, SERP results, residential/datacenter proxies, and data collection at scale.
vm0_env:

- BRIGHTDATA_API_KEY
- BRIGHTDATA_CUSTOMER_ID
- BRIGHTDATA_ZONE_NAME
- BRIGHTDATA_ZONE_PASSWORD

---

# Bright Data API

Use the Bright Data API via direct `curl` calls for **web scraping**, **SERP results**, **proxy networks**, and **large-scale data collection**.

> Official docs: `https://docs.brightdata.com/`

---

## When to Use

Use this skill when you need to:

- **SERP scraping** - Get search engine results from Google, Bing, Yandex
- **Web scraping** - Extract data from websites at scale
- **Proxy access** - Route requests through residential, datacenter, or mobile IPs
- **Geo-targeting** - Access content from specific countries or cities
- **Bypass blocks** - Handle CAPTCHAs, rate limits, and anti-bot measures

---

## Prerequisites

1. Sign up at [Bright Data](https://brightdata.com/)
2. Get your API key from [Settings > Users](https://brightdata.com/cp/setting/users)
3. Create a zone (SERP API, Residential, Datacenter, etc.) in the control panel
4. Get zone credentials from the zone's Overview tab

```bash
export BRIGHTDATA_API_KEY="your-api-key"
export BRIGHTDATA_CUSTOMER_ID="your-customer-id"
export BRIGHTDATA_ZONE_NAME="your-zone-name"
export BRIGHTDATA_ZONE_PASSWORD="your-zone-password"
```

### Proxy Ports

| Proxy Type | Port |
|------------|------|
| Datacenter | 22225 |
| Residential | 33335 |
| ISP | 22225 |
| Mobile | 33335 |

---

## How to Use

All examples below assume you have the environment variables set.

---

### 1. SERP API - Direct Access

Scrape Google search results using Direct API:

```bash
curl -s "https://api.brightdata.com/request" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${BRIGHTDATA_API_KEY}" \
  -d "{
    \"zone\": \"${BRIGHTDATA_ZONE_NAME}\",
    \"url\": \"https://www.google.com/search?q=web+scraping+tools\",
    \"format\": \"raw\"
  }"
```

**Parameters:**

- `zone`: Your SERP API zone name
- `url`: Full search URL with query parameters
- `format`: `raw` for HTML, `json` for parsed results

---

### 2. SERP API - Via Proxy

Alternative method using proxy routing:

```bash
curl -s "https://www.google.com/search?q=web+scraping" \
  --proxy brd.superproxy.io:33335 \
  --proxy-user "brd-customer-${BRIGHTDATA_CUSTOMER_ID}-zone-${BRIGHTDATA_ZONE_NAME}:${BRIGHTDATA_ZONE_PASSWORD}" \
  -k
```

---

### 3. Residential Proxy

Route requests through residential IPs:

```bash
curl -s "https://httpbin.org/ip" \
  --proxy brd.superproxy.io:33335 \
  --proxy-user "brd-customer-${BRIGHTDATA_CUSTOMER_ID}-zone-${BRIGHTDATA_ZONE_NAME}:${BRIGHTDATA_ZONE_PASSWORD}" \
  -k | jq .
```

---

### 4. Datacenter Proxy

Route requests through datacenter IPs (faster, cheaper):

```bash
curl -s "https://httpbin.org/ip" \
  --proxy brd.superproxy.io:22225 \
  --proxy-user "brd-customer-${BRIGHTDATA_CUSTOMER_ID}-zone-${BRIGHTDATA_ZONE_NAME}:${BRIGHTDATA_ZONE_PASSWORD}" \
  -k | jq .
```

---

### 5. Country-Specific Proxy

Target a specific country:

```bash
curl -s "https://httpbin.org/ip" \
  --proxy brd.superproxy.io:33335 \
  --proxy-user "brd-customer-${BRIGHTDATA_CUSTOMER_ID}-zone-${BRIGHTDATA_ZONE_NAME}-country-us:${BRIGHTDATA_ZONE_PASSWORD}" \
  -k | jq .
```

Country codes: `us`, `gb`, `de`, `jp`, `cn`, etc. (ISO 3166-1 alpha-2)

---

### 6. City-Specific Proxy

Target a specific city:

```bash
curl -s "https://httpbin.org/ip" \
  --proxy brd.superproxy.io:33335 \
  --proxy-user "brd-customer-${BRIGHTDATA_CUSTOMER_ID}-zone-${BRIGHTDATA_ZONE_NAME}-country-us-city-newyork:${BRIGHTDATA_ZONE_PASSWORD}" \
  -k | jq .
```

City names must be lowercase with no spaces (e.g., `sanfrancisco`, `losangeles`).

---

### 7. Country-Specific Super Proxy

Use super proxy in a specific country for lower latency:

```bash
curl -s "https://httpbin.org/ip" \
  --proxy servercountry-gb.brd.superproxy.io:33335 \
  --proxy-user "brd-customer-${BRIGHTDATA_CUSTOMER_ID}-zone-${BRIGHTDATA_ZONE_NAME}:${BRIGHTDATA_ZONE_PASSWORD}" \
  -k | jq .
```

---

### 8. Web Scraper API - Trigger Collection

Trigger a web scraper to collect data:

```bash
curl -s "https://api.brightdata.com/datasets/v3/trigger?dataset_id=YOUR_DATASET_ID&format=json" \
  -X POST \
  -H "Authorization: Bearer ${BRIGHTDATA_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '[
    {"url": "https://www.example.com/page1"},
    {"url": "https://www.example.com/page2"}
  ]' | jq .
```

Returns a `snapshot_id` for tracking the collection.

---

### 9. Web Scraper IDE - Trigger Collector

Trigger a custom Web Scraper IDE collector:

```bash
COLLECTOR_ID="your-collector-id"

curl -s "https://api.brightdata.com/dca/trigger?collector=${COLLECTOR_ID}&queue_next=1" \
  -X POST \
  -H "Authorization: Bearer ${BRIGHTDATA_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '[
    {"url": "https://www.example.com/product/123"}
  ]' | jq .
```

---

### 10. Get Collection Status

Check the status of a triggered collection:

```bash
SNAPSHOT_ID="your-snapshot-id"

curl -s "https://api.brightdata.com/datasets/v3/progress/${SNAPSHOT_ID}" \
  -H "Authorization: Bearer ${BRIGHTDATA_API_KEY}" \
  | jq '{status, progress, records}'
```

**Status values:** `running`, `ready`, `failed`

---

### 11. Download Collection Results

Download completed collection data:

```bash
SNAPSHOT_ID="your-snapshot-id"

curl -s "https://api.brightdata.com/datasets/v3/snapshot/${SNAPSHOT_ID}?format=json" \
  -H "Authorization: Bearer ${BRIGHTDATA_API_KEY}" \
  | jq .
```

**Formats:** `json`, `ndjson`, `csv`

---

### 12. Verify Proxy Connection

Test your proxy setup with geo info:

```bash
curl -s "https://geo.brdtest.com/mygeo.json" \
  --proxy brd.superproxy.io:33335 \
  --proxy-user "brd-customer-${BRIGHTDATA_CUSTOMER_ID}-zone-${BRIGHTDATA_ZONE_NAME}:${BRIGHTDATA_ZONE_PASSWORD}" \
  -k | jq .
```

Returns your exit IP's geographic information.

---

### 13. Session Persistence

Keep the same IP across multiple requests:

```bash
SESSION_ID="session_$(date +%s)"

curl -s "https://httpbin.org/ip" \
  --proxy brd.superproxy.io:33335 \
  --proxy-user "brd-customer-${BRIGHTDATA_CUSTOMER_ID}-zone-${BRIGHTDATA_ZONE_NAME}-session-${SESSION_ID}:${BRIGHTDATA_ZONE_PASSWORD}" \
  -k | jq .
```

Use the same `session-ID` to maintain IP persistence.

---

## Authentication Methods

### 1. Direct API Access (Bearer Token)

```bash
Authorization: Bearer YOUR_API_KEY
```

Used for: SERP API, Web Scraper API, Dataset API

### 2. Proxy Credentials

```bash
--proxy-user "brd-customer-CUSTOMER_ID-zone-ZONE_NAME:ZONE_PASSWORD"
```

Used for: All proxy types (Residential, Datacenter, ISP, Mobile)

---

## Proxy Username Flags

Add flags to the proxy username for targeting:

| Flag | Example | Description |
|------|---------|-------------|
| `-country-XX` | `-country-us` | Target country |
| `-city-name` | `-city-newyork` | Target city |
| `-state-XX` | `-state-ca` | Target US state |
| `-session-ID` | `-session-abc123` | Session persistence |
| `-ip-X.X.X.X` | `-ip-1.2.3.4` | Specific IP (datacenter) |

---

## Response Handling

### SERP API Response

Returns raw HTML or parsed JSON depending on `format` parameter.

### Web Scraper Response

```json
{
  "snapshot_id": "s_abc123",
  "status": "running"
}
```

### Proxy Response

Returns the target website content as if accessed from the proxy IP.

---

## Guidelines

1. **Choose right proxy type**: Datacenter is fastest/cheapest, Residential has best success rate
2. **Use sessions for stateful scraping**: Keep same IP with `-session-ID` flag
3. **Handle SSL**: Use `-k` flag or install Bright Data SSL certificate
4. **Geo-target appropriately**: Match proxy location to target content
5. **Monitor usage**: Check bandwidth and request counts in control panel
6. **Respect rate limits**: Adjust request frequency based on your plan
