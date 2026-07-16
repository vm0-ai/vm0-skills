---
name: playstation
description: Use PlayStation Network APIs for profiles, presence, friends, games, trophies, Store catalog and wishlist, entitlements, subscriptions, devices, captures, groups, messages, notifications, party sessions, and explicitly confirmed mutations. Use when the user mentions PlayStation, PSN, PS4, PS5, PlayStation Store, trophies, friends, captures, wishlist, reviews, or adding an eligible game to the library.
---

# PlayStation

Use the PlayStation Network consumer APIs through the vm0 PlayStation connector.

These are undocumented consumer endpoints rather than a stable public API. PlayStation terms can restrict automated access, so use only an account the user is authorized to control and follow the applicable terms. Expect persisted-query hashes and response shapes to change. Never guess a write endpoint, retry a mutation blindly, or describe a partially verified operation as guaranteed.

## Prerequisites

- Connect PlayStation under vm0.ai -> Settings -> Connectors.
- Use `$PLAYSTATION_TOKEN` only as `Authorization: Bearer $PLAYSTATION_TOKEN` on authenticated PlayStation hosts.
- Use `$PLAYSTATION_ACCOUNT_ID` and `$PLAYSTATION_ONLINE_ID` when the connector provides them.
- Never send the bearer token to the public app-config, sticker, or blog hosts.
- Install `curl` and `jq`.

Run connector diagnostics before debugging an API response:

```bash
zero doctor check-connector --env-name PLAYSTATION_TOKEN
zero doctor check-connector --env-name PLAYSTATION_ACCOUNT_ID
zero doctor check-connector --url "https://m.np.playstation.com/api/userProfile/v1/internal/users/$PLAYSTATION_ACCOUNT_ID/profiles" --method GET
```

## Mutation Safety

Treat every write as externally visible account activity.

1. Run a mutation only when the user explicitly requests its exact effect. If the request is ambiguous, confirm the target and effect first.
2. Show the target account, group, product, SKU, rating, or review before sending the request.
3. Never use `backgroundPurchase` for a priced SKU. It is supported only for a zero-price or entitlement-backed `BACKGROUND_PURCHASE` / `BACKGROUND_PURCHASE_AND_DOWNLOAD` Store action after eligibility and price are verified.
4. Do not claim that paid checkout is supported. Cart, payment instrument, tax, confirmation, and paid-order contracts are not available through this connector.
5. Before adding or modifying a review, require the user to explicitly agree to the current review terms. Never infer agreement or silently submit `agreeToTermsAndConditions: true`.
6. Treat `DELETE .../friends/{accountId}` as either declining an incoming request or unfriending, depending on current relationship state. Read the relationship first.
7. Do not expose or persist private account records, messages, capture URLs, notification payloads, or device identifiers unless the user asks for that data.

The firewall currently matches host, method, and path. It does not inspect GraphQL `operationName`, persisted-query hash, query parameters, or request body. The shared GraphQL permissions are therefore intentionally broad and default denied.

## Hosts

Authenticated hosts:

- Mobile REST and GraphQL: `https://m.np.playstation.com`
- Legacy profiles: `https://us-prof.np.community.playstation.net`
- Web Store GraphQL: `https://web.np.playstation.com`
- Registered devices: `https://dms.api.playstation.com`
- Private account record: `https://accounts.api.playstation.com`
- Push-server discovery: `https://mobile-pushcl.np.communication.playstation.net`

Public hosts, without authorization:

- App configuration: `https://theia.dl.playstation.net`
- Sticker indexes: `https://static-resource.np.community.playstation.net`
- Blog: `https://blog.playstation.com` and regional `*.blog.playstation.com` hosts

## Firewall Permissions

`Allow` means enabled by the connector's default policy. `Deny` means the run needs an explicit permission grant.

| Permission | Default | Capability |
| --- | --- | --- |
| `playstation-profile-read` | Allow | Profiles, v1/v2 presence, batch lookup, appear-offline state, share links, social eligibility |
| `playstation-games-read` | Allow | Played titles and playtime |
| `playstation-trophies-read` | Allow | Trophy summaries, titles, groups, lists, single trophies, appearance settings |
| `playstation-search-read` | Allow | REST universal search |
| `playstation-legacy-profile-read` | Allow | Legacy rich profile lookup by online ID |
| `playstation-store-catalog-read` | Allow | Title-to-concept mapping |
| `playstation-operational-metadata-read` | Allow | App config, feature variants, sticker indexes, blog posts |
| `playstation-social-read` | Deny | Friends, requests, blocks, relationship summaries, available-to-play state |
| `playstation-graphql-games-read` | Deny | Shared web GraphQL GET transport for library and Store queries |
| `playstation-devices-read` | Deny | Registered account devices |
| `playstation-account-private-read` | Deny | Full private self-account record, including identity and contact fields |
| `playstation-entitlements-read` | Deny | Game, add-on, subscription, and reward entitlement ledger |
| `playstation-subscriptions-read` | Deny | PS Plus and partner subscription state |
| `playstation-console-storage-read` | Deny | Console storage and installed-title snapshots |
| `playstation-media-read` | Deny | Cloud captures, metadata, and signed URLs |
| `playstation-messaging-read` | Deny | Groups, DMs, history, resources, and reactions |
| `playstation-sessions-read` | Deny | Party invitations and open party sessions |
| `playstation-notifications-read` | Deny | Notification inbox and incremental polling |
| `playstation-push-notifications-read` | Deny | Push-server discovery only |
| `playstation-personalization-read` | Deny | Explore hub, follows, betas, and story rails |
| `playstation-mobile-graphql-read` | Deny | Shared mobile GraphQL GET transport for games, Game Help, Store, search, wishlist, and browse |
| `playstation-social-write` | Deny | Accept/decline requests and remove friends |
| `playstation-messaging-write` | Deny | Create/rename groups, invite/kick/leave, send text/images, upload resources |
| `playstation-store-graphql-post` | Deny | Shared Store GraphQL POST transport for wishlist, eligible claims, ratings, reviews, votes, and reports |

## Quick Reads

### Get the connected profile

The internal profile path requires a numeric account ID rather than `me`.

```bash
curl -fsS "https://m.np.playstation.com/api/userProfile/v1/internal/users/$PLAYSTATION_ACCOUNT_ID/profiles" \
  --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

### Get played games and playtime

```bash
curl -fsS "https://m.np.playstation.com/api/gamelist/v2/users/me/titles?limit=20&offset=0&categories=ps4_game,ps5_native_game,pspc_game" \
  --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq '.titles[]? | {name, platform, playDuration, lastPlayedDateTime, titleId, conceptId}'
```

### Get the trophy summary

```bash
curl -fsS "https://m.np.playstation.com/api/trophy/v1/users/me/trophySummary" \
  --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

### Resolve a title ID to Store concepts

```bash
NP_TITLE_ID="PPSA01325_00"
curl -fsS "https://m.np.playstation.com/api/catalog/v2/titles/$NP_TITLE_ID/concepts" \
  --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

### Read a public app configuration

Do not add an authorization header.

```bash
curl -fsS "https://theia.dl.playstation.net/metropolis/config/top.json" | jq .
```

## Detailed References

- Read [references/rest-api.md](references/rest-api.md) for all supported REST and public read routes, parameters, pagination, and privacy notes.
- Read [references/graphql-api.md](references/graphql-api.md) for mobile and web persisted-query helpers, verified operation hashes, variable shapes, and the current Store operation inventory.
- Read [references/mutations.md](references/mutations.md) before any friend, group, wishlist, eligible-library-claim, rating, or review mutation.

## Explicitly Unsupported Surfaces

- Generic paid checkout, priced-game purchasing, and incomplete cart flows.
- The retired REST transaction-history endpoint.
- Remote install/delete and cloud-save mutation without a current concrete contract.
- Dynamic push WebSocket control and voice-party RTC.
- Retired Communities APIs.
- PlayStation Stars as a durable connector surface; the service is scheduled to end on November 2, 2026.

## Operating Guidelines

1. Prefer `me` when the endpoint accepts it. Use the numeric account ID where `me` is rejected.
2. Resolve an online ID with universal search before calling account-ID routes for another user.
3. Respect privacy responses. Friends, trophies, presence, groups, and sessions can return partial data or authorization errors.
4. Use `npServiceName=trophy2` for PS5 and `npServiceName=trophy` for PS3, PS4, and PS Vita where required.
5. Paginate with modest `limit` and `offset` values. Follow server cursors for message history.
6. Send `Accept-Language: en-US` on Gaming Lounge requests.
7. Send `apollographql-client-name: PlayStationApp-Android` on mobile persisted queries.
8. Check GraphQL `errors` even when the HTTP status is 200.
9. Stop after an authorization, schema, or persisted-query error. Re-derive the current operation contract instead of changing hashes or payloads by guesswork.
10. Treat signed capture/resource URLs as secrets until they expire.
