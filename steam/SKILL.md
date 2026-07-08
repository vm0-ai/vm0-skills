---
name: steam
description: Steam Web API and public Steam Store APIs for player profiles, game libraries, playtime, wishlists, friends, groups, bans, achievements, game stats, app metadata, reviews, prices, featured games, packages, and Steam news. Use when user mentions "Steam", Steam profile, Steam games, playtime, wishlist, achievements, Steam friends, Steam reviews, Steam prices, or asks about a Steam app.
---

# Steam

Use public Steam APIs when no account data is needed. Use the vm0 Steam connector for connected-player data.

## Troubleshooting

If connector-backed requests fail, run:

```bash
zero doctor check-connector --env-name STEAM_ID
zero doctor check-connector --env-name STEAM_WEB_API_KEY
zero doctor check-connector --url https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/ --method GET
```

## Prerequisites

- Connect Steam under vm0.ai -> Settings -> Connectors.
- The connector signs the user in with Steam OpenID and exposes the connected account ID as `$STEAM_ID`.
- Steam Web API requests use `https://api.steampowered.com`.
- Public app, news, stats, and Store metadata requests do not need a Steam account or Web API key.
- Public Store JSON requests use `https://store.steampowered.com`.
- vm0 injects the Steam Web API key as the `key` query parameter at the network boundary for connector-backed Web API requests. Do not add `key=` manually in curl commands.
- The connector is read-only. It can read public Steam data and connected-player data that Steam exposes to the configured Web API key.

## Public APIs That Do Not Need Steam Authentication

Use these when the user asks about Steam apps, reviews, prices, featured games, or public stats and no connected-player data is needed.

### Get Public Steam Web API Methods

Without a key, `GetSupportedAPIList` lists Web API methods currently exposed publicly.

```bash
curl -s "https://api.steampowered.com/ISteamWebAPIUtil/GetSupportedAPIList/v1/?format=json" \
  | jq '.apilist.interfaces[] | {name, methods: [.methods[] | {name, version, parameters}]}'
```

### Get Store App Details

Use this for app metadata, prices, platforms, genres, categories, recommendations, and release dates. Replace `<country-code>` with a two-letter country code such as `US`.

```bash
APP_ID=<app-id>
curl -s -G "https://store.steampowered.com/api/appdetails" \
  --data-urlencode "appids=$APP_ID" \
  --data-urlencode "cc=<country-code>" \
  --data-urlencode "l=en" \
  --data-urlencode "filters=basic,price_overview,platforms,metacritic,categories,genres,recommendations,release_date" \
  | jq --arg appid "$APP_ID" '.[$appid] | {success, data: (.data | {type, name, steam_appid, is_free, price_overview, platforms, metacritic, categories, genres, recommendations, release_date})}'
```

### Get Store App Reviews

Use this for public review summaries and recent review text.

```bash
curl -s -G "https://store.steampowered.com/appreviews/<app-id>" \
  --data-urlencode "json=1" \
  --data-urlencode "filter=recent" \
  --data-urlencode "language=all" \
  --data-urlencode "purchase_type=all" \
  --data-urlencode "num_per_page=20" \
  | jq '{success, query_summary, reviews: [.reviews[]? | {recommendationid, language, voted_up, votes_up, weighted_vote_score, playtime_forever: .author.playtime_forever, timestamp_created, review: (.review | .[:500])}], cursor}'
```

### Get Featured Store Categories

Use this for public sale, top seller, and new release lists. Replace `<country-code>` with a two-letter country code such as `US`.

```bash
curl -s -G "https://store.steampowered.com/api/featuredcategories" \
  --data-urlencode "cc=<country-code>" \
  --data-urlencode "l=en" \
  | jq '{specials: [.specials.items[]? | {id, name, discount_percent, final_price, currency}], top_sellers: [.top_sellers.items[]? | {id, name, final_price, currency}], new_releases: [.new_releases.items[]? | {id, name, final_price, currency}]}'
```

### Get Featured Store Apps

```bash
curl -s -G "https://store.steampowered.com/api/featured" \
  --data-urlencode "cc=<country-code>" \
  --data-urlencode "l=en" \
  | jq '{specials: [.specials[]? | {id, name, discount_percent, final_price, currency}], featured_win: [.featured_win[]? | {id, name, final_price, currency}], featured_mac: [.featured_mac[]? | {id, name, final_price, currency}], featured_linux: [.featured_linux[]? | {id, name, final_price, currency}]}'
```

### Get Store Package Details

Use this when the user gives a Steam package or bundle package ID.

```bash
PACKAGE_ID=<package-id>
curl -s -G "https://store.steampowered.com/api/packagedetails" \
  --data-urlencode "packageids=$PACKAGE_ID" \
  --data-urlencode "cc=<country-code>" \
  --data-urlencode "l=en" \
  | jq --arg package_id "$PACKAGE_ID" '.[$package_id] | {success, data: (.data | {name, apps, price})}'
```

## Connected Player

### 1. Get the Connected Player Profile

```bash
curl -s -G "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/" \
  --data-urlencode "steamids=$STEAM_ID" \
  | jq '.response.players[0] | {steamid, personaname, profileurl, avatarfull, loccountrycode, communityvisibilitystate}'
```

### 2. Resolve a Vanity Profile Name

Use this when the user gives a custom profile URL name instead of a 17-digit Steam ID.

```bash
curl -s -G "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/" \
  --data-urlencode "vanityurl=<vanity-name>" \
  | jq '.response | {success, steamid, message}'
```

### 3. Get Owned Games and Total Playtime

```bash
curl -s -G "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/" \
  --data-urlencode "steamid=$STEAM_ID" \
  --data-urlencode "include_appinfo=true" \
  --data-urlencode "include_played_free_games=true" \
  | jq '{game_count: .response.game_count, games: ([.response.games[]? | {appid, name, playtime_forever, playtime_2weeks, rtime_last_played}] | sort_by(.playtime_forever) | reverse | .[:20])}'
```

`playtime_forever` and `playtime_2weeks` are minutes.

### 4. Get Recently Played Games

```bash
curl -s -G "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/" \
  --data-urlencode "steamid=$STEAM_ID" \
  --data-urlencode "count=20" \
  | jq '{total_count: .response.total_count, games: [.response.games[]? | {appid, name, playtime_forever, playtime_2weeks}]}'
```

### 5. Get Playtime for One Game

Replace `<app-id>` with a Steam app ID.

```bash
curl -s -G "https://api.steampowered.com/IPlayerService/GetSingleGamePlaytime/v1/" \
  --data-urlencode "steamid=$STEAM_ID" \
  --data-urlencode "appid=<app-id>" \
  | jq '.response'
```

## Wishlist and Followed Games

### 6. Get Wishlist Items

```bash
curl -s -G "https://api.steampowered.com/IWishlistService/GetWishlist/v1/" \
  --data-urlencode "steamid=$STEAM_ID" \
  | jq '{items: [.response.items[]? | {appid, priority, date_added}], total: (.response.items | length)}'
```

### 7. Get Wishlist Item Count

```bash
curl -s -G "https://api.steampowered.com/IWishlistService/GetWishlistItemCount/v1/" \
  --data-urlencode "steamid=$STEAM_ID" \
  | jq '.response | {count}'
```

### 8. Get Sorted or Filtered Wishlist Data

```bash
curl -s -G "https://api.steampowered.com/IWishlistService/GetWishlistSortedFiltered/v1/" \
  --data-urlencode "steamid=$STEAM_ID" \
  | jq '.response'
```

### 9. Get Followed Games

```bash
curl -s -G "https://api.steampowered.com/IStoreService/GetGamesFollowed/v1/" \
  --data-urlencode "steamid=$STEAM_ID" \
  | jq '.response | {appids}'
```

```bash
curl -s -G "https://api.steampowered.com/IStoreService/GetGamesFollowedCount/v1/" \
  --data-urlencode "steamid=$STEAM_ID" \
  | jq '.response | {followed_game_count}'
```

## Social and Account Status

### 10. Get Friends

```bash
curl -s -G "https://api.steampowered.com/ISteamUser/GetFriendList/v1/" \
  --data-urlencode "steamid=$STEAM_ID" \
  --data-urlencode "relationship=friend" \
  | jq '[.friendslist.friends[]? | {steamid, relationship, friend_since}]'
```

### 11. Get Groups

```bash
curl -s -G "https://api.steampowered.com/ISteamUser/GetUserGroupList/v1/" \
  --data-urlencode "steamid=$STEAM_ID" \
  | jq '[.response.groups[]? | {gid}]'
```

### 12. Get Ban Status

```bash
curl -s -G "https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/" \
  --data-urlencode "steamids=$STEAM_ID" \
  | jq '.players[]? | {SteamId, CommunityBanned, VACBanned, NumberOfVACBans, DaysSinceLastBan, NumberOfGameBans, EconomyBan}'
```

## Badges, Achievements, and Stats

### 13. Get Steam Level

```bash
curl -s -G "https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/" \
  --data-urlencode "steamid=$STEAM_ID" \
  | jq '.response | {player_level}'
```

### 14. Get Badges

```bash
curl -s -G "https://api.steampowered.com/IPlayerService/GetBadges/v1/" \
  --data-urlencode "steamid=$STEAM_ID" \
  | jq '.response | {player_xp, player_level, player_xp_needed_to_level_up, player_xp_needed_current_level, badges: [.badges[]? | {badgeid, level, xp, completion_time, scarcity}]}'
```

### 15. Get Badge Progress

Replace `<badge-id>` with the badge ID returned by `GetBadges`.

```bash
curl -s -G "https://api.steampowered.com/IPlayerService/GetCommunityBadgeProgress/v1/" \
  --data-urlencode "steamid=$STEAM_ID" \
  --data-urlencode "badgeid=<badge-id>" \
  | jq '.response'
```

### 16. Get Player Achievements for a Game

```bash
curl -s -G "https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/" \
  --data-urlencode "steamid=$STEAM_ID" \
  --data-urlencode "appid=<app-id>" \
  | jq '.playerstats | {steamID, gameName, achievements: [.achievements[]? | {apiname, achieved, unlocktime}]}'
```

### 17. Get User Stats for a Game

```bash
curl -s -G "https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/" \
  --data-urlencode "steamid=$STEAM_ID" \
  --data-urlencode "appid=<app-id>" \
  | jq '.playerstats | {steamID, gameName, stats: [.stats[]? | {name, value}], achievements: [.achievements[]? | {name, achieved}]}'
```

### 18. Get Global Achievement Percentages

```bash
curl -s -G "https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/" \
  --data-urlencode "gameid=<app-id>" \
  | jq '.achievementpercentages.achievements[]? | {name, percent}'
```

### 19. Get Game Stats Schema

```bash
curl -s -G "https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/" \
  --data-urlencode "appid=<app-id>" \
  | jq '.game | {gameName, gameVersion, availableGameStats}'
```

### 20. Get Global Stats for a Game

Replace `<stat-name>` with a stat name from `GetSchemaForGame`.

```bash
curl -s -G "https://api.steampowered.com/ISteamUserStats/GetGlobalStatsForGame/v1/" \
  --data-urlencode "appid=<app-id>" \
  --data-urlencode "count=1" \
  --data-urlencode "name[0]=<stat-name>" \
  | jq '.response.globalstats'
```

### 21. Get Current Player Count for a Game

```bash
curl -s -G "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/" \
  --data-urlencode "appid=<app-id>" \
  | jq '.response | {player_count}'
```

## Apps and News

### 22. Search the Steam App List

`GetAppList` returns a large payload; filter it immediately.

```bash
curl -s "https://api.steampowered.com/ISteamApps/GetAppList/v2/" \
  | jq '.applist.apps[] | select(.name | test("<game-name>"; "i")) | {appid, name}' \
  | head -20
```

### 23. Get Store App List Page

```bash
curl -s -G "https://api.steampowered.com/IStoreService/GetAppList/v1/" \
  --data-urlencode "include_games=true" \
  --data-urlencode "max_results=20" \
  | jq '.response.apps[]? | {appid, name, last_modified}'
```

### 24. Get News for an App

```bash
curl -s -G "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/" \
  --data-urlencode "appid=<app-id>" \
  --data-urlencode "count=5" \
  --data-urlencode "maxlength=300" \
  | jq '.appnews.newsitems[]? | {title, url, author, date, feedlabel, contents}'
```

### 25. Check Whether an App Version Is Current

```bash
curl -s -G "https://api.steampowered.com/ISteamApps/UpToDateCheck/v1/" \
  --data-urlencode "appid=<app-id>" \
  --data-urlencode "version=<build-version>" \
  | jq '.response'
```

### 26. Get Servers at an IP Address

```bash
curl -s -G "https://api.steampowered.com/ISteamApps/GetServersAtAddress/v1/" \
  --data-urlencode "addr=<ip-address>" \
  | jq '.response'
```

### 27. Get Steam Datagram Relay Config

```bash
curl -s "https://api.steampowered.com/ISteamApps/GetSDRConfig/v1/" \
  | jq '.'
```

## Guidelines

1. Use `$STEAM_ID` for requests about the connected player. It is a 17-digit Steam ID returned by Steam OpenID.
2. Do not add `key=` manually. vm0 injects the Steam Web API key for requests to allowed Steam Web API endpoints.
3. Many player endpoints depend on the target account's privacy settings and can return empty data even when the connector is working.
4. Use `--data-urlencode` for user-provided values such as vanity names, app IDs, and stat names.
5. Keep `GetAppList` calls filtered; the response is large.
6. Public Store endpoints can be rate-limited; keep review pages modest and cache repeated app, package, and featured-list lookups.
7. Pass `cc` and `l` when prices or localized names matter.
8. All supported connector permissions are read-only. Do not attempt Store purchase, inventory mutation, or Steam partner write APIs with this connector.
