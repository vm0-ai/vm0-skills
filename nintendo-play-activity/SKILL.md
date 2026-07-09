---
name: nintendo-play-activity
description: Nintendo Play Activity API for connected Nintendo Account profile, play history, recently played Nintendo games, and playtime from Nintendo Store / My Nintendo app. Use when the user asks about Nintendo Account profile data, Nintendo Switch play activity, Nintendo play history, Nintendo game playtime, or recently played Nintendo games.
---

# Nintendo Play Activity

Use the Nintendo Play Activity connector for connected Nintendo Account profile, play history, and playtime data from Nintendo Store / My Nintendo app.

This connector is not the public Nintendo eShop catalog and does not provide eShop search, prices, wishlists, friends, Nintendo Switch Online, Parental Controls, SplatNet, NookLink, purchase history, or write actions.

## Troubleshooting

If requests fail, run:

```bash
zero doctor check-connector --env-name NINTENDO_PLAY_ACTIVITY_TOKEN
zero doctor check-connector --url https://api.accounts.nintendo.com/2.0.0/users/me --method GET
zero doctor check-connector --url https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories --method GET
```

## Prerequisites

- Connect Nintendo Play Activity under vm0.ai -> Settings -> Connectors.
- The connector exposes `$NINTENDO_PLAY_ACTIVITY_TOKEN` for authenticated Nintendo Play Activity API requests.
- The connector derives the Nintendo profile locale during connection/refresh and vm0 injects required Nintendo app headers, including `User-Agent` and `gentry-locale`, for allowed endpoints.
- Send the token only with `Authorization: Bearer $NINTENDO_PLAY_ACTIVITY_TOKEN`.
- The connector is read-only and currently allows only:
  - `GET https://api.accounts.nintendo.com/2.0.0/users/me`
  - `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories`
- These are Nintendo app endpoints and response fields can vary by account, region, and Nintendo API changes. Inspect the raw response before assuming field names.
- Play history responses commonly include `playHistories`, `recentPlayHistories`, `hiddenTitleList`, and `lastUpdatedAt`.

## 1. Get Nintendo Account Profile

Use this for the connected account nickname, country, language, birthday, and Mii fields when Nintendo returns them.

```bash
curl -s "https://api.accounts.nintendo.com/2.0.0/users/me" \
  --header "Authorization: Bearer $NINTENDO_PLAY_ACTIVITY_TOKEN" \
  | jq '{id, nickname, country, language, birthday, mii}'
```

## 2. Get Nintendo Store App Play Activity

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories" \
  --header "Authorization: Bearer $NINTENDO_PLAY_ACTIVITY_TOKEN" \
  | jq .
```

## 3. Summarize Common Play History Fields

Inspect the raw response first. This example handles several common container and field names, but Nintendo may return different shapes.

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories" \
  --header "Authorization: Bearer $NINTENDO_PLAY_ACTIVITY_TOKEN" \
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

## 4. Summarize Recent Daily Play Activity

Use `recentPlayHistories` when the user asks what they played recently or how long they played on each recent day.

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories" \
  --header "Authorization: Bearer $NINTENDO_PLAY_ACTIVITY_TOKEN" \
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

## Guidelines

1. Start with the raw response, then adapt parsing to the fields Nintendo returns for the account.
2. Use only the allowed `GET` account profile and Nintendo Store app play history endpoints.
3. Treat empty responses as valid API results; inspect raw fields such as `hiddenTitleList` and `lastUpdatedAt` before concluding that no play history exists.
