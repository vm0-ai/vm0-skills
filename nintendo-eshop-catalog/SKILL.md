---
name: nintendo-eshop-catalog
description: Public Nintendo eShop catalog, search, metadata, and country pricing data for Nintendo Switch games. Use when user mentions Nintendo eShop, Switch game catalog, Nintendo game prices, regional eShop availability, sale prices, NSUIDs, title IDs, or Nintendo product metadata.
---

# Nintendo eShop Catalog

Use the Nintendo eShop Catalog connector for public Nintendo Switch catalog, search, metadata, and pricing data. This connector does not use Nintendo Account login and does not provide player-specific data such as playtime, owned library, wishlist, friends, purchase history, or Parental Controls data.

## Troubleshooting

If public catalog requests fail, check the connector and one representative public source:

```bash
zero doctor check-connector --url https://api.ec.nintendo.com/v1/price --method GET
zero doctor check-connector --url https://search.nintendo-europe.com/en/select --method GET
```

## Prerequisites

- Enable Nintendo eShop Catalog under vm0.ai -> Settings -> Connectors.
- No API key, OAuth token, Nintendo Account session, or user credential is required.
- Requests are read-only public catalog/search/pricing requests.
- Region and country matter: availability, title IDs, prices, sale windows, currencies, and metadata can differ by market.

Supported catalog regions:

- Americas Algolia locales: `en_us`, `en_ca`, `fr_ca`, `es_mx`, `pt_br`, `es_ar`, `es_cl`, `es_co`, `es_pe`
- Europe language catalogs: `en`, `de`, `fr`, `es`, `it`, `nl`, `pt`
- Japan: `jp`
- Hong Kong: `hk`
- Taiwan: `tw`
- Korea: `kr`
- Southeast Asia: `sg`, `th`, `my`, `ph`
- Australia/New Zealand: `au`, `nz`

Supported price countries:

`US`, `CA`, `MX`, `BR`, `AR`, `CL`, `CO`, `PE`, `JP`, `KR`, `TW`, `HK`, `AU`, `NZ`, `GB`, `ZA`, `DE`, `FR`, `ES`, `IT`, `NL`, `PT`, `BE`, `CH`, `AT`, `DK`, `NO`, `SE`, `FI`, `PL`, `CZ`, `GR`, `HU`, `SK`, `IE`, `MT`, `LU`.

## 1. Search the United States Catalog

Use Nintendo's public Americas Algolia catalog. This example searches the `store_all_products_en_us` index.

```bash
curl -s -X POST "https://U3B6GR4UA3-dsn.algolia.net/1/indexes/store_all_products_en_us/query" \
  --header "Content-Type: application/json" \
  --header "X-Algolia-Application-Id: U3B6GR4UA3" \
  --header "X-Algolia-API-Key: a29c6927638bfd8cee23993e51e721c9" \
  -d '{"query":"zelda","hitsPerPage":10,"page":0}' \
  | jq '.hits[] | {title: (.title // .name), nsuid, product_url, release_date}'
```

## 2. Search a Europe Catalog

Use the language-level Europe/PAL Solr catalog. Use country-specific pricing separately.

```bash
curl -s -G "https://search.nintendo-europe.com/en/select" \
  --data-urlencode "q=zelda" \
  --data-urlencode "rows=10" \
  --data-urlencode "start=0" \
  --data-urlencode "wt=json" \
  | jq '.response.docs[] | {title: (.title // .name), nsuid, url, release_date}'
```

## 3. Fetch Japan Catalog XML

```bash
curl -s "https://www.nintendo.co.jp/data/software/xml/switch.xml" \
  | xmllint --xpath '//*[contains(translate(string(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "zelda")][position() <= 10]' -
```

## 4. Search Taiwan or Korea

```bash
curl -s -G "https://www.nintendo.com/tw/api/search" \
  --data-urlencode "q=zelda" \
  | jq .
```

```bash
curl -s -G "https://www.nintendo.com/kr/api/search" \
  --data-urlencode "q=zelda" \
  | jq .
```

## 5. Search Southeast Asia

Use `sg`, `th`, `my`, or `ph`. Southeast Asia search records can include local price fields such as `price`, `current_price`, `sale_flg`, `sdate`, and `pdate`.

```bash
REGION=sg
curl -s "https://search.nintendo.jp/nintendo_soft_${REGION}/search.json" \
  | jq '[.result.items[]? | select((.title // "" | ascii_downcase) | contains("zelda")) | {title, nsuid, price, current_price, sale_flg, sdate, pdate}] | .[:10]'
```

## 6. Search Australia/New Zealand

```bash
curl -s -X POST "https://FMW57F6ERV-dsn.algolia.net/1/indexes/prod_games/query" \
  --header "Content-Type: application/json" \
  --header "X-Algolia-Application-Id: FMW57F6ERV" \
  --header "X-Algolia-API-Key: c8e4e9f60190ef785d167da77ba0b4fe" \
  -d '{"query":"zelda","hitsPerPage":10,"page":0}' \
  | jq '.hits[] | {title: (.title // .name), url, platform, release_date}'
```

## 7. Fetch Country-Specific Prices

Use title IDs from catalog records. Prices are title-id-specific and country-specific.

```bash
curl -s -G "https://api.ec.nintendo.com/v1/price" \
  --data-urlencode "country=US" \
  --data-urlencode "ids=<title-id-1>,<title-id-2>" \
  --data-urlencode "lang=en" \
  | jq '.prices[]? | {title_id: (.title_id // .titleId), regular_price, discount_price, sale_start, sale_end}'
```

## Guidelines

1. Pick the catalog region that matches the user's requested market, then fetch prices with the matching country code when title IDs are available.
2. Do not infer global availability from one region's catalog result.
3. Use Southeast Asia search price fields for `sg`, `th`, `my`, and `ph`; representative country/title price API calls may return `not_found` for those markets.
4. Keep requests small with explicit search terms, limits, and pagination.
5. Do not claim support for Nintendo Account data, owned games, playtime, wishlist, friends, or purchase history through this connector.
