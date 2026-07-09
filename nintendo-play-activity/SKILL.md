---
name: nintendo-play-activity
description: Nintendo Play Activity API for connected Nintendo Account play history, recently played Nintendo games, and playtime from Nintendo Store / My Nintendo app. Use when the user asks about Nintendo Switch play activity, Nintendo play history, Nintendo game playtime, or recently played Nintendo games.
---

# Nintendo Play Activity

Use the Nintendo Play Activity connector for connected Nintendo Account play history and playtime data from Nintendo Store / My Nintendo app.

This connector is not the public Nintendo eShop catalog and does not provide eShop search, prices, wishlists, friends, Nintendo Switch Online, Parental Controls, SplatNet, NookLink, purchase history, or write actions.

## Troubleshooting

If requests fail, run:

```bash
zero doctor check-connector --env-name NINTENDO_PLAY_ACTIVITY_TOKEN
zero doctor check-connector --url https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories --method GET
zero doctor check-connector --url https://mypage-api.entry.nintendo.co.jp/api/v1/users/me/play_histories --method GET
```

## Prerequisites

- Connect Nintendo Play Activity under vm0.ai -> Settings -> Connectors.
- The connector exposes `$NINTENDO_PLAY_ACTIVITY_TOKEN` for authenticated Nintendo Play Activity API requests.
- Send the token only with `Authorization: Bearer $NINTENDO_PLAY_ACTIVITY_TOKEN`.
- The connector is read-only and currently allows only:
  - `GET https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories`
  - `GET https://mypage-api.entry.nintendo.co.jp/api/v1/users/me/play_histories`
- These are Nintendo app endpoints and response fields can vary by account, region, and Nintendo API changes. Inspect the raw response before assuming field names.

## 1. Get Nintendo Store App Play Activity

```bash
curl -s "https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories" \
  --header "Authorization: Bearer $NINTENDO_PLAY_ACTIVITY_TOKEN" \
  | jq .
```

## 2. Get My Nintendo Play Activity

```bash
curl -s "https://mypage-api.entry.nintendo.co.jp/api/v1/users/me/play_histories" \
  --header "Authorization: Bearer $NINTENDO_PLAY_ACTIVITY_TOKEN" \
  | jq .
```

## 3. Try Both Play Activity Sources

Use this when one source returns an empty list or a non-200 response for the connected account.

```bash
for url in \
  "https://app-api.znej.nintendo.com/api/v2.0/users/me/play_histories" \
  "https://mypage-api.entry.nintendo.co.jp/api/v1/users/me/play_histories"
do
  status=$(curl -sS -o /tmp/nintendo-play-activity.json -w "%{http_code}" "$url" \
    --header "Authorization: Bearer $NINTENDO_PLAY_ACTIVITY_TOKEN")

  if [ "$status" = "200" ]; then
    jq . /tmp/nintendo-play-activity.json
    break
  fi

  printf "%s returned HTTP %s\n" "$url" "$status" >&2
done
```

## 4. Summarize Common Play History Fields

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

## Guidelines

1. Start with the raw response, then adapt parsing to the fields Nintendo returns for the account.
2. Use only the two allowed `GET` play history endpoints.
3. Treat empty responses as possible account, privacy, region, or Nintendo API behavior instead of assuming the user has no play history.
4. Do not call unsupported Nintendo APIs with this connector.
5. For public catalog, metadata, and pricing requests, use the `nintendo-eshop-catalog` skill instead.
