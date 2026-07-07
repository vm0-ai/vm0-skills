---
name: playstation
description: PlayStation Network API for player profiles, presence, friends, played games, trophies, purchased games, recently played games, profile search, and account devices. Use when user mentions "PlayStation", "PSN", "PS4", "PS5", PlayStation trophies, played games, or PlayStation friends.
---

# PlayStation

Use the PlayStation Network APIs with the vm0 PlayStation connector.

## Troubleshooting

If requests fail, run:

```bash
zero doctor check-connector --env-name PLAYSTATION_TOKEN
zero doctor check-connector --env-name PLAYSTATION_ACCOUNT_ID
zero doctor check-connector --url https://m.np.playstation.com/api/userProfile/v1/internal/users/me/profiles --method GET
```

## Prerequisites

- Connect PlayStation under vm0.ai -> Settings -> Connectors.
- The connector exposes `$PLAYSTATION_TOKEN` for authenticated PlayStation Network API requests.
- The connector exposes `$PLAYSTATION_ACCOUNT_ID` for the connected account ID and `$PLAYSTATION_ONLINE_ID` for the connected online ID when available.
- Send the token only with `Authorization: Bearer $PLAYSTATION_TOKEN`.
- The connector is read-only. It can read profile, presence, social, game, trophy, search, and account device data covered by the vm0 firewall.

Base URLs:

- User, social, game list, trophy, search, and share APIs: `https://m.np.playstation.com`
- Legacy profile lookup: `https://us-prof.np.community.playstation.net`
- GraphQL game library APIs: `https://web.np.playstation.com`
- Device management API: `https://dms.api.playstation.com`

## Profile and Presence

### 1. Get the Connected Account Profile

```bash
curl -s "https://m.np.playstation.com/api/userProfile/v1/internal/users/$PLAYSTATION_ACCOUNT_ID/profiles" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

### 2. Get Basic Presence

```bash
curl -s "https://m.np.playstation.com/api/userProfile/v1/internal/users/$PLAYSTATION_ACCOUNT_ID/basicPresences?type=primary" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

### 3. Get a Shareable Profile Link

```bash
curl -s "https://m.np.playstation.com/api/cpss/v1/share/profile/$PLAYSTATION_ACCOUNT_ID" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

### 4. Look Up a Legacy Profile by Online ID

Use this when you have an online ID and want profile or legacy console presence fields.

```bash
curl -s "https://us-prof.np.community.playstation.net/userProfile/v1/users/<online-id>/profile2?fields=npId,onlineId,accountId,avatarUrls,plus,aboutMe,languagesUsed,trophySummary(@default,level,progress,earnedTrophies),primaryOnlineStatus,presences(@default,@titleInfo,platform,lastOnlineDate,hasBroadcastData),friendRelation" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

## Social

### 5. List Friends

```bash
curl -s "https://m.np.playstation.com/api/userProfile/v1/internal/users/me/friends?limit=100&offset=0" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

### 6. List Received Friend Requests

```bash
curl -s "https://m.np.playstation.com/api/userProfile/v1/internal/users/me/friends/receivedRequests?limit=100&offset=0" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

### 7. List Blocked Accounts

```bash
curl -s "https://m.np.playstation.com/api/userProfile/v1/internal/users/me/blocks?limit=100&offset=0" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

## Games

### 8. Get Played Games and Playtime

```bash
curl -s "https://m.np.playstation.com/api/gamelist/v2/users/me/titles?limit=20&offset=0&categories=ps4_game,ps5_native_game" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

### 9. Get Recently Played Games Through GraphQL

```bash
curl -s -G "https://web.np.playstation.com/api/graphql/v1/op" --header "Authorization: Bearer $PLAYSTATION_TOKEN" --data-urlencode "operationName=getUserGameList" --data-urlencode 'variables={"limit":20,"categories":"ps4_game,ps5_native_game"}' --data-urlencode 'extensions={"persistedQuery":{"version":1,"sha256Hash":"e780a6d8b921ef0c59ec01ea5c5255671272ca0d819edb61320914cf7a78b3ae"}}' | jq '.data.gameLibraryTitlesRetrieve.games[]? | {name, platform, lastPlayedDateTime, titleId, conceptId}'
```

### 10. Get Purchased PS4 and PS5 Games Through GraphQL

```bash
curl -s -G "https://web.np.playstation.com/api/graphql/v1/op" --header "Authorization: Bearer $PLAYSTATION_TOKEN" --data-urlencode "operationName=getPurchasedGameList" --data-urlencode 'variables={"isActive":true,"platform":["ps4","ps5"],"size":24,"start":0,"sortBy":"ACTIVE_DATE","sortDirection":"desc"}' --data-urlencode 'extensions={"persistedQuery":{"version":1,"sha256Hash":"827a423f6a8ddca4107ac01395af2ec0eafd8396fc7fa204aaf9b7ed2eefa168"}}' | jq '.data.purchasedTitlesRetrieve.games[]? | {name, platform, activeDate, titleId, conceptId}'
```

## Trophies

### 11. Get Trophy Profile Summary

```bash
curl -s "https://m.np.playstation.com/api/trophy/v1/users/me/trophySummary" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

### 12. List Trophy Titles

Use this to find `npCommunicationId` values for later trophy calls.

```bash
curl -s "https://m.np.playstation.com/api/trophy/v1/users/me/trophyTitles?limit=20&offset=0" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq '.trophyTitles[]? | {npCommunicationId, trophyTitleName, trophyTitlePlatform, progress, lastUpdatedDateTime}'
```

### 13. Get Title Trophy Groups

Replace `<np-communication-id>` with a value from the trophy titles response. Use `npServiceName=trophy` for PS3, PS4, or PS Vita titles and `npServiceName=trophy2` for PS5 titles.

```bash
curl -s "https://m.np.playstation.com/api/trophy/v1/npCommunicationIds/<np-communication-id>/trophyGroups?npServiceName=trophy2" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

### 14. Get Title Trophies

Use `all` for `<trophy-group-id>` to fetch the full trophy set, or use a group ID such as `default` or `001`.

```bash
curl -s "https://m.np.playstation.com/api/trophy/v1/npCommunicationIds/<np-communication-id>/trophyGroups/all/trophies?npServiceName=trophy2&limit=100&offset=0" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq '.trophies[]? | {trophyId, trophyName, trophyGrade, trophyHidden}'
```

### 15. Get Earned Trophy Status for a Title

```bash
curl -s "https://m.np.playstation.com/api/trophy/v1/users/me/npCommunicationIds/<np-communication-id>/trophyGroups/all/trophies?npServiceName=trophy2&limit=100&offset=0" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq '.trophies[]? | {trophyId, earned, earnedDateTime}'
```

### 16. Get Trophy Progress by Title ID

Replace `<np-title-id>` with a title ID such as a `CUSA...` or `PPSA...` value.

```bash
curl -s "https://m.np.playstation.com/api/trophy/v1/users/me/titles/trophyTitles?npTitleIds=<np-title-id>&includeNotEarnedTrophyIds=true" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

### 17. Get Trophy Group Earnings

```bash
curl -s "https://m.np.playstation.com/api/trophy/v1/users/me/npCommunicationIds/<np-communication-id>/trophyGroups?npServiceName=trophy2" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

## Search and Devices

### 18. Search PlayStation Network Accounts

```bash
curl -s -X POST "https://m.np.playstation.com/api/search/v1/universalSearch" --header "Authorization: Bearer $PLAYSTATION_TOKEN" --header "Content-Type: application/json" -d '{"searchTerm":"<online-id-or-name>","domainRequests":[{"domain":"SocialAllAccounts"}]}' | jq .
```

### 19. Get Account Devices

```bash
curl -s "https://dms.api.playstation.com/api/v1/devices/accounts/me?includeFields=device,systemData&platform=PS5,PS4,PS3,PSVita" --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

## Guidelines

1. Prefer `me` for the connected account when the endpoint accepts an account ID.
2. Use `makeUniversalSearch` / universal search to resolve a public online ID to an account ID before calling account-ID based endpoints for another user.
3. Respect privacy settings: friends, trophies, and presence may return errors or partial data for accounts that do not expose those fields.
4. For trophy APIs, use `npServiceName=trophy2` for PS5 titles and `npServiceName=trophy` for PS3, PS4, and PS Vita titles.
5. Paginate large lists with `limit` and `offset`; keep page sizes modest.
6. These PlayStation Network endpoints are read-only in vm0. Do not attempt writes or unsupported paths.
