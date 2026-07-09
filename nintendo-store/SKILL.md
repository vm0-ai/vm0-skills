---
name: nintendo-store
description: Nintendo Store APIs for public Nintendo Switch catalog/search/pricing plus connected Nintendo Account profile, play activity, wishlist, points, rights, and Store app data. Use when the user asks about Nintendo eShop, Nintendo Store, Switch game catalog, regional prices, sale prices, NSUIDs, title IDs, Nintendo product metadata, Nintendo Account profile, wishlist, My Nintendo points, or Nintendo play history.
---

# Nintendo Store

Use Nintendo Store for Nintendo Switch catalog/search/pricing and connected Nintendo Account Store app data.

Public catalog and pricing requests do not require a Nintendo Account token. Connected account endpoints require the Nintendo Store connector and `$NINTENDO_STORE_TOKEN`.

## Troubleshooting

Check public catalog availability:

```bash
curl -fsS -G "https://search.nintendo-europe.com/en/select" \
  --data-urlencode "q=*" \
  --data-urlencode "rows=1" \
  --data-urlencode "wt=json" \
  | jq '.response.docs | length'
```

Check the connected account endpoints:

```bash
zero doctor check-connector --env-name NINTENDO_STORE_TOKEN
zero doctor check-connector --url https://api.accounts.nintendo.com/2.0.0/users/me --method GET
zero doctor check-connector --url https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories --method GET
```

## Prerequisites

- Connect Nintendo Store under vm0.ai -> Settings -> Connectors for account-specific data.
- Use `Authorization: Bearer $NINTENDO_STORE_TOKEN` only for connected Nintendo Account endpoints.
- vm0 injects Nintendo Store app headers, including `User-Agent` and `gentry-locale`, for allowed Store app endpoints.
- Public catalog requests are read-only and do not need a token.
- Region and country matter: availability, title IDs, prices, sale windows, currencies, and metadata can differ by market.
- Nintendo response shapes can change. Inspect raw responses before assuming field names.

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

## Store App Endpoints

Use these endpoints with the connected Nintendo Store token when account-specific data or Store app data is required. vm0 injects `Authorization`, `User-Agent`, and `gentry-locale` where needed.

Account:

- `GET https://api.accounts.nintendo.com/2.0.0/users/me`
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/age`
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/family/children`
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/points`
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/push_notification_config`
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/rights`
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/{naid}/qrcode_param`

Play activity:

- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories`
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories/game_titles/{titleId}`
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories/hidden_list`

Wishlist and check-in history:

- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/wishlist`
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/wishlist/{productId}`
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/check_in_histories`
- `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/received_prize_histories`

Store app catalog and metadata:

- `GET https://app-api.znej.nintendo.com/api/v2.0/check_in_events`
- `GET https://app-api.znej.nintendo.com/api/v2.0/check_in_events/{eventId}/check_in_points`
- `GET https://app-api.znej.nintendo.com/api/v2.0/check_in_events/{eventId}/check_in_points/{checkInPointId}`
- `GET https://app-api.znej.nintendo.com/api/v2.0/maintenance_check`
- `GET https://app-api.znej.nintendo.com/api/v2.0/news`
- `GET https://app-api.znej.nintendo.com/api/v2.0/news/app_news/{appNewsId}`
- `GET https://app-api.znej.nintendo.com/api/v2.0/news_tab_config`
- `GET https://app-api.znej.nintendo.com/api/v2.0/notifications`
- `GET https://app-api.znej.nintendo.com/api/v2.0/now`
- `GET https://app-api.znej.nintendo.com/api/v2.0/point_goods_shelves`
- `GET https://app-api.znej.nintendo.com/api/v2.0/search_shelves`
- `GET https://app-api.znej.nintendo.com/api/v2.0/search_shelves/{shelfId}`
- `GET https://app-api.znej.nintendo.com/api/v2.0/shelves/summary`
- `POST https://app-api.znej.nintendo.com/api/v2.0/product_details`
- `POST https://app-api.znej.nintendo.com/api/v2.0/products/-/images:batch_get`
- `POST https://app-api.znej.nintendo.com/api/v2.0/products/-/meta:batch_get`
- `POST https://app-api.znej.nintendo.com/api/v2.0/products:search`

For `POST` product endpoints, use the exact body shape required by Nintendo. If the endpoint returns `400`, inspect the response and adjust the request body instead of guessing fields.

## 1. Search the United States Catalog

Use Nintendo's public Americas Algolia catalog. This example searches the `store_all_products_en_us` index.

```bash
curl -s -X POST "https://U3B6GR4UA3-dsn.algolia.net/1/indexes/store_all_products_en_us/query" \
  --header "Content-Type: application/json" \
  --header "X-Algolia-Application-Id: U3B6GR4UA3" \
  --header "X-Algolia-API-Key: a29c6927638bfd8cee23993e51e721c9" \
  -d '{"query":"zelda","hitsPerPage":10,"page":0}' \
  | jq '.hits[] | {title: (.title // .name), nsuid, url, platform, releaseDate: (.releaseDate // .releaseDateDisplay)}'
```

## 2. Search a Europe Catalog

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

## 3. Fetch Japan Catalog XML

```bash
curl -s "https://www.nintendo.co.jp/data/software/xml/switch.xml" \
  | python3 -c 'import itertools,re,sys; text=sys.stdin.read(); print("\n".join(m.group(0)[:500] for m in itertools.islice(re.finditer(r"<TitleInfo>[\s\S]*?</TitleInfo>", text), 5)))'
```

## 4. Fetch Hong Kong Catalog JSON

```bash
curl -s "https://www.nintendo.com/hk/data/json/switch_software.json" \
  | jq '[.[]? | {title, titleId: (if (.item_code // "") != "" then .item_code else (try (.link | capture("(?<id>[0-9]{14})$").id) catch null) end), product_code, link, price, release_date}] | .[:10]'
```

## 5. Browse Taiwan or Korea

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

## 6. Search Southeast Asia

Use `sg`, `th`, `my`, or `ph`. Southeast Asia search records can include local price fields such as `price`, `current_price`, `sale_flg`, `sdate`, and `pdate`.

```bash
REGION=sg
curl -s "https://search.nintendo.jp/nintendo_soft_${REGION}/search.json" \
  | jq '[.result.items[]? | {title, nsuid, price, current_price, sale_flg, sdate, pdate}] | .[:10]'
```

## 7. Search Australia/New Zealand

```bash
curl -s -X POST "https://FMW57F6ERV-dsn.algolia.net/1/indexes/prod_games/query" \
  --header "Content-Type: application/json" \
  --header "X-Algolia-Application-Id: FMW57F6ERV" \
  --header "X-Algolia-API-Key: c8e4e9f60190ef785d167da77ba0b4fe" \
  -d '{"query":"zelda","hitsPerPage":10,"page":0}' \
  | jq '.hits[] | {title: (.title // .name), fullURL, console, dateTag, classification}'
```

## 8. Fetch Country-Specific Prices

Use title IDs from catalog records. Prices are title-id-specific and country-specific.

```bash
curl -s -G "https://api.ec.nintendo.com/v1/price" \
  --data-urlencode "country=JP" \
  --data-urlencode "ids=70010000000026" \
  --data-urlencode "lang=ja" \
  | jq '.prices[]? | {title_id: (.title_id // .titleId), regular_price, discount_price, sale_start: .discount_price.start_datetime, sale_end: .discount_price.end_datetime}'
```

## 9. Get Nintendo Account Profile

```bash
curl -s "https://api.accounts.nintendo.com/2.0.0/users/me" \
  --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" \
  | jq '{id, nickname, country, language, birthday, mii}'
```

## 10. Get Nintendo Store App Play Activity

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories" \
  --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" \
  | jq .
```

## 11. Summarize Common Play History Fields

Inspect the raw response first. This example handles several common container and field names, but Nintendo may return different shapes.

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories" \
  --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" \
  | jq '
    def histories:
      if type == "array" then .
      elif (.playHistories? | type) == "array" then .playHistories
      elif (.play_histories? | type) == "array" then .play_histories
      elif (.histories? | type) == "array" then .histories
      elif (.items? | type) == "array" then .items
      elif (.data? | type) == "array" then .data
      else [] end;

    histories
    | map({
        title: (.title // .name // .softwareName // .applicationName // .gameTitle),
        titleId: (.titleId // .title_id // .applicationId // .nsuid),
        firstPlayedAt: (.firstPlayedAt // .first_played_at // .firstPlayedDateTime),
        lastPlayedAt: (.lastPlayedAt // .last_played_at // .lastPlayedDateTime),
        totalPlayedMinutes: (.totalPlayedMinutes // .total_played_minutes // .playTimeMinutes),
        totalPlayedDays: (.totalPlayedDays // .total_played_days)
      })
    | .[:20]'
```

## 12. Summarize Recent Daily Play Activity

Use `recentPlayHistories` when the user asks what they played recently or how long they played on each recent day.

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories" \
  --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" \
  | jq '
    (.recentPlayHistories // .recent_play_histories // [])
    | map({
        playedDate: (.playedDate // .played_date),
        games: [
          (.dailyPlayHistories // .daily_play_histories // [])[]
          | {
              title: (.titleName // .title // .name),
              titleId: (.titleId // .title_id // .nsuid),
              totalPlayedMinutes: (.totalPlayedMinutes // .total_played_minutes)
            }
        ]
      })
    | .[:7]'
```

## 13. Get Wishlist, Points, Rights, and Check-In History

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/wishlist" \
  --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" \
  | jq .
```

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/points" \
  --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" \
  | jq .
```

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/rights" \
  --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" \
  | jq .
```

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/check_in_histories" \
  --header "Authorization: Bearer $NINTENDO_STORE_TOKEN" \
  | jq .
```

## Guidelines

1. Pick the public catalog region that matches the requested market, then fetch prices with the matching country code when title IDs are available.
2. Do not infer global availability from one region's catalog result.
3. Use connected Nintendo Store endpoints for account-specific profile, play activity, wishlist, points, rights, and Store app data.
4. Start with raw responses, then adapt parsing to the fields Nintendo returns for the account, region, and endpoint.
5. Treat empty responses as valid API results; inspect raw fields before concluding that no data exists.
