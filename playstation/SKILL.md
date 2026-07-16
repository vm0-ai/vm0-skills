---
name: playstation
description: Use PlayStation Network APIs for profiles, presence, friends, games, trophies, Store catalog and wishlist, entitlements, subscriptions, devices, captures, groups, messages, notifications, party sessions, and explicitly confirmed mutations. Use when the user mentions PlayStation, PSN, PS4, PS5, PlayStation Store, trophies, friends, captures, wishlist, reviews, or adding an eligible game to the library.
---

# PlayStation

Use PlayStation Network consumer APIs through the vm0 PlayStation connector.

These are undocumented consumer endpoints rather than a stable public API. Use only an account the user is authorized to control and follow applicable PlayStation terms. Expect persisted-query hashes and response shapes to change. Never guess a write endpoint, retry a mutation blindly, or describe a partially verified operation as guaranteed.

## Safety

- Treat every write as externally visible account activity.
- Run a mutation only when the user explicitly requests its exact effect. Show the target account, group, product, SKU, rating, or review before sending it.
- Read current state first, send one request, inspect the response, and re-read state before retrying. A transport error after sending does not prove the mutation failed.
- Never use `backgroundPurchase` for a priced SKU. Use it only for a verified zero-price or entitlement-backed `BACKGROUND_PURCHASE` or `BACKGROUND_PURCHASE_AND_DOWNLOAD` action.
- Do not claim paid checkout support. Cart, payment instrument, tax, confirmation, and paid-order contracts are unavailable.
- Before adding or modifying a review, separately require explicit agreement to the current review terms. Never infer agreement or silently send `agreeToTermsAndConditions: true`.
- Treat `DELETE .../friends/{accountId}` as declining an incoming request or unfriending according to current relationship state. Read the relationship first.
- Do not expose or persist private account records, messages, capture URLs, notification payloads, or device identifiers unless requested.
- Shared GraphQL permissions are broad and default denied because the firewall matches only host, method, and path, not operation name, hash, query parameters, or body.

## Setup

Connect PlayStation under vm0.ai -> Settings -> Connectors. Use `$PLAYSTATION_TOKEN` only on authenticated PlayStation hosts. Use `$PLAYSTATION_ACCOUNT_ID` and `$PLAYSTATION_ONLINE_ID` when available.

| Alias | Host | Authentication |
| --- | --- | --- |
| `M` | `https://m.np.playstation.com` | Bearer |
| `C` | `https://us-prof.np.community.playstation.net` | Bearer |
| `W` | `https://web.np.playstation.com` | Bearer |
| `D` | `https://dms.api.playstation.com` | Bearer |
| `A` | `https://accounts.api.playstation.com` | Bearer |
| `P` | `https://mobile-pushcl.np.communication.playstation.net` | Bearer |
| `T` | `https://theia.dl.playstation.net` | None |
| `S` | `https://static-resource.np.community.playstation.net` | None |
| `B` | `https://blog.playstation.com` and regional blog hosts | None |

Install `curl` and `jq`, then define helpers:

```bash
M="https://m.np.playstation.com"
C="https://us-prof.np.community.playstation.net"
W="https://web.np.playstation.com"
D="https://dms.api.playstation.com"
A="https://accounts.api.playstation.com"
P="https://mobile-pushcl.np.communication.playstation.net"

psn() {
  local method="$1"
  local url="$2"
  shift 2
  curl --fail-with-body --silent --show-error \
    --request "$method" "$url" \
    --header "Authorization: Bearer $PLAYSTATION_TOKEN" \
    --header "Accept: application/json" \
    --header "Accept-Language: en-US" \
    "$@"
}

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

psn_store_post() {
  local operation="$1"
  local variables="$2"
  local hash="$3"
  jq -nc \
    --arg operationName "$operation" \
    --argjson variables "$variables" \
    --arg hash "$hash" \
    '{operationName:$operationName,variables:$variables,extensions:{persistedQuery:{version:1,sha256Hash:$hash}}}' |
    psn POST "$W/api/graphql/v1/op" \
      --header "X-Psn-Store-Locale-Override: en-US" \
      --header "DISABLE_QUERY_WHITELIST: false" \
      --header "Content-Type: application/json" \
      --data-binary @-
}
```

Never send the bearer token to `T`, `S`, or `B`. Diagnose connector failures before changing requests:

```bash
zero doctor check-connector --env-name PLAYSTATION_TOKEN
zero doctor check-connector --env-name PLAYSTATION_ACCOUNT_ID
zero doctor check-connector --url "$M/api/userProfile/v1/internal/users/$PLAYSTATION_ACCOUNT_ID/profiles" --method GET
```

## Firewall Permissions

`Allow` is enabled by default. `Deny` requires an explicit permission grant.

| Permission | Default | Capability |
| --- | --- | --- |
| `playstation-profile-read` | Allow | Profiles, presence, batch lookup, appear-offline state, share links, eligibility |
| `playstation-games-read` | Allow | Played titles and playtime |
| `playstation-trophies-read` | Allow | Trophy summaries, titles, groups, lists, individual trophies, appearance |
| `playstation-search-read` | Allow | REST universal search |
| `playstation-legacy-profile-read` | Allow | Legacy rich profile lookup |
| `playstation-store-catalog-read` | Allow | Title-to-concept mapping |
| `playstation-operational-metadata-read` | Allow | App config, variants, stickers, blog |
| `playstation-social-read` | Deny | Friends, requests, blocks, relationships, available-to-play |
| `playstation-graphql-games-read` | Deny | Shared web GraphQL GET transport |
| `playstation-devices-read` | Deny | Registered devices |
| `playstation-account-private-read` | Deny | Full private account record |
| `playstation-entitlements-read` | Deny | Entitlement ledger |
| `playstation-subscriptions-read` | Deny | Subscription state |
| `playstation-console-storage-read` | Deny | Console storage and installed titles |
| `playstation-media-read` | Deny | Cloud captures and signed URLs |
| `playstation-messaging-read` | Deny | Groups, DMs, history, resources, reactions |
| `playstation-sessions-read` | Deny | Party invitations and open sessions |
| `playstation-notifications-read` | Deny | Notification inbox |
| `playstation-push-notifications-read` | Deny | Push-server discovery |
| `playstation-personalization-read` | Deny | Explore hub, follows, betas, stories |
| `playstation-mobile-graphql-read` | Deny | Shared mobile GraphQL GET transport |
| `playstation-social-write` | Deny | Accept or decline requests and remove friends |
| `playstation-messaging-write` | Deny | Modify groups, members, messages, resources |
| `playstation-store-graphql-post` | Deny | Wishlist, eligible claims, ratings, reviews, votes, reports |

## REST Reads

Use the host alias in the first column. Query only fields needed for the task and paginate with modest `limit` and `offset` values.

### Profiles and Social Data

| Host | Request | Purpose |
| --- | --- | --- |
| M | `GET /api/userProfile/v1/internal/users/{accountId}/profiles` | Lean profile; this path requires a numeric ID |
| M | `GET /api/userProfile/v1/internal/users/profiles?accountIds=id1,id2` | Batch profiles |
| M | `GET /api/userProfile/v1/internal/users/{accountId}/basicPresences?type=primary` | v1 presence |
| M | `GET /api/userProfile/v2/internal/users/{accountId}/basicPresences` | Current presence |
| M | `GET /api/userProfile/v2/internal/users/basicPresences?accountIds=id1,id2` | Batch presence |
| M | `GET /api/userProfile/v1/internal/users/me/userSettings/appearOffline` | Appear-offline state |
| M | `GET /api/cpss/v1/share/profile/{accountId}` | Shareable profile |
| M | `GET /api/cpss/v1/eligibilityCheck/batch` | Social and session eligibility |
| C | `GET /userProfile/v1/users/{onlineId}/profile2?fields=...` | Rich legacy profile |
| M | `GET /api/userProfile/v1/internal/users/{accountId}/friends` | v1 friends |
| M | `GET /api/userProfile/v2/internal/users/{accountId}/friends` | Current friends |
| M | `GET /api/userProfile/v1/internal/users/{accountId}/friends/receivedRequests` | Incoming requests; use `me` |
| M | `GET /api/userProfile/v1/internal/users/{accountId}/blocks` | Block list; use `me` |
| M | `GET /api/userProfile/v1/internal/users/me/friends/{accountId}/summary` | Current relationship |
| M | `GET /api/userProfile/v1/internal/users/{accountId}/friends/{friendId}/summary` | Two-account relationship |
| M | `GET /api/userProfile/v1/internal/users/me/friends/subscribing/availableToPlay` | Available-to-play state |

Resolve an online ID through universal search. Although the transport is POST, this permission is read-only:

```bash
SEARCH_TERM="target-online-id"
jq -nc --arg term "$SEARCH_TERM" \
  '{searchTerm:$term,domainRequests:[{domain:"SocialAllAccounts"}]}' |
  psn POST "$M/api/search/v1/universalSearch" \
    --header "Content-Type: application/json" \
    --data-binary @- | jq .
```

### Games, Account Data, and Trophies

| Host | Request | Purpose |
| --- | --- | --- |
| M | `GET /api/gamelist/v2/users/{accountId}/titles` | Played titles and playtime |
| M | `GET /api/catalog/v2/titles/{npTitleId}/concepts` | Store concept mapping |
| M | `GET /api/entitlement/v2/users/me/internal/entitlements` | Ownership and reward ledger |
| M | `GET /api/subscriptions/v2/users/me/services/pssubscriptions` | PS Plus and partner subscriptions |
| M | `GET /api/cloudAssistedNavigation/v2/users/me/clients` | Console storage and installed titles |
| D | `GET /api/v1/devices/accounts/{accountId}` | Registered devices |
| A | `GET /api/v1/accounts/me` | Full private account record; narrow output immediately |
| M | `GET /api/trophy/v1/users/{accountId}/trophySummary` | Trophy summary |
| M | `GET /api/trophy/v1/users/{accountId}/trophyTitles` | Trophy titles |
| M | `GET /api/trophy/v1/users/{accountId}/titles/trophyTitles` | Progress for up to five `npTitleIds` |
| M | `GET /api/trophy/v1/npCommunicationIds/{npCommId}/trophyGroups` | Group definitions |
| M | `GET /api/trophy/v1/users/{accountId}/npCommunicationIds/{npCommId}/trophyGroups` | User progress by group |
| M | `GET /api/trophy/v1/npCommunicationIds/{npCommId}/trophyGroups/{groupId}/trophies` | Trophy definitions |
| M | `GET /api/trophy/v1/users/{accountId}/npCommunicationIds/{npCommId}/trophyGroups/{groupId}/trophies` | Earned status |
| M | `GET /api/trophy/v1/npCommunicationIds/{npCommId}/trophies/{trophyId}` | One trophy definition |
| M | `GET /api/trophy/v1/users/{accountId}/npCommunicationIds/{npCommId}/trophies/{trophyId}` | One user's trophy |
| M | `GET /api/trophy/v1/users/me/npCommunicationIds/{npCommId}/appearanceSetting` | Appearance setting |

Use `npServiceName=trophy2` for PS5 and `npServiceName=trophy` for PS3, PS4, and PS Vita where required.

### Captures, Messaging, Sessions, and Notifications

| Host | Request | Purpose |
| --- | --- | --- |
| M | `GET /api/gameMediaService/v2/c2s/category/cloudMediaGallery/ugcType/all` | Capture list; follow `nextCursorMark` until `-1` |
| M | `GET /api/gameMediaService/v2/c2s/content` | Capture metadata |
| M | `GET /api/gameMediaService/v2/c2s/ugc/{ugcId}/url` | Signed asset URL |
| M | `GET /api/gamingLoungeGroups/v1/members/me/groups` | Groups and DMs |
| M | `GET /api/gamingLoungeGroups/v1/members/me/groups/{groupId}` | Group detail and main thread |
| M | `GET /api/gamingLoungeGroups/v1/members/me/groups/{groupId}/threads/{threadId}/messages` | Message history; continue with `before=next` |
| M | `GET /api/gamingLoungeGroups/v1/groups/{groupId}/resources/{resourceId}` | Attachment |
| M | `GET /api/gamingLoungeGroups/v1/reactions/mobile-v1/definitions` | Reactions |
| M | `GET /api/userNotificationManager/v1/users/me/notifications` | Notifications |
| M | `GET /api/sessionManager/v2/users/me/partySessionsInvitations` | Party invitations |
| M | `GET /api/gamingLoungeGroups/v1/members/me/groups/openPartySessions` | Open party sessions |
| M | `GET /api/explore/v2/users/me/hub` | Personalized Explore hub |
| P | `GET /np/serveraddr?version=3.0&fields=keepAliveStatus&keepAliveStatusType=6` | Push-server discovery only |

Gaming Lounge requests require `Accept-Language`. Download returned capture CDN URLs without the PlayStation bearer token.

### Operational and Public Data

| Request | Authentication | Purpose |
| --- | --- | --- |
| `GET $M/api/univex/v3/platforms/mobile/variants` | Bearer | Experiment assignments |
| `GET https://theia.dl.playstation.net/metropolis/config/{path}` | None | App configuration |
| `GET https://static-resource.np.community.playstation.net/sticker/{path}` | None | Sticker indexes |
| `GET https://blog.playstation.com/wp-json/wp/v2/{path}` | None | Blog API |
| `GET https://{region}.blog.playstation.com/wp-json/wp/v2/{path}` | None | Regional blog API |

## Persisted GraphQL Reads

Use GET `/api/graphql/v1/op`. Pass `PlayStationApp-Android` as the client name for mobile operations, no client name for ordinary web Store operations, and `oracle` only for `getProfileOracle`. Inspect both `.data` and `.errors`.

### Games, Wishlist, Recent Activity, and Game Help

| Host/client | Operation | Variables | SHA-256 |
| --- | --- | --- | --- |
| M/App | `getUserGameList` | `{"categories":"ps4_game,ps5_native_game","limit":100}` | `e0136f81d7d1fb6be58238c574e9a46e1c0cc2f7f6977a08a5a46f224523a004` |
| W | `getUserGameList` | `{"categories":"ps4_game,ps5_native_game","limit":20}` | `e780a6d8b921ef0c59ec01ea5c5255671272ca0d819edb61320914cf7a78b3ae` |
| M/App | `getPurchasedGameList` | `{"isActive":true,"platform":["ps4","ps5"],"size":200,"start":0,"sortBy":"ACTIVE_DATE","sortDirection":"desc"}` | `827a423f6a8ddca4107ac01395af2ec0eafd8396fc7fa204aaf9b7ed2eefa168` |
| M/App | `metGetStoreWishlist` | `{}` | `571149e8aa4d76af7dd33b92e1d6f8f828ebc5fa8f0f6bf51a8324a0e6d71324` |
| W | `friendsWhoPlayRetrieveByConceptId` | `{"conceptId":"<concept-id>"}` | `7bf9a61a9218dd810c16a7ca930eb7a2576b63b5639e887c62219a467434f9c2` |
| W/oracle | `getProfileOracle` | `{}` | `fc0d765f537f3dce3e0d91c71e85daa401042ba43066acde9f8f584faced10df` |
| M/App | `metGetRecentPlayedTitles` | `{"accountId":"<id>","count":3,"categories":"ps4_game,ps5_native_game,pspc_game","shouldFetchCodex":true}` | `2fd023209ae806e5ed59c0dc061c1a49fcd51788226d549b1c8cb310be2da9ba` |
| M/App | `metGetUserIdentity` | `{}` | `28f8ec8a41384b63fb05bc13e3a2a5aa377ade9ba02d0d0900313cc06c3a9a84` |
| M/App | `metGetActivityHelpAvailability` | `{"npTitleIds":["<np-title-id>"]}` | `bf448c99b8f4fabfa90d71a858ce28afe7112ec95844aa036da4b7bf07d97aaf` |
| M/App | `metGetCodexSummary` | `{"npTitleIds":["<np-title-id>"]}` | `34f529c96d61dd30693bef9cc3b2012aed6b089fb1f22f0e9e091eed6e4d6788` |
| M/App | `metGetHintAvailability` | `{"npCommId":"<id>","trophyIds":["1","2"]}` | `71bf26729f2634f4d8cca32ff73aaf42b3b76ad1d2f63b490a809b66483ea5a7` |
| M/App | `metGetTips` | `{"npCommId":"<id>","trophies":[{"trophyId":"1","udsObjectId":"<id>","helpType":"HINT"}]}` | `93768752a9f4ef69922a543e2209d45020784d8781f57b37a5294e6e206c5630` |

Game Help can require PlayStation Plus. Call `metGetHintAvailability` before `metGetTips`; never invent returned identifiers.

### Search

Use the `next` cursor from the context operation for the domain continuation.

| Search | Operation | Context/domain | SHA-256 |
| --- | --- | --- | --- |
| Games first page | `metGetContextSearchResults` | `MobileUniversalSearchGame` | `a2fbc15433b37ca7bfcd7112f741735e13268f5e9ebd5ffce51b85acc126f41d` |
| Games continuation | `metGetDomainSearchResults` | `MobileGames` or `MobileAddOns` | `b51624299bd17b3799f77c9f097cc8887a04d3873f0329095976a841595bc902` |
| Users first page | `metGetContextSearchResults` | `MobileUniversalSearchSocial` | `ac5fb2b82c4d086ca0d272fba34418ab327a7762dd2cd620e63f175bbc5aff10` |
| Users continuation | `metGetDomainSearchResults` | `SocialAllAccounts` | `23ece284bf8bdc50bfa30a4d97fd4d733e723beb7a42dff8c1ee883f8461a2e1` |

Context variables include `searchTerm`, the table's `searchContext`, and `displayTitleLocale:"en-US"`. Continuation variables include `searchTerm`, the returned cursor, and the table's domain.

### Store Catalog and Browsing

Sony's operation name `Retrive` is intentionally misspelled.

| Host/client | Operation | Variables | SHA-256 |
| --- | --- | --- | --- |
| W | `metGetProductById` | `{"productId":"<product-id>"}` | `a128042177bd93dd831164103d53b73ef790d56f51dae647064cb8f9d9fc9d1a` |
| W | `metGetConceptById` | `{"conceptId":"<concept-id>","productId":""}` | `cc90404ac049d935afbd9968aef523da2b6723abfb9d586e5f77ebf7c5289006` |
| W | `metGetPricingDataByConceptId` | `{"conceptId":"<concept-id>"}` | `abcb311ea830e679fe2b697a27f755764535d825b24510ab1239a4ca3092bd09` |
| W | `wcaProductStarRatingRetrive` | `{"productId":"<product-id>"}` | `cedd370c39e89da20efa7b2e55710e88cb6e6843cc2f8203f7e73ba4751e7253` |
| W | `wcaConceptStarRatingRetrive` | `{"conceptId":"<concept-id>"}` | `e12dc5cef72296a437b4d71e0b130010bf3707ab981b585ba00d1d5773ce2092` |
| W | `metGetAddOnsByTitleId` | `{"npTitleId":"<id>","pageArgs":{"size":50,"offset":0}}` | `e98d01ff5c1854409a405a5f79b5a9bcd36a5c0679fb33f4e18113c157d4d916` |
| W | `categoryGridRetrieve` | category, paging, sorting, filters, facets | `4ce7d410a4db2c8b635a48c1dcec375906ff63b19dadd87e073f8fd0c0481d35` |
| W | `conceptRetrieveForContentRating` | `{"conceptId":"<concept-id>"}` | `b504e0bc68af3dc08bc56c0001b27da26ed15d70827420f80805b2d031a95aa8` |
| W | `conceptRetrieveForMedia` | `{"conceptId":"<concept-id>"}` | `615a2c4618229aa2f11c10fe497eaf4fdc151e4dcc0b6b82e154aeacb0123c2d` |
| W | `conceptRetrieveForCompatibilityNotices` | `{"conceptId":"<concept-id>"}` | `fb1a981a21d7a00ba72bd79d3998044d77207687a5aa1d3a17d90d7b7f3acb05` |
| W | `wcaConceptRetrieveForLegalText` | `{"conceptId":"<concept-id>"}` | `b4c35dd0b4ec1541041699ac77e0f607d510d9b2b1e4ad9d2e743e1727f5aeb8` |
| W | `conceptRetrieveForCtasWithPrice` | `{"conceptId":"<concept-id>"}` | `eab9d873f90d4ad98fd55f07b6a0a606e6b3925f2d03b70477234b79c1df30b5` |
| W | `conceptRetrieveForGameInfo` | `{"conceptId":"<concept-id>"}` | `156bf37e6d6091b4d584ebf5f430a65e818b6120525dd82a0745352d21619da6` |
| W | `conceptRetrieveForAccessibilityFeatures` | `{"conceptId":"<concept-id>"}` | `5ad27cf7d1f053068dabf46cc131518a7b7d686e9d64daa1a500d8faab0444c2` |
| W | `conceptRetrieveForMediaCarousel` | `{"conceptId":"<concept-id>"}` | `404d96e0672728c19708b6519bcdc1427c5270ce76d9cb009cca39b8e68ace7b` |
| W | `conceptRetrieveForUpsellWithCtas` | `{"conceptId":"<concept-id>"}` | `278822e6c6b9f304e4c788867b3e8a448c67847ac932d09213d5085811be3a18` |
| W | `metGetConceptByProductIdQuery` | `{"productId":"<product-id>"}` | `0a4c9f3693b3604df1c8341fdc3e481f42eeecf961a996baaa65e65a657a6433` |
| W | `getAddOnProductsByConcept` | `{"conceptId":"<id>","pageArgs":{"size":50,"offset":0}}` | `23c26f5664dfee6d0a88183f4a6ba624b5d7ad082cf1768fb1c0b7c17b8a477e` |
| W | `featuresRetrieve` | `{"tierLabel":"TIER_10"}` | `010870e8b9269c5bcf06b60190edbf5229310d8fae5b86515ad73f05bd11c4d1` |
| M/App | `metGetExperience` | `{"clientId":"b6de8d4d-bf9b-11ee-ad2a-aea73dc1ea43"}` | `054e61ee68bbeadc21435caebcc4f2bba0919a99b06629d141b0b82dc55f10c4` |
| M/App | `metGetViews` | `{"viewInputs":[{"viewId":"<id>","experienceId":"<id>"}]}` | `6fd98ff7fecb603006fb5d92db176d5028435be163c8d1ee9f7c598ab4677dd1` |
| M/App | `metGetDefaultView` | category, localized key, experience IDs | `bec1b8a3b0bae8c08e3ce2c7fe2f38a69343434ccfbcdd82cc1f2e44f86b7c40` |
| M/App | `metGetCategoryGrid` | `{"id":"<category-id>","pageArgs":{"size":50,"offset":0}}` | `b67a9e4414b80d8d762bf12a588c6125467ae0bb3bbe3cee3f7696c6984f8ef6` |
| M/App | `metGetCategoryStrands` | `{"strands":[{"id":"<id>","pageArgs":{"size":10,"offset":0}}]}` | `55ab5f168bec56f8362b5519f59faaf786d4e1cfeabb8bc969d6a65545e14f4d` |

The EMS client ID can rotate. Derive a current ID from first-party Store data rather than guessing.

The web GET transport also covers these current query families. Call one only with a current first-party persisted document, exact hash, and matching variables:

- Product and concept slices: `conceptRetrieveForGameTitle`, `productRetrieveForGameTitle`, `productRetrieveForGameInfo`, `productRetrieveForMedia`, `productRetrieveForMediaCarousel`, `productRetrieveForContentRating`, `productRetrieveForCompatibilityNotices`, `productRetrieveForAccessibilityFeatures`, `productRetrieveForCtasWithPrice`, `productRetrieveForUpsellWithCtas`, `productRetrieveForPhysicalMetedata`, `wcaProductRetrieveForLegalText`.
- Editions and add-ons: `wcaConceptEditionsRetrive`, `wcaProductEditionsRetrive`, `getAddOnProductsByProductId`.
- Friends and personalization: `friendsWhoPlayRetrieveByProductId`, `personalizedComponentsRetrieve`, `wcaPlatformVariantsRetrive`.
- Reviews: `wcaConceptReviewListRetrieve`, `wcaProductReviewListRetrieve`, `wcaProductUserReviewRetrieveByConceptId`, `wcaProductUserReviewRetrieveByProductId`, `wcaRateableProductRetrieveByConceptId`, `wcaRateableProductRetrieveByProductId`, `retrieveReportReasons`.
- Browse: `getExperience`, `getExperienceId`, `getNavTree`, `getView`, `getDefaultView`, `categoryGridRetrieve`, `categoryStrandRetrieve`, `getSearchResults`, `getResolvedProduct`.
- Subscriptions: `discountRetrieve`, `getSubscriptions`, `getUserSubscriptions`, `queryOracleUserProfileFullSubscription`, `tierSelectorFullRetrieve`.
- Wishlist: `wcaRetrieveWishlist`.

Example:

```bash
VARIABLES='{"conceptId":"10001130","productId":""}'
psn_graphql_get \
  "$W" "metGetConceptById" "$VARIABLES" \
  "cc90404ac049d935afbd9968aef523da2b6723abfb9d586e5f77ebf7c5289006" |
  jq '{data, errors}'
```

## Mutations

Every mutation permission is default denied. A firewall grant authorizes transport, not the business effect.

### Friends, Groups, and Messages

`PUT` accepts an incoming friend request; it is not verified for sending a new request. Re-read relationship state after a normally empty HTTP 204 response.

| Effect | Method and path | Body or notes |
| --- | --- | --- |
| Accept incoming request | `PUT $M/api/userProfile/v1/internal/users/me/friends/{accountId}` | No body |
| Decline request or remove friend | `DELETE $M/api/userProfile/v1/internal/users/me/friends/{accountId}` | Confirm which effect applies |
| Create or reuse group | `POST $M/api/gamingLoungeGroups/v1/groups` | `{"invitees":[{"accountId":"..."}]}` |
| Rename non-DM group | `PATCH $M/api/gamingLoungeGroups/v1/groups/{groupId}` | `{"groupName":{"value":"..."}}` |
| Invite member | `POST $M/api/gamingLoungeGroups/v1/groups/{groupId}/invitees` | `{"invitees":[{"accountId":"..."}]}`; stop if rejected |
| Send text | `POST $M/api/gamingLoungeGroups/v1/groups/{groupId}/threads/{threadId}/messages` | `{"messageType":1,"body":"..."}` |
| Upload image | `POST $M/api/gamingLoungeGroups/v1/groups/{groupId}/resources` | PNG or JPEG binary, at most 1 MiB |
| Send uploaded image | message path above | `{"messageType":3,"messageDetail":{"imageMessageDetail":{"resourceId":"..."}}}` |
| Kick member | `DELETE $M/api/gamingLoungeGroups/v1/groups/{groupId}/members/{accountId}` | Show group and account IDs first |
| Leave group | `DELETE $M/api/gamingLoungeGroups/v1/groups/{groupId}/members/me` | Show group first |

Read group detail to obtain the actual main thread ID. Send JSON with `Content-Type: application/json`; Gaming Lounge also requires `Accept-Language`.

```bash
TARGET_ACCOUNT_ID="1234567890123456789"
psn GET "$M/api/userProfile/v1/internal/users/me/friends/$TARGET_ACCOUNT_ID/summary" | jq .

# Run only after confirming an incoming request.
psn PUT "$M/api/userProfile/v1/internal/users/me/friends/$TARGET_ACCOUNT_ID"
```

### Store Mutations

The hashes below came from first-party Store documents current on 2026-07-16 and can rotate.

| Effect / operation | Variables | SHA-256 |
| --- | --- | --- |
| Wishlist add / `wcaAddItemToStoreWishlist` | `{"input":{"itemId":"<product-or-concept-id>"}}` | `df73492bad783fcce23c5b647cc1ba39ce286941a8da472fbf36bfed953901fe` |
| Wishlist remove / `wcaRemoveItemFromStoreWishlist` | same | `2c7db29bf47f8edfcd41e206ce485adc7522f016c827d60e93910d1162de7804` |
| Eligible claim / `backgroundPurchase` | `{"skuItems":[{"skuId":"<verified-eligible-sku>"}]}` | `fd4beca09885846c2b83df9820937839c8dc219f2a675aebcb13f02fa77cbddb` |
| Add stars / `addStarRatings` | `{"productId":"<id>","rating":"1-5"}` | `70632c710198b27c2def0118746a5f84b5e9711221b5116534f338a5b7cce6a8` |
| Update stars / `updateStarRatings` | `{"productId":"<id>","rating":"1-5"}` | `b78e16fdc6cc120c24734be0c7dec2542677533b7fb73078ffa01c1addbeeadc` |
| Add review / `addProductReview` | `productId`, `reviewTitle`, `reviewComment`, `reviewIsSpoiler`, confirmed terms, optional fingerprint, `rating` | `3799e944235544925383412d42de38b80530fd68a794c63f1cda4f5aa48adc71` |
| Modify review / `modifyReviewForProduct` | same shape as add | `740c108e758bfd44ada1c6f7ad2366a73fa7964b05835e839847b33f3e849884` |
| Delete review / `deleteReview` | product ID and valid Bazaarvoice fingerprint | `7906981664670752538d50df387a7fe0eb99430ed4c2f9d39df1315daf5a2969` |
| Vote / `VoteReview` | review ID and `UPVOTE` | `d060c6f983acec32709c308d2b9085768ede4e86f3930f350079d26c25a36b59` |
| Report / `addTextReviewReport` | review ID, numeric reason, optional description | `286eb4de41c91670302f4866d3b1dca2f762940e0bb31ab8c4a1d3591aceaf3c` |

Read the wishlist before and after a wishlist mutation. For `backgroundPurchase`, verify the exact Store action, zero-price or entitlement-backed status, absence of payment and tax steps, and the user's confirmation of title, edition, SKU, and add-to-library effect. Do not repeat a successful claim because the library view is delayed.

```bash
ITEM_ID="replace-with-product-or-concept-id"
VARIABLES="$(jq -nc --arg itemId "$ITEM_ID" '{input:{itemId:$itemId}}')"
psn_store_post \
  "wcaAddItemToStoreWishlist" "$VARIABLES" \
  "df73492bad783fcce23c5b647cc1ba39ce286941a8da472fbf36bfed953901fe" |
  jq '{data, errors}'
```

Some Store mutations require browser-session or anti-abuse state beyond a bearer token. If rejected, stop; do not substitute cookies or fabricate a fingerprint. Never invent `fingerPrintForBazaarVoice`.

## Failure Handling

- `PersistedQueryNotFound`: re-derive the hash from a current first-party document.
- `Cannot query field`: verify the host and client header; `getProfileOracle` needs `oracle`.
- HTTP 200 with `.errors`: treat it as failure unless requested data is present and the error is understood.
- HTTP 401: refresh the connector instead of replaying the token.
- HTTP 403 HTML: stop; the edge requires another session or blocked the request.
- HTTP 403 JSON: respect privacy, subscription, or authorization restrictions.

## Unsupported Surfaces

- Generic paid checkout, priced-game purchasing, incomplete cart flows, and retired transaction history.
- Remote install or delete and cloud-save mutation without a current concrete contract.
- Sending a brand-new friend request; accepting an incoming request is the only verified PUT effect.
- Dynamic push WebSocket control and voice-party RTC.
- Retired Communities APIs.
- PlayStation Stars as a durable surface; the service is scheduled to end on November 2, 2026.

## Operating Rules

1. Prefer `me` where accepted and use a numeric account ID where rejected.
2. Resolve an online ID with universal search before account-ID calls.
3. Respect privacy errors and partial data.
4. Request only needed private fields and treat signed URLs as secrets.
5. Stop after authorization, schema, or persisted-query errors; do not guess hashes or payloads.
