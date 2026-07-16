# PlayStation GraphQL API Reference

Use this reference for persisted GraphQL reads. Read the parent `SKILL.md` first: both GraphQL GET permissions are broad and default denied because the firewall cannot yet match `operationName`, hash, variables, or response fields.

## Contents

- [Request helper](#request-helper)
- [Game library and wishlist](#game-library-and-wishlist)
- [Recently played and Game Help](#recently-played-and-game-help)
- [Search](#search)
- [Store catalog](#store-catalog)
- [Store browsing](#store-browsing)
- [Current web Store query inventory](#current-web-store-query-inventory)
- [Failure handling](#failure-handling)

## Request Helper

Persisted queries use `GET /api/graphql/v1/op` with JSON-encoded query parameters. Define this Bash helper:

```bash
psn_graphql_get() {
  local base="$1"
  local operation="$2"
  local variables="$3"
  local hash="$4"
  local client_name="${5:-}"
  local args=(
    --fail-with-body --silent --show-error --get
    "$base/api/graphql/v1/op"
    --header "Authorization: Bearer $PLAYSTATION_TOKEN"
    --header "Accept: application/json"
    --header "Accept-Language: en-US"
    --data-urlencode "operationName=$operation"
    --data-urlencode "variables=$variables"
    --data-urlencode "extensions={\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"$hash\"}}"
  )

  if [[ -n "$client_name" ]]; then
    args+=(--header "apollographql-client-name: $client_name")
  fi

  curl "${args[@]}"
}
```

Use `PlayStationApp-Android` as the client name for mobile App queries. Leave it empty for ordinary web Store queries. Use `oracle` only for `getProfileOracle`.

Every example must inspect both `.data` and `.errors`:

```bash
response="$(psn_graphql_get \
  "https://m.np.playstation.com" \
  "metGetStoreWishlist" \
  '{}' \
  "571149e8aa4d76af7dd33b92e1d6f8f828ebc5fa8f0f6bf51a8324a0e6d71324" \
  "PlayStationApp-Android")"

jq '{data, errors}' <<<"$response"
```

## Game Library and Wishlist

| Host | Operation | Variables | SHA-256 |
| --- | --- | --- | --- |
| Mobile | `getUserGameList` | `{"categories":"ps4_game,ps5_native_game","limit":100}` | `e0136f81d7d1fb6be58238c574e9a46e1c0cc2f7f6977a08a5a46f224523a004` |
| Web fallback | `getUserGameList` | `{"categories":"ps4_game,ps5_native_game","limit":20}` | `e780a6d8b921ef0c59ec01ea5c5255671272ca0d819edb61320914cf7a78b3ae` |
| Mobile | `getPurchasedGameList` | `{"isActive":true,"platform":["ps4","ps5"],"size":200,"start":0,"sortBy":"ACTIVE_DATE","sortDirection":"desc"}` | `827a423f6a8ddca4107ac01395af2ec0eafd8396fc7fa204aaf9b7ed2eefa168` |
| Mobile | `metGetStoreWishlist` | `{}` | `571149e8aa4d76af7dd33b92e1d6f8f828ebc5fa8f0f6bf51a8324a0e6d71324` |
| Web | `friendsWhoPlayRetrieveByConceptId` | `{"conceptId":"<concept-id>"}` | `7bf9a61a9218dd810c16a7ca930eb7a2576b63b5639e887c62219a467434f9c2` |
| Web, client `oracle` | `getProfileOracle` | `{}` | `fc0d765f537f3dce3e0d91c71e85daa401042ba43066acde9f8f584faced10df` |

Read the mobile game library:

```bash
psn_graphql_get \
  "https://m.np.playstation.com" \
  "getUserGameList" \
  '{"categories":"ps4_game,ps5_native_game","limit":100}' \
  "e0136f81d7d1fb6be58238c574e9a46e1c0cc2f7f6977a08a5a46f224523a004" \
  "PlayStationApp-Android" |
  jq '{games: [.data.gameLibraryTitlesRetrieve.games[]? | {name, platform, lastPlayedDateTime, titleId, conceptId}], errors}'
```

Read the wishlist:

```bash
psn_graphql_get \
  "https://m.np.playstation.com" \
  "metGetStoreWishlist" \
  '{}' \
  "571149e8aa4d76af7dd33b92e1d6f8f828ebc5fa8f0f6bf51a8324a0e6d71324" \
  "PlayStationApp-Android" |
  jq '{wishlist: .data.storeWishlist, errors}'
```

## Recently Played and Game Help

| Operation | Variables | SHA-256 |
| --- | --- | --- |
| `metGetRecentPlayedTitles` | `{"accountId":"<account-id>","count":3,"categories":"ps4_game,ps5_native_game,pspc_game","shouldFetchCodex":true}` | `2fd023209ae806e5ed59c0dc061c1a49fcd51788226d549b1c8cb310be2da9ba` |
| `metGetUserIdentity` | `{}` | `28f8ec8a41384b63fb05bc13e3a2a5aa377ade9ba02d0d0900313cc06c3a9a84` |
| `metGetActivityHelpAvailability` | `{"npTitleIds":["PPSA01325_00"]}` | `bf448c99b8f4fabfa90d71a858ce28afe7112ec95844aa036da4b7bf07d97aaf` |
| `metGetCodexSummary` | `{"npTitleIds":["PPSA01325_00"]}` | `34f529c96d61dd30693bef9cc3b2012aed6b089fb1f22f0e9e091eed6e4d6788` |
| `metGetHintAvailability` | `{"npCommId":"NPWR20188_00","trophyIds":["1","2"]}` | `71bf26729f2634f4d8cca32ff73aaf42b3b76ad1d2f63b490a809b66483ea5a7` |
| `metGetTips` | `{"npCommId":"NPWR20188_00","trophies":[{"trophyId":"1","udsObjectId":"<uds-object-id>","helpType":"HINT"}]}` | `93768752a9f4ef69922a543e2209d45020784d8781f57b37a5294e6e206c5630` |

Game Help can require PlayStation Plus. First call `metGetHintAvailability`; use the returned trophy/help identifiers for `metGetTips` instead of inventing them.

```bash
VARIABLES="$(jq -nc --arg accountId "$PLAYSTATION_ACCOUNT_ID" '{accountId:$accountId,count:3,categories:"ps4_game,ps5_native_game,pspc_game",shouldFetchCodex:true}')"

psn_graphql_get \
  "https://m.np.playstation.com" \
  "metGetRecentPlayedTitles" \
  "$VARIABLES" \
  "2fd023209ae806e5ed59c0dc061c1a49fcd51788226d549b1c8cb310be2da9ba" \
  "PlayStationApp-Android" | jq '{titles: .data.recentPlayedTitlesRetrieve, errors}'
```

## Search

Search uses a context query for the first page and a domain query for continuation. Use the `next` cursor returned by the context page.

| Search | Operation | Context/domain | SHA-256 |
| --- | --- | --- | --- |
| Games first page | `metGetContextSearchResults` | `MobileUniversalSearchGame` | `a2fbc15433b37ca7bfcd7112f741735e13268f5e9ebd5ffce51b85acc126f41d` |
| Games continuation | `metGetDomainSearchResults` | `MobileGames` or `MobileAddOns` | `b51624299bd17b3799f77c9f097cc8887a04d3873f0329095976a841595bc902` |
| Users first page | `metGetContextSearchResults` | `MobileUniversalSearchSocial` | `ac5fb2b82c4d086ca0d272fba34418ab327a7762dd2cd620e63f175bbc5aff10` |
| Users continuation | `metGetDomainSearchResults` | `SocialAllAccounts` | `23ece284bf8bdc50bfa30a4d97fd4d733e723beb7a42dff8c1ee883f8461a2e1` |

First page of full-game search:

```bash
TERM="Astro Bot"
VARIABLES="$(jq -nc --arg term "$TERM" '{searchTerm:$term,searchContext:"MobileUniversalSearchGame",displayTitleLocale:"en-US"}')"

psn_graphql_get \
  "https://m.np.playstation.com" \
  "metGetContextSearchResults" \
  "$VARIABLES" \
  "a2fbc15433b37ca7bfcd7112f741735e13268f5e9ebd5ffce51b85acc126f41d" \
  "PlayStationApp-Android" | jq '{results: .data.universalContextSearch.results, errors}'
```

## Store Catalog

These verified catalog operations use the web host and `playstation-graphql-games-read`. Sony's operation name `Retrive` is intentionally misspelled.

| Operation | Variables | SHA-256 |
| --- | --- | --- |
| `metGetProductById` | `{"productId":"<product-id>"}` | `a128042177bd93dd831164103d53b73ef790d56f51dae647064cb8f9d9fc9d1a` |
| `metGetConceptById` | `{"conceptId":"<concept-id>","productId":""}` | `cc90404ac049d935afbd9968aef523da2b6723abfb9d586e5f77ebf7c5289006` |
| `metGetPricingDataByConceptId` | `{"conceptId":"<concept-id>"}` | `abcb311ea830e679fe2b697a27f755764535d825b24510ab1239a4ca3092bd09` |
| `wcaProductStarRatingRetrive` | `{"productId":"<product-id>"}` | `cedd370c39e89da20efa7b2e55710e88cb6e6843cc2f8203f7e73ba4751e7253` |
| `wcaConceptStarRatingRetrive` | `{"conceptId":"<concept-id>"}` | `e12dc5cef72296a437b4d71e0b130010bf3707ab981b585ba00d1d5773ce2092` |
| `metGetAddOnsByTitleId` | `{"npTitleId":"<np-title-id>","pageArgs":{"size":50,"offset":0}}` | `e98d01ff5c1854409a405a5f79b5a9bcd36a5c0679fb33f4e18113c157d4d916` |
| `categoryGridRetrieve` | category, paging, sorting, filters, facets | `4ce7d410a4db2c8b635a48c1dcec375906ff63b19dadd87e073f8fd0c0481d35` |
| `conceptRetrieveForContentRating` | `{"conceptId":"<concept-id>"}` | `b504e0bc68af3dc08bc56c0001b27da26ed15d70827420f80805b2d031a95aa8` |
| `conceptRetrieveForMedia` | `{"conceptId":"<concept-id>"}` | `615a2c4618229aa2f11c10fe497eaf4fdc151e4dcc0b6b82e154aeacb0123c2d` |
| `conceptRetrieveForCompatibilityNotices` | `{"conceptId":"<concept-id>"}` | `fb1a981a21d7a00ba72bd79d3998044d77207687a5aa1d3a17d90d7b7f3acb05` |
| `wcaConceptRetrieveForLegalText` | `{"conceptId":"<concept-id>"}` | `b4c35dd0b4ec1541041699ac77e0f607d510d9b2b1e4ad9d2e743e1727f5aeb8` |
| `conceptRetrieveForCtasWithPrice` | `{"conceptId":"<concept-id>"}` | `eab9d873f90d4ad98fd55f07b6a0a606e6b3925f2d03b70477234b79c1df30b5` |
| `conceptRetrieveForGameInfo` | `{"conceptId":"<concept-id>"}` | `156bf37e6d6091b4d584ebf5f430a65e818b6120525dd82a0745352d21619da6` |
| `conceptRetrieveForAccessibilityFeatures` | `{"conceptId":"<concept-id>"}` | `5ad27cf7d1f053068dabf46cc131518a7b7d686e9d64daa1a500d8faab0444c2` |
| `conceptRetrieveForMediaCarousel` | `{"conceptId":"<concept-id>"}` | `404d96e0672728c19708b6519bcdc1427c5270ce76d9cb009cca39b8e68ace7b` |
| `conceptRetrieveForUpsellWithCtas` | `{"conceptId":"<concept-id>"}` | `278822e6c6b9f304e4c788867b3e8a448c67847ac932d09213d5085811be3a18` |
| `metGetConceptByProductIdQuery` | `{"productId":"<product-id>"}` | `0a4c9f3693b3604df1c8341fdc3e481f42eeecf961a996baaa65e65a657a6433` |
| `getAddOnProductsByConcept` | `{"conceptId":"<concept-id>","pageArgs":{"size":50,"offset":0}}` | `23c26f5664dfee6d0a88183f4a6ba624b5d7ad082cf1768fb1c0b7c17b8a477e` |
| `featuresRetrieve` | `{"tierLabel":"TIER_10"}`; use `TIER_20` or `TIER_30` for higher tiers | `010870e8b9269c5bcf06b60190edbf5229310d8fae5b86515ad73f05bd11c4d1` |

Example concept details:

```bash
CONCEPT_ID="10001130"
VARIABLES="$(jq -nc --arg conceptId "$CONCEPT_ID" '{conceptId:$conceptId,productId:""}')"

psn_graphql_get \
  "https://web.np.playstation.com" \
  "metGetConceptById" \
  "$VARIABLES" \
  "cc90404ac049d935afbd9968aef523da2b6723abfb9d586e5f77ebf7c5289006" | jq '{concept: .data.conceptRetrieve, errors}'
```

## Store Browsing

These verified mobile EMS queries require `PlayStationApp-Android`.

| Operation | Variables | SHA-256 |
| --- | --- | --- |
| `metGetExperience` | `{"clientId":"b6de8d4d-bf9b-11ee-ad2a-aea73dc1ea43"}` | `054e61ee68bbeadc21435caebcc4f2bba0919a99b06629d141b0b82dc55f10c4` |
| `metGetViews` | `{"viewInputs":[{"viewId":"<view-id>","experienceId":"<experience-id>"}]}` | `6fd98ff7fecb603006fb5d92db176d5028435be163c8d1ee9f7c598ab4677dd1` |
| `metGetDefaultView` | category, localized key, and experience IDs | `bec1b8a3b0bae8c08e3ce2c7fe2f38a69343434ccfbcdd82cc1f2e44f86b7c40` |
| `metGetCategoryGrid` | `{"id":"<category-id>","pageArgs":{"size":50,"offset":0}}` | `b67a9e4414b80d8d762bf12a588c6125467ae0bb3bbe3cee3f7696c6984f8ef6` |
| `metGetCategoryStrands` | `{"strands":[{"id":"<strand-id>","pageArgs":{"size":10,"offset":0}}]}` | `55ab5f168bec56f8362b5519f59faaf786d4e1cfeabb8bc969d6a65545e14f4d` |

The EMS client ID can rotate. If `metGetExperience` fails, derive the current ID from the Store's server-rendered Apollo cache instead of guessing.

## Current Web Store Query Inventory

The current first-party Store contains these additional query families on the same web GET transport. Use them only with a current first-party persisted document, exact hash, and matching variable contract. The firewall route supports them, but an operation name alone is not a callable contract.

- Product/concept slices: `conceptRetrieveForGameTitle`, `productRetrieveForGameTitle`, `productRetrieveForGameInfo`, `productRetrieveForMedia`, `productRetrieveForMediaCarousel`, `productRetrieveForContentRating`, `productRetrieveForCompatibilityNotices`, `productRetrieveForAccessibilityFeatures`, `productRetrieveForCtasWithPrice`, `productRetrieveForUpsellWithCtas`, `productRetrieveForPhysicalMetedata`, `wcaProductRetrieveForLegalText`.
- Editions and add-ons: `wcaConceptEditionsRetrive`, `wcaProductEditionsRetrive`, `getAddOnProductsByProductId`.
- Friends and personalization: `friendsWhoPlayRetrieveByProductId`, `personalizedComponentsRetrieve`, `wcaPlatformVariantsRetrive`.
- Reviews: `wcaConceptReviewListRetrieve`, `wcaProductReviewListRetrieve`, `wcaProductUserReviewRetrieveByConceptId`, `wcaProductUserReviewRetrieveByProductId`, `wcaRateableProductRetrieveByConceptId`, `wcaRateableProductRetrieveByProductId`, `retrieveReportReasons`.
- Browse and resolution: `getExperience`, `getExperienceId`, `getNavTree`, `getView`, `getDefaultView`, `categoryGridRetrieve`, `categoryStrandRetrieve`, `getSearchResults`, `getResolvedProduct`.
- Subscription and discount views: `discountRetrieve`, `getSubscriptions`, `getUserSubscriptions`, `queryOracleUserProfileFullSubscription`, `tierSelectorFullRetrieve`.
- Wishlist membership: `wcaRetrieveWishlist`.

Do not use old transaction-history or cart hashes. The old REST transaction endpoint is decommissioned, and a complete current cart/paid-checkout contract is not supported.

## Failure Handling

- `PersistedQueryNotFound`: the hash rotated or the operation is registered on another host/client schema. Re-derive it from a current first-party document.
- `Cannot query field`: verify the host and client-name header. `getProfileOracle` specifically needs `oracle`.
- HTTP 200 with `.errors`: treat it as failure unless the requested data is also present and the error is understood.
- HTTP 401: refresh the connector instead of replaying the same token.
- HTTP 403 HTML: the edge blocked the request or requires a browser session; do not retry as another mutation.
- HTTP 403 JSON: respect privacy, subscription, or authorization restrictions.
