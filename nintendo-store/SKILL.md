---
name: nintendo-store
description: Nintendo Store APIs for public Nintendo Switch catalog/search/pricing plus connected Nintendo Account profile, play activity, wishlist, points, rights, and Store app data. Use when the user asks about Nintendo eShop, Nintendo Store, Switch game catalog, regional prices, sale prices, NSUIDs, title IDs, Nintendo product metadata, Nintendo Account profile, wishlist, My Nintendo points, or Nintendo play history.
---

# Nintendo Store

Use Nintendo Store in two API families:

- Public eShop catalog and pricing: no connector or token required. Use for game search, availability, regional metadata, prices, sale prices, NSUIDs, and title IDs.
- Connected Nintendo Store app and account: requires the Nintendo Store connector and `$NINTENDO_STORE_TOKEN`. Use for Nintendo Account profile, play activity, wishlist, points, rights, check-in history, and Store app data.

## Troubleshooting

Check public catalog availability:

```bash
curl -fsS -G "https://search.nintendo-europe.com/en/select" \
  --data-urlencode "q=*" \
  --data-urlencode "rows=1" \
  --data-urlencode "wt=json" \
  | jq '.response.docs | length'
```

Check connected account access:

```bash
zero doctor check-connector --env-name NINTENDO_STORE_TOKEN
zero doctor check-connector --url https://api.accounts.nintendo.com/2.0.0/users/me --method GET
zero doctor check-connector --url https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories --method GET
```

## Public eShop Catalog and Pricing

Use public catalog and pricing endpoints when the user asks about game search, availability, metadata, prices, sale windows, NSUIDs, or title IDs. Do not send `$NINTENDO_STORE_TOKEN` to these endpoints.

Supported public catalog regions:

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

### Search the United States Catalog

Use Nintendo's public Americas Algolia catalog. This example searches the `store_all_products_en_us` index.

```bash
curl -s -X POST "https://U3B6GR4UA3-dsn.algolia.net/1/indexes/store_all_products_en_us/query" \
  --header "Content-Type: application/json" \
  --header "X-Algolia-Application-Id: U3B6GR4UA3" \
  --header "X-Algolia-API-Key: a29c6927638bfd8cee23993e51e721c9" \
  -d '{"query":"zelda","hitsPerPage":10,"page":0}' \
  | jq '.hits[] | {title: (.title // .name), nsuid, url, platform, releaseDate: (.releaseDate // .releaseDateDisplay)}'
```

### Search a Europe Catalog

Use the language-level Europe/PAL Solr catalog. Use country-specific pricing separately.

```bash
curl -s -G "https://search.nintendo-europe.com/en/select" \
  --data-urlencode "q=*zelda*" \
  --data-urlencode "fq=type:(GAME OR DLC)" \
  --data-urlencode "fq=nsuid_txt:*" \
  --data-urlencode "rows=10" \
  --data-urlencode "start=0" \
  --data-urlencode "wt=json" \
  | jq '.response.docs[] | {title: (.title // .name), nsuid: (.nsuid_txt[0]? // .nsuid), url, type, system_names_txt}'
```

### Fetch Japan Catalog XML

```bash
curl -s "https://www.nintendo.co.jp/data/software/xml/switch.xml" \
  | python3 -c 'import itertools,re,sys; text=sys.stdin.read(); print("\n".join(m.group(0)[:500] for m in itertools.islice(re.finditer(r"<TitleInfo>[\s\S]*?</TitleInfo>", text), 5)))'
```

### Fetch Hong Kong Catalog JSON

```bash
curl -s "https://www.nintendo.com/hk/data/json/switch_software.json" \
  | jq '[.[]? | {title, titleId: (if (.item_code // "") != "" then .item_code else (try (.link | capture("(?<id>[0-9]{14})$").id) catch null) end), product_code, link, price, release_date}] | .[:10]'
```

### Browse Taiwan or Korea

```bash
curl -s -G "https://www.nintendo.com/tw/api/software" \
  --data-urlencode "limit=10" \
  --data-urlencode "offset=0" \
  | jq '[.items[]? | {title, nsuid, releaseDate, hardwareCategory}] | .[:10]'
```

```bash
curl -s -G "https://www.nintendo.com/kr/api/software" \
  --data-urlencode "limit=10" \
  --data-urlencode "offset=0" \
  | jq '[.items[]? | {title, nsuid, releaseDate, hardwareCategory}] | .[:10]'
```

### Search Southeast Asia

Use `sg`, `th`, `my`, or `ph`. Southeast Asia search records can include local price fields such as `price`, `current_price`, `sale_flg`, `sdate`, and `pdate`.

```bash
REGION=sg
curl -s "https://search.nintendo.jp/nintendo_soft_${REGION}/search.json" \
  | jq '[.result.items[]? | {title, nsuid, price, current_price, sale_flg, sdate, pdate}] | .[:10]'
```

### Search Australia/New Zealand

```bash
curl -s -X POST "https://FMW57F6ERV-dsn.algolia.net/1/indexes/prod_games/query" \
  --header "Content-Type: application/json" \
  --header "X-Algolia-Application-Id: FMW57F6ERV" \
  --header "X-Algolia-API-Key: c8e4e9f60190ef785d167da77ba0b4fe" \
  -d '{"query":"zelda","hitsPerPage":10,"page":0}' \
  | jq '.hits[] | {title: (.title // .name), fullURL, console, dateTag, classification}'
```

### Fetch Country-Specific Prices

Use title IDs from catalog records. Prices are title-id-specific and country-specific.

```bash
curl -s -G "https://api.ec.nintendo.com/v1/price" \
  --data-urlencode "country=JP" \
  --data-urlencode "ids=70010000000026" \
  --data-urlencode "lang=ja" \
  | jq '.prices[]? | {title_id: (.title_id // .titleId), regular_price, discount_price, sale_start: .discount_price.start_datetime, sale_end: .discount_price.end_datetime}'
```

## Connected Nintendo Store App and Account

Use connected endpoints when the user asks about account-specific data or data exposed by the Nintendo Store app API. Connect Nintendo Store under vm0.ai -> Settings -> Connectors before calling these endpoints.

- For the special Nintendo Account profile request `GET https://api.accounts.nintendo.com/2.0.0/users/me`, include `X-VM0-Connector-Intent: nintendo-store`.
- Send `Authorization: Bearer $NINTENDO_STORE_TOKEN`.
- vm0 injects Nintendo Store app headers, including `User-Agent` and `gentry-locale`, for allowed Store app endpoints.
- Use `productType=DIGITAL` or `productType=PHYSICAL`. It is required for wishlist reads and optional for product search.
- Start `products:search` at `page=1`. Per-title play history uses `offset=0` instead of page numbers.
- Inspect a raw response before narrowing it with `jq`; the fields below match Nintendo Store Android app 3.2.0.

### Account Endpoints

- `GET https://api.accounts.nintendo.com/2.0.0/users/me` — account profile. Its `id` is the `{naid}` used by the QR-code endpoint.
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/age` — `age`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/family/children` — `children`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/points` — `points` and `expirationPoints`; `points` contains `gold` and `platinum`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/push_notification_config` — `isReceivedAll`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/rights` — `scheduledOrderItem` and `purchasedItem`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/{naid}/qrcode_param` — `userId`, `param`, and `exp`.

### Play Activity Endpoints

- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories` — `playHistories`, `hiddenTitleList`, and `recentPlayHistories`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories/game_titles/{titleId}?offset={offset}&limit={limit}` — aggregate play fields plus `playedDaysOffset` and `playedDays`; each day has `playedDate` and `minutesPlayed`.

### Wishlist and Check-In Endpoints

- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/wishlist?productType={DIGITAL|PHYSICAL}` — `products`. Fetch both product types when the user asks for the complete wishlist.
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/wishlist/{productId}?productType={DIGITAL|PHYSICAL}` — `productId`, `productType`, and `isInWishList`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/check_in_histories` — `checkInHistories`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/received_prize_histories` — `eventIds`.

### Store App Catalog and Metadata Endpoints

Use these connected Store app endpoints for Store app shelves, news, app metadata, check-in events, and product metadata.

- `GET https://app-api.znej.nintendo.com/api/v2.0/check_in_events?latitude={latitude}&longitude={longitude}` — location is optional; the response groups events into `currentRegionCheckInEvents`, `otherRegionsCheckInEvents`, and `upcomingCheckInEvents`. Use an event's `checkInEventId` as `{eventId}`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/check_in_events/{eventId}/check_in_points?page={page}&latitude={latitude}&longitude={longitude}` — `page` and location are optional; the response contains `page` and `checkInPoints`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/maintenance_check` — a successful check has no response body.
- `GET https://app-api.znej.nintendo.com/api/v2.0/news_tab_config` — `lastUpdatedAt` and `newsTabs`; use a returned `tabId` as `newsTabId`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/news?page={page}&newsTabId={tabId}` — both queries are optional; the response contains `page`, `articles`, and `pinnedArticle`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/news/app_news/{appNewsId}` — use `articles[].appNews.id` from the news response; the detail contains `id`, `title`, `publicationBeginAt`, `thumbnailUrl`, `components`, and optional `storeUrl`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/notifications` — `notifications`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/now` — `now`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/point_goods_shelves` — a list of shelves with `title`, `shelfId`, and `products`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/search_shelves` — categories containing `shelves`; use a returned `shelfId` for the detail request.
- `GET https://app-api.znej.nintendo.com/api/v2.0/search_shelves/{shelfId}?page={page}&filterId={filterId}&sortId={sortId}` — start at `page=1`; `filterId` and `sortId` are optional. The response contains `products`, `totalCount`, `hasNextPage`, `filterOptions`, and `sortOptions`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/shelves/summary` — `data` with `shelfId`, `shelfType`, and optional `featuredShelfType`.
- `GET https://app-api.znej.nintendo.com/api/v2.0/products:search?query={query}&page={page}&productType={DIGITAL|PHYSICAL}` — `hits`, `totalCount`, and `hasNextPage`; `productType` is optional.
- `POST https://app-api.znej.nintendo.com/api/v2.0/product_details` — `products`.
- `POST https://app-api.znej.nintendo.com/api/v2.0/products/-/images:batch_get` — `productImages`.
- `POST https://app-api.znej.nintendo.com/api/v2.0/products/-/meta:batch_get` — `products`.

For `POST` product endpoints, write `/tmp/nintendo-store-products.json` with `products`, where each item has `productId` and `productType`:

```json
{
  "products": [
    {
      "productId": "<product-id>",
      "productType": "DIGITAL"
    }
  ]
}
```

### Search Store App Products

```bash
curl -s -G "https://app-api.znej.nintendo.com/api/v2.0/products:search" --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" --data-urlencode "query=zelda" --data-urlencode "page=1" --data-urlencode "productType=DIGITAL" | jq '{hits, totalCount, hasNextPage}'
```

### Fetch Store App Product Details

Use `productId` values from Store app search, shelf, or wishlist responses.

```bash
curl -s -X POST "https://app-api.znej.nintendo.com/api/v2.0/product_details" --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" --header "Content-Type: application/json" -d @/tmp/nintendo-store-products.json | jq '.products'
```

### Get Nintendo Account Profile

```bash
curl -s "https://api.accounts.nintendo.com/2.0.0/users/me" --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" --header "X-VM0-Connector-Intent: nintendo-store" | jq '{id, nickname, country, language, birthday, mii}'
```

Use the profile `id` as `{naid}` when requesting a Store check-in QR parameter. Replace `<naid>` with that value:

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/<naid>/qrcode_param" --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" | jq '{userId, param, exp}'
```

### Get Nintendo Store App Play Activity

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories" --header "Authorization: Bearer $NINTENDO_STORE_TOKEN"
```

### Summarize Play History

The 3.2.0 Store app reads these fields from `playHistories`:

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories" --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" | jq '
    .playHistories
    | map({
        title: .titleName,
        titleId,
        platform,
        firstPlayedAt,
        lastPlayedAt,
        totalPlayedMinutes,
        totalPlayedDays
      })
    | .[:20]'
```

Fetch daily history for a `titleId` returned above. Replace `<title-id>` with that value. For the next page, set `offset` to the returned `playedDaysOffset` plus the number of returned `playedDays`; stop when `playedDays` is empty:

```bash
curl -s -G "https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories/game_titles/<title-id>" --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" --data-urlencode "offset=0" --data-urlencode "limit=16" | jq '{titleId, firstPlayedAt, lastPlayedAt, totalPlayedDays, totalPlayedMinutes, playedDaysOffset, playedDays}'
```

### Summarize Recent Daily Play Activity

Use `recentPlayHistories` when the user asks what they played recently or how long they played on each recent day.

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories" --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" | jq '
    .recentPlayHistories
    | map({
        playedDate,
        games: [
          .dailyPlayHistories[]
          | {
              title: .titleName,
              titleId,
              platform,
              totalPlayedMinutes
            }
        ]
      })
    | .[:7]'
```

### Get Wishlist, Points, Rights, and Check-In History

```bash
curl -s -G "https://app-api.znej.nintendo.com/api/v2.0/users/me/wishlist" --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" --data-urlencode "productType=DIGITAL" | jq '.products'
```

Repeat the wishlist request with `productType=PHYSICAL` when the user asks for all saved products.

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/points" --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" | jq '{points, expirationPoints}'
```

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/rights" --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" | jq '{scheduledOrderItem, purchasedItem}'
```

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/check_in_histories" --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" | jq '.checkInHistories'
```

## Guidelines

1. Pick the API family first: public eShop catalog/pricing for product data; connected Store app/account for user-specific data.
2. Pick the public catalog region that matches the requested market, then fetch prices with the matching country code when title IDs are available.
3. Do not infer global availability from one region's catalog result.
4. Start with raw responses, then adapt parsing to the fields Nintendo returns for the account, region, and endpoint.
5. Treat empty responses as valid API results; inspect raw fields before concluding that no data exists.
