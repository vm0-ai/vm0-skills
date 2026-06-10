---
name: massive
description: Massive market data API for stocks, options, futures, forex, crypto,
  indices, and reference data. Use when user mentions "Massive", "Polygon.io",
  "Polygon", "market data", "stock prices", "forex", or "crypto prices".
---

# Massive

Use the Massive REST API to retrieve market reference data, historical bars,
snapshots, and trading calendar information.

> Official docs: `https://massive.com/docs/rest/quickstart`

---

## When to Use

Use this skill when you need to:

- Look up stock, forex, crypto, option, future, or index tickers
- Retrieve OHLC bars, previous close data, market snapshots, or market status
- Enrich financial workflows with Massive market reference data

---

## Prerequisites

Connect the **Massive** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name MASSIVE_TOKEN` or `zero doctor check-connector --url "https://api.massive.com/v3/reference/tickers?market=stocks&limit=1" --method GET`

---

## How to Use

### 1. List Stock Tickers

List active stock tickers. Adjust `market`, `active`, and `limit` as needed.

```bash
curl -s "https://api.massive.com/v3/reference/tickers?market=stocks&active=true&limit=10" --header "Authorization: Bearer $MASSIVE_TOKEN" | jq '.results[] | {ticker, name, market, primary_exchange}'
```

Docs: `https://massive.com/docs/rest/stocks/tickers/all-tickers`

### 2. Get Ticker Overview

Replace `<ticker>` with an exchange symbol such as `AAPL`.

```bash
curl -s "https://api.massive.com/v3/reference/tickers/<ticker>" --header "Authorization: Bearer $MASSIVE_TOKEN" | jq '.results | {ticker, name, market, market_cap, sic_description, homepage_url}'
```

Docs: `https://massive.com/docs/rest/stocks/tickers/ticker-overview`

### 3. Get Previous Day OHLC

Replace `<ticker>` with an exchange symbol such as `AAPL`.

```bash
curl -s "https://api.massive.com/v2/aggs/ticker/<ticker>/prev?adjusted=true" --header "Authorization: Bearer $MASSIVE_TOKEN" | jq '.results[] | {open: .o, high: .h, low: .l, close: .c, volume: .v, timestamp: .t}'
```

Docs: `https://massive.com/docs/rest/stocks/aggregates/previous-day-bar`

### 4. Get Historical Daily Bars

Replace `<ticker>`, `<from-date>`, and `<to-date>`. Dates use `YYYY-MM-DD`.

```bash
curl -s "https://api.massive.com/v2/aggs/ticker/<ticker>/range/1/day/<from-date>/<to-date>?adjusted=true&sort=asc&limit=120" --header "Authorization: Bearer $MASSIVE_TOKEN" | jq '.results[] | {date_ms: .t, open: .o, high: .h, low: .l, close: .c, volume: .v}'
```

Docs: `https://massive.com/docs/rest/stocks/aggregates/custom-bars`

### 5. Get Daily Market Summary

Replace `<date>` with a trading date in `YYYY-MM-DD` format.

```bash
curl -s "https://api.massive.com/v2/aggs/grouped/locale/us/market/stocks/<date>?adjusted=true&include_otc=false" --header "Authorization: Bearer $MASSIVE_TOKEN" | jq '.results[:20][] | {ticker: .T, open: .o, high: .h, low: .l, close: .c, volume: .v}'
```

Docs: `https://massive.com/docs/rest/stocks/aggregates/daily-market-summary`

### 6. Get Forex Previous Day OHLC

Replace `<forex-ticker>` with a Massive forex ticker such as `C:EURUSD`.

```bash
curl -s "https://api.massive.com/v2/aggs/ticker/<forex-ticker>/prev?adjusted=true" --header "Authorization: Bearer $MASSIVE_TOKEN" | jq '.results[] | {open: .o, high: .h, low: .l, close: .c, volume: .v, timestamp: .t}'
```

Docs: `https://massive.com/docs/rest/forex/aggregates/previous-day-bar`

### 7. Check Market Status

```bash
curl -s "https://api.massive.com/v1/marketstatus/now" --header "Authorization: Bearer $MASSIVE_TOKEN" | jq '{market, serverTime, exchanges, currencies}'
```

Docs: `https://massive.com/docs/rest/stocks/market-operations/market-status`

---

## Guidelines

1. **Use Bearer auth**: Prefer `Authorization: Bearer $MASSIVE_TOKEN`; Massive also supports `apiKey` query auth, but headers keep keys out of URLs.
2. **Ticker formats vary by asset class**: Stocks use symbols like `AAPL`; forex commonly uses `C:EURUSD`; crypto commonly uses `X:BTCUSD`.
3. **Plan access affects freshness and history**: Free and paid plans differ by recency, history, and supported asset classes.
4. **Paginate when needed**: Many endpoints return `next_url`; fetch it with the same Authorization header.
5. **Use the official docs for endpoint-specific plan limits**: Massive shows plan access, recency, and history on each endpoint page.
