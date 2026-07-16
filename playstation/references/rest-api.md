# PlayStation REST API Reference

Use this reference for supported REST and public read endpoints. Read the parent `SKILL.md` first for permission defaults and data-handling rules.

## Contents

- [Common setup](#common-setup)
- [Profile and presence](#profile-and-presence)
- [Social graph](#social-graph)
- [Universal search](#universal-search)
- [Games, ownership, subscriptions, and devices](#games-ownership-subscriptions-and-devices)
- [Trophies](#trophies)
- [Captures](#captures)
- [Groups, notifications, and sessions](#groups-notifications-and-sessions)
- [Private account record](#private-account-record)
- [Operational and public data](#operational-and-public-data)

## Common Setup

Use this helper only for authenticated PlayStation hosts:

```bash
psn_get() {
  curl -fsS \
    --header "Authorization: Bearer $PLAYSTATION_TOKEN" \
    --header "Accept: application/json" \
    --header "Accept-Language: en-US" \
    "$@"
}
```

Set reusable identifiers as needed:

```bash
ACCOUNT_ID="${PLAYSTATION_ACCOUNT_ID:-me}"
TARGET_ACCOUNT_ID="1234567890123456789"
NP_TITLE_ID="PPSA01325_00"
NP_COMM_ID="NPWR20188_00"
TROPHY_ID="1"
GROUP_ID="replace-with-group-id"
THREAD_ID="$GROUP_ID"
UGC_ID="replace-with-capture-id"
```

## Profile and Presence

| Path | Purpose and parameters |
| --- | --- |
| `GET /api/userProfile/v1/internal/users/{accountId}/profiles` | Lean profile for one numeric account ID; upstream rejects `me` on this path |
| `GET /api/userProfile/v1/internal/users/profiles` | Batch profiles; pass `accountIds=id1,id2` |
| `GET /api/userProfile/v1/internal/users/{accountId}/basicPresences` | v1 presence; pass `type=primary` |
| `GET /api/userProfile/v2/internal/users/{accountId}/basicPresences` | Current app presence; optionally pass platforms and own-title fields |
| `GET /api/userProfile/v2/internal/users/basicPresences` | Batch presence; pass `accountIds=id1,id2` |
| `GET /api/userProfile/v1/internal/users/me/userSettings/appearOffline` | Connected account's appear-offline setting |
| `GET /api/cpss/v1/share/profile/{accountId}` | Shareable profile URL and image |
| `GET /api/cpss/v1/eligibilityCheck/batch` | Social/session feature eligibility |
| `GET /userProfile/v1/users/{onlineId}/profile2` on the community host | Rich legacy profile selected by the `fields` query parameter |

Get current v2 presence:

```bash
psn_get "https://m.np.playstation.com/api/userProfile/v2/internal/users/$TARGET_ACCOUNT_ID/basicPresences?platforms=PS4,PS5,MOBILE_APP,PSPC&type=primary&withOwnGameTitleInfo=true" | jq .
```

Batch profile and presence lookups:

```bash
ACCOUNT_IDS="1234567890123456789,9876543210987654321"

psn_get --get "https://m.np.playstation.com/api/userProfile/v1/internal/users/profiles" \
  --data-urlencode "accountIds=$ACCOUNT_IDS" | jq .

psn_get --get "https://m.np.playstation.com/api/userProfile/v2/internal/users/basicPresences" \
  --data-urlencode "accountIds=$ACCOUNT_IDS" | jq .
```

Read a rich legacy profile. Request only fields needed for the user's task:

```bash
ONLINE_ID="$PLAYSTATION_ONLINE_ID"
FIELDS='npId,onlineId,accountId,avatarUrls,plus,aboutMe,languagesUsed,trophySummary(@default,level,progress,earnedTrophies),primaryOnlineStatus,presences(@default,@titleInfo,platform,lastOnlineDate),friendRelation'

psn_get --get "https://us-prof.np.community.playstation.net/userProfile/v1/users/$ONLINE_ID/profile2" \
  --data-urlencode "fields=$FIELDS" | jq '.profile'
```

## Social Graph

These routes use the default-denied `playstation-social-read` permission.

| Path | Purpose |
| --- | --- |
| `GET /api/userProfile/v1/internal/users/{accountId}/friends` | v1 friend account IDs |
| `GET /api/userProfile/v2/internal/users/{accountId}/friends` | current app friend account IDs |
| `GET /api/userProfile/v1/internal/users/{accountId}/friends/receivedRequests` | incoming friend requests; use `me` |
| `GET /api/userProfile/v1/internal/users/{accountId}/blocks` | block list; use `me` |
| `GET /api/userProfile/v1/internal/users/me/friends/{accountId}/summary` | relationship summary used by current community clients |
| `GET /api/userProfile/v1/internal/users/{accountId}/friends/{friendId}/summary` | two-account relationship-summary form seen in current app traffic |
| `GET /api/userProfile/v1/internal/users/me/friends/subscribing/availableToPlay` | provisional available-to-play/settings payload |

Paginate friends, requests, and blocks with `limit` and `offset`:

```bash
psn_get "https://m.np.playstation.com/api/userProfile/v2/internal/users/me/friends?limit=100&offset=0" | jq .
psn_get "https://m.np.playstation.com/api/userProfile/v1/internal/users/me/friends/receivedRequests?limit=100&offset=0" | jq .
psn_get "https://m.np.playstation.com/api/userProfile/v1/internal/users/me/blocks?limit=100&offset=0" | jq .
```

Read the relationship before accepting, declining, or removing a friend:

```bash
psn_get "https://m.np.playstation.com/api/userProfile/v1/internal/users/me/friends/$TARGET_ACCOUNT_ID/summary" | jq .
```

## Universal Search

`POST /api/search/v1/universalSearch` is a read operation despite using POST. The firewall cannot inspect `domainRequests`, so request only the domains needed for the task.

Resolve an online ID to an account ID:

```bash
SEARCH_TERM="target-online-id"

jq -nc --arg term "$SEARCH_TERM" \
  '{searchTerm:$term,domainRequests:[{domain:"SocialAllAccounts"}]}' |
  psn_get \
    --request POST \
    "https://m.np.playstation.com/api/search/v1/universalSearch" \
    --header "Content-Type: application/json" \
    --data-binary @- | jq .
```

Use the mobile GraphQL search recipes in `graphql-api.md` for paginated players, full games, and add-ons.

## Games, Ownership, Subscriptions, and Devices

| Host and path | Permission | Purpose |
| --- | --- | --- |
| Mobile `GET /api/gamelist/v2/users/{accountId}/titles` | `playstation-games-read` | Played titles, playtime, and last-played data |
| Mobile `GET /api/catalog/v2/titles/{npTitleId}/concepts` | `playstation-store-catalog-read` | Resolve title IDs to Store concepts |
| Mobile `GET /api/entitlement/v2/users/me/internal/entitlements` | `playstation-entitlements-read` | Complete PS4/PS5 ownership ledger, including DLC and free claims |
| Mobile `GET /api/subscriptions/v2/users/me/services/pssubscriptions` | `playstation-subscriptions-read` | PS Plus and partner subscriptions, trials, and renewal state |
| Mobile `GET /api/cloudAssistedNavigation/v2/users/me/clients` | `playstation-console-storage-read` | Console storage and installed-title snapshots |
| DMS `GET /api/v1/devices/accounts/{accountId}` | `playstation-devices-read` | Registered and activated devices |

Read the entitlement ledger in pages:

```bash
psn_get --get "https://m.np.playstation.com/api/entitlement/v2/users/me/internal/entitlements" \
  --data-urlencode "entitlementType=1,2,3,4,5" \
  --data-urlencode "fields=titleMeta,gameMeta,conceptMeta,rewardMeta,rewardMeta.retentionPolicy,rewardMeta.rewardMembershipType" \
  --data-urlencode "gameMetaPackageType=PSGD,PS4GD" \
  --data-urlencode "limit=50" \
  --data-urlencode "offset=0" | jq .
```

Read registered devices and console storage:

```bash
psn_get --get "https://dms.api.playstation.com/api/v1/devices/accounts/me" \
  --data-urlencode "includeFields=device,systemData" \
  --data-urlencode "platform=PS5,PS4,PS3,PSVita" | jq .

psn_get --get "https://m.np.playstation.com/api/cloudAssistedNavigation/v2/users/me/clients" \
  --data-urlencode "includeFields=device,systemData" \
  --data-urlencode "platform=PS5" | jq .
```

## Trophies

| Path | Purpose |
| --- | --- |
| `GET /api/trophy/v1/users/{accountId}/trophySummary` | Overall trophy level and counts |
| `GET /api/trophy/v1/users/{accountId}/trophyTitles` | Paginated trophy title list |
| `GET /api/trophy/v1/users/{accountId}/titles/trophyTitles` | Trophy progress for `npTitleIds`; at most five IDs per request |
| `GET /api/trophy/v1/npCommunicationIds/{npCommId}/trophyGroups` | Trophy-group definitions |
| `GET /api/trophy/v1/users/{accountId}/npCommunicationIds/{npCommId}/trophyGroups` | User progress by group |
| `GET /api/trophy/v1/npCommunicationIds/{npCommId}/trophyGroups/{groupId}/trophies` | Trophy definitions in a group; use `all` for the whole title |
| `GET /api/trophy/v1/users/{accountId}/npCommunicationIds/{npCommId}/trophyGroups/{groupId}/trophies` | User earned status in a group |
| `GET /api/trophy/v1/npCommunicationIds/{npCommId}/trophies/{trophyId}` | One trophy definition |
| `GET /api/trophy/v1/users/{accountId}/npCommunicationIds/{npCommId}/trophies/{trophyId}` | One user's trophy status |
| `GET /api/trophy/v1/users/me/npCommunicationIds/{npCommId}/appearanceSetting` | Connected account's trophy appearance setting |

Use `npServiceName=trophy2` for PS5 and `npServiceName=trophy` for earlier platforms:

```bash
psn_get "https://m.np.playstation.com/api/trophy/v1/npCommunicationIds/$NP_COMM_ID/trophyGroups/all/trophies?npServiceName=trophy2&limit=100&offset=0" | jq .

psn_get "https://m.np.playstation.com/api/trophy/v1/users/me/npCommunicationIds/$NP_COMM_ID/trophies/$TROPHY_ID?npServiceName=trophy2" | jq .
```

## Captures

These routes use the default-denied `playstation-media-read` permission.

| Path | Purpose |
| --- | --- |
| `GET /api/gameMediaService/v2/c2s/category/cloudMediaGallery/ugcType/all` | Capture list; use `includeTokenizedUrls`, `limit`, and `cursorMark` |
| `GET /api/gameMediaService/v2/c2s/content` | Full metadata; use `ugcIds` and a `fields` list |
| `GET /api/gameMediaService/v2/c2s/ugc/{ugcId}/url` | Time-limited signed asset URLs |

```bash
psn_get --get "https://m.np.playstation.com/api/gameMediaService/v2/c2s/category/cloudMediaGallery/ugcType/all" \
  --data-urlencode "includeTokenizedUrls=true" \
  --data-urlencode "limit=20" | jq .

psn_get "https://m.np.playstation.com/api/gameMediaService/v2/c2s/ugc/$UGC_ID/url" | jq .
```

Follow `nextCursorMark` until `-1`. Download returned signed CDN URLs without the PlayStation bearer token.

## Groups, Notifications, and Sessions

| Path | Permission | Purpose |
| --- | --- | --- |
| `GET /api/gamingLoungeGroups/v1/members/me/groups` | `playstation-messaging-read` | Group/DM list; paginate with `limit` and `offset` |
| `GET /api/gamingLoungeGroups/v1/members/me/groups/{groupId}` | `playstation-messaging-read` | Group name, members, thread, and settings |
| `GET /api/gamingLoungeGroups/v1/members/me/groups/{groupId}/threads/{threadId}/messages` | `playstation-messaging-read` | Message history; continue with the previous response's `next` value as `before` |
| `GET /api/gamingLoungeGroups/v1/groups/{groupId}/resources/{resourceId}` | `playstation-messaging-read` | Message attachment resource |
| `GET /api/gamingLoungeGroups/v1/reactions/mobile-v1/definitions` | `playstation-messaging-read` | Reaction vocabulary |
| `GET /api/userNotificationManager/v1/users/me/notifications` | `playstation-notifications-read` | Notification inbox; optionally pass `sinceUpdatedDateTime` |
| `GET /api/sessionManager/v2/users/me/partySessionsInvitations` | `playstation-sessions-read` | Party invitations; some accounts return authorization errors |
| `GET /api/gamingLoungeGroups/v1/members/me/groups/openPartySessions` | `playstation-sessions-read` | Open party-session metadata |
| `GET /api/explore/v2/users/me/hub` | `playstation-personalization-read` | Explore hub, follows, betas, and story rails |
| `GET /np/serveraddr` on the push discovery host | `playstation-push-notifications-read` | Discover push FQDN; pass `version=3.0`, `fields=keepAliveStatus`, `keepAliveStatusType=6` |

Gaming Lounge rejects requests without `Accept-Language`.

```bash
psn_get --get "https://m.np.playstation.com/api/gamingLoungeGroups/v1/members/me/groups" \
  --data-urlencode "includeFields=members" \
  --data-urlencode "limit=100" \
  --data-urlencode "offset=0" | jq .

psn_get --get "https://m.np.playstation.com/api/gamingLoungeGroups/v1/members/me/groups/$GROUP_ID/threads/$THREAD_ID/messages" \
  --data-urlencode "limit=20" | jq .

psn_get --get "https://mobile-pushcl.np.communication.playstation.net/np/serveraddr" \
  --data-urlencode "version=3.0" \
  --data-urlencode "fields=keepAliveStatus" \
  --data-urlencode "keepAliveStatusType=6" | jq .
```

The connector supports push-server discovery, not the returned dynamic WebSocket protocol.

## Private Account Record

`GET https://accounts.api.playstation.com/api/v1/accounts/me` returns the full signed-in account record. It can include real name, emails, phone numbers, addresses, date of birth, locale, account state, and verification fields. Use `playstation-account-private-read`, request only when necessary, and narrow output immediately.

Example: select only the primary email metadata without printing the full response:

```bash
psn_get "https://accounts.api.playstation.com/api/v1/accounts/me" |
  jq '{accountId, onlineId, signinId, mainEmail: ((.emails // []) | map(select(.isMain == true)) | first)}'
```

Do not save the raw response unless the user explicitly requests it.

## Operational and Public Data

| Request | Authentication | Purpose |
| --- | --- | --- |
| `GET https://m.np.playstation.com/api/univex/v3/platforms/mobile/variants` | Bearer | Mobile experiment assignments |
| `GET https://theia.dl.playstation.net/metropolis/config/top.json` | None | App configuration |
| `GET https://static-resource.np.community.playstation.net/sticker/presetList_{region}.json` | None | Regional sticker index, for example `US` |
| `GET https://blog.playstation.com/wp-json/wp/v2/posts` | None | PlayStation Blog posts |
| `GET https://{region}.blog.playstation.com/wp-json/wp/v2/posts` | None | Regional blog posts, for example `blog.fr.playstation.com` |

Never attach `$PLAYSTATION_TOKEN` to public requests:

```bash
curl -fsS "https://static-resource.np.community.playstation.net/sticker/presetList_US.json" | jq .
curl -fsS "https://blog.playstation.com/wp-json/wp/v2/posts?per_page=10&page=1" | jq '.[] | {date, link, title: .title.rendered}'
```
