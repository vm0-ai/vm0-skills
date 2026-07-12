---
name: nintendo-switch-parental-controls
description: Use the connected Nintendo Switch Parental Controls app API to inspect supervised Nintendo Switch or Switch 2 activity and manage announcements, GameChat, play timers, devices, notifications, restrictions, and account data. Trigger for family play-time summaries, supervised console activity, Nintendo parental settings, GameChat requests, device labels, or troubleshooting the Nintendo Switch Parental Controls connector.
---

# Nintendo Switch Parental Controls

Use the vm0 connector to call the Nintendo Switch Parental Controls app protocol. This skill describes capabilities and request formats; the user controls which firewall permission groups are enabled.

Play summaries, GameChat data, device records, and account responses can identify children, local players, friends, consoles, and household activity. Return only the data needed for the user's request. Treat unlock codes, synchronized PINs, serial numbers, pairing data, notification tokens, and connector credentials as secrets.

This integration documents every API route observed in Nintendo Switch Parental Controls 2.4.0, build 660: one Nintendo Account profile route and all 45 app action routes. It is a private app protocol and can change without notice.

## Prerequisites and Runtime Bindings

- Connect **Nintendo Switch Parental Controls** under vm0.ai -> Settings -> Connectors with the adult Nintendo Account used by the app.
- Use `https://app.lp1.znma.srv.nintendo.net` for app actions.
- Use `https://api.accounts.nintendo.com` only for the Nintendo Account profile route listed below.
- Let vm0 inject the app identity, version, language, smart-device ID, and credential headers. Do not add or replace `X-Moon-*` headers.
- Never print, persist, return, or enable shell tracing around credential environment values.

The connector exposes:

- `$NINTENDO_SWITCH_PARENTAL_CONTROLS_TOKEN`: ID token for `/v2/actions/*` and `/v3/actions/*`.
- `$NINTENDO_SWITCH_PARENTAL_CONTROLS_ACCOUNT_TOKEN`: account token for `/2.0.0/users/me`.
- `$NINTENDO_SWITCH_PARENTAL_CONTROLS_SMART_DEVICE_ID`: registered app-instance ID.
- `$NINTENDO_SWITCH_PARENTAL_CONTROLS_LANGUAGE`: Nintendo profile language.
- `$NINTENDO_SWITCH_PARENTAL_CONTROLS_DEVICE_CATALOG`: sanitized JSON containing only `deviceId` and `label`.

Check the connection without exposing credentials:

```bash
zero doctor check-connector --env-name NINTENDO_SWITCH_PARENTAL_CONTROLS_TOKEN
zero doctor check-connector --env-name NINTENDO_SWITCH_PARENTAL_CONTROLS_ACCOUNT_TOKEN
zero doctor check-connector --url https://app.lp1.znma.srv.nintendo.net/v2/actions/user/fetchUser --method GET
```

## Request Conventions

Set non-secret convenience variables:

```bash
ACTION_BASE=https://app.lp1.znma.srv.nintendo.net
ACCOUNT_BASE=https://api.accounts.nintendo.com
```

For the special Nintendo Account profile request `GET $ACCOUNT_BASE/2.0.0/users/me`, include `X-VM0-Connector-Intent: nintendo-switch-parental-controls`.

For an action `GET`, pass query values with `--data-urlencode`:

```bash
curl -fsS -G "$ACTION_BASE/v2/actions/playSummary/fetchDailySummaries" \
  --header "Authorization: Bearer $NINTENDO_SWITCH_PARENTAL_CONTROLS_TOKEN" \
  --data-urlencode "deviceId=$DEVICE_ID" \
  | jq .
```

For an action `POST`, send exactly one JSON object and set its media type:

```bash
BODY="$(jq -cn \
  --arg deviceId "$DEVICE_ID" \
  --arg label "$NEW_LABEL" \
  '{deviceId: $deviceId, label: $label}')"

curl -fsS -X POST "$ACTION_BASE/v3/actions/device/updateDeviceLabel" \
  --header "Authorization: Bearer $NINTENDO_SWITCH_PARENTAL_CONTROLS_TOKEN" \
  --header "Content-Type: application/json" \
  --data "$BODY" \
  | jq .

unset BODY
```

For a bodyless `POST`, omit `--data`:

```bash
curl -fsS -X POST "$ACTION_BASE/v2/actions/user/clearAlarmSettingNotice" \
  --header "Authorization: Bearer $NINTENDO_SWITCH_PARENTAL_CONTROLS_TOKEN" \
  | jq .
```

Field names and enum strings are case-sensitive. Encode integers as JSON numbers, booleans as JSON booleans, and nullable fields as explicit `null` when the schema below says they are nullable. Do not turn a bodyless request into `{}`.

## Identifier and State Sources

- Read `deviceId` and `label` from the sanitized catalog:

  ```bash
  printf '%s\n' "$NINTENDO_SWITCH_PARENTAL_CONTROLS_DEVICE_CATALOG" \
    | jq -r '.devices[] | [.deviceId, .label] | @tsv'
  ```

- Read `playerId` from daily play summaries or GameChat responses.
- Read `connectionId` from `fetchCameraChatRequests`.
- Read `targetNsaId` from `fetchChatRequests`, `fetchChatSetting`, or the corresponding GameChat relationship response.
- Read current restriction objects and etags from `fetchParentalControlSetting` immediately before changing restrictions or play timers.
- Read current device/federation state from `fetchOwnedDevice`, `fetchOwnedDevices`, or `checkDeviceFederation` before device lifecycle operations.
- Use `$NINTENDO_SWITCH_PARENTAL_CONTROLS_LANGUAGE` for `appLanguage`.
- Use `$NINTENDO_SWITCH_PARENTAL_CONTROLS_SMART_DEVICE_ID` only where the catalog explicitly requires `smartDeviceId`; never print it.

The verified summary routes are not paginated. An empty list is a valid result. Response fields can vary by console generation and app version, so inspect the response before selecting or aggregating fields.

Before a mutation, confirm the exact target and requested effect with the user. After it succeeds, reread the related resource instead of assuming the returned shape represents final state.

## Complete API Catalog

The permission name above each table is the firewall group to use when the user's current policy does not permit a requested call. Each verified route appears exactly once below.

### `nintendo-switch-parental-controls-account-read`

| Method and route | Inputs | Use |
|---|---|---|
| `GET https://api.accounts.nintendo.com/2.0.0/users/me` | None; use the account token | Read Nintendo Account `id`, nickname, country, and language. |
| `GET /v2/actions/user/fetchUser` | None | Read the Parental Controls app user and notification state. |

Account profile example:

```bash
curl -fsS "$ACCOUNT_BASE/2.0.0/users/me" \
  --header "Authorization: Bearer $NINTENDO_SWITCH_PARENTAL_CONTROLS_ACCOUNT_TOKEN" \
  --header "X-VM0-Connector-Intent: nintendo-switch-parental-controls" \
  | jq '{id, nickname, country, language}'
```

### `nintendo-switch-parental-controls-announcements-read`

| Method and route | Inputs | Use |
|---|---|---|
| `GET /v2/actions/announcement/fetchAnnouncements` | Query: `appLanguage` | Read app announcements for the profile language. |

### `nintendo-switch-parental-controls-game-chat-read`

| Method and route | Inputs | Use |
|---|---|---|
| `GET /v2/actions/chat/fetchCameraChatRequests` | None | List pending camera-chat connections and obtain `connectionId`. |
| `GET /v2/actions/chat/fetchCameraSetting` | Query: `deviceId`, `playerId` | Read a player's camera setting. |
| `GET /v2/actions/chat/fetchChatRequests` | Query: `deviceId`, `playerId` | List GameChat relationship requests and obtain `targetNsaId`. |
| `GET /v2/actions/chat/fetchChatSetting` | Query: `deviceId` | Read GameChat settings and supervised-player relationships for a device. |
| `GET /v2/actions/chat/fetchTermOfUse` | Query: `appLanguage`, `deviceId`, `playerId` | Read the applicable GameChat terms. |

### `nintendo-switch-parental-controls-play-summary-read`

| Method and route | Inputs | Use |
|---|---|---|
| `GET /v2/actions/playSummary/fetchDailySummaries` | Query: `deviceId` | Read daily title/player activity and discover `playerId`. |
| `GET /v2/actions/playSummary/fetchLatestMonthlySummary` | Query: `deviceId` | Read the latest monthly summary. |
| `GET /v2/actions/playSummary/fetchMonthlySummary` | Query: `deviceId`, integer `year`, integer `month`, boolean `containLatest` | Read a specific month. Use `containLatest=true` when the current partial month is needed. |

### `nintendo-switch-parental-controls-device-credentials-read`

These responses can contain serial numbers, synchronized unlock codes, or pairing state. Extract only fields required for the user's operation.

| Method and route | Inputs | Use |
|---|---|---|
| `GET /v3/actions/device/fetchExtraPlayingTimeState` | Query: `deviceId` | Read extra-time status and remaining/current additional time. |
| `GET /v3/actions/deviceFederation/checkDeviceFederation` | Query: `deviceId` | Read pairing/federation state for one device. |
| `GET /v3/actions/user/fetchOwnedDevice` | Query: `deviceId` | Read one complete owned-device record. |
| `GET /v3/actions/user/fetchOwnedDevices` | None | Read all complete owned-device records and their order. |

### `nintendo-switch-parental-controls-settings-credentials-read`

The response contains the current unlock code together with restriction state. Do not return the code unless the user specifically requested it.

| Method and route | Inputs | Use |
|---|---|---|
| `GET /v3/actions/parentalControlSetting/fetchParentalControlSetting` | Query: `deviceId` | Read `parentalControlSetting`, `ownedDevice`, current etags, restrictions, timer regulations, and extended play time. |

### `nintendo-switch-parental-controls-game-chat-write`

| Method and route | JSON body | Use and value source |
|---|---|---|
| `POST /v2/actions/chat/acceptCameraChatRequest` | `{"deviceId": string, "connectionId": string}` | Accept a connection returned by `fetchCameraChatRequests`. |
| `POST /v2/actions/chat/acceptChatRequest` | `{"deviceId": string, "playerId": string, "targetNsaId": string, "memo": string\|null}` | Accept a request returned by `fetchChatRequests`; include the user's requested memo or `null`. |
| `POST /v2/actions/chat/agreeChildTerm` | `{"deviceId": string, "playerId": string}` | Record agreement for the selected supervised player after showing the applicable terms. |
| `POST /v2/actions/chat/checkRelationship` | `{"deviceId": string, "playerId": string}` | Ask the service which relationship action is applicable. |
| `POST /v2/actions/chat/rejectCameraChatRequest` | `{"deviceId": string, "connectionId": string}` | Reject a connection returned by `fetchCameraChatRequests`. |
| `POST /v2/actions/chat/rejectChatRequest` | `{"deviceId": string, "playerId": string, "targetNsaId": string}` | Reject a request returned by `fetchChatRequests`. |
| `POST /v2/actions/chat/requestRelationshipCorrection` | `{"deviceId": string, "playerId": string, "correction": string}` | Send the correction indicated by `checkRelationship`; do not invent a correction value. |
| `POST /v2/actions/chat/suspendCameraChat` | `{"deviceId": string, "connectionId": string}` | Suspend an existing camera-chat connection. |
| `POST /v2/actions/chat/updateCameraChatSetting` | `{"deviceId": string, "connectionId": string, "visibleRange": string}` | Set `visibleRange` to `RECEIVED_ONLY`, `FACE`, `BODY`, or `BACKGROUND`. |
| `POST /v2/actions/chat/updateCameraSetting` | `{"deviceId": string, "playerId": string, "allowedSpan": string}` | Set `allowedSpan` to `NOT_ALLOWED` or `REQUIRED_CONFIRMED`. |
| `POST /v2/actions/chat/updateMemo` | `{"deviceId": string, "playerId": string, "targetNsaId": string, "memo": string}` | Replace the memo for the selected relationship. |
| `POST /v2/actions/chat/withdrawChatRequest` | `{"deviceId": string, "playerId": string, "targetNsaId": string}` | Withdraw a previously sent relationship request. |

Known `correction` strings are `JOIN_FAMILY_AND_BECOME_SUPERVISOR`, `BECOME_SUPERVISOR`, `MAKE_PLAYER_AS_SUPERVISED`, `INVITE_PLAYER_AS_SUPERVISED`, `REQUEST_PLAYER_AS_SUPERVISED`, `SHOW_HELP_FIX_INCORRECT_ROLE`, `SHOW_HELP_FIX_SPITTED_FAMILY`, `SHOW_HELP_FIX_ALONE_FAMILY`, `REQUIRE_PHONE_NUMBER_REGISTRATION`, `REQUIRE_PHONE_NUMBER_AUTHENTICATION`, `SHOW_CHILD_AGREEMENT_FORM`, and `NONE`. Use only the value returned for the current relationship.

### `nintendo-switch-parental-controls-play-time-write`

| Method and route | JSON body | Use and value source |
|---|---|---|
| `POST /v2/actions/device/confirmExtraPlayingTime` | `{"deviceId": string, "additionalTime": integer, "withBedtime": boolean}` | Confirm the exact extra minutes and bedtime behavior requested by the user. |
| `POST /v2/actions/device/updateExtraPlayingTime` | `{"deviceId": string, "status": string, "additionalTime": integer\|null}` | Use `TO_ADDED`, `TO_CANCELED`, or `TO_INFINITY`; reread extra-time state first. |
| `POST /v3/actions/parentalControlSetting/updatePlayTimer` | `{"deviceId": string, "playTimerRegulations": object}` | Copy the current `playTimerRegulations` object from `fetchParentalControlSetting`, modify only requested fields, and preserve the complete object. |

`playTimerRegulations` contains `timerMode`, `restrictionMode`, `dailyRegulations`, and `eachDayOfTheWeekRegulations`. Preserve nested `timeToPlayInOneDay` and `bedtime` objects and all weekday keys returned by the service.

### `nintendo-switch-parental-controls-device-pairing-write`

| Method and route | JSON body | Use and value source |
|---|---|---|
| `POST /v2/actions/deviceFederation/startDeviceFederation` | No body | Start the official device-pairing flow. |
| `POST /v2/actions/user/confirmCopiedOwnedDevice` | `{"deviceId": string}` | Confirm an owned-device record copied during migration/pairing. |
| `POST /v3/actions/federation` | `{"smartDeviceInfo": object}` | Register the connector app instance. This is connector lifecycle infrastructure; routine tasks should not call it. |

The `smartDeviceInfo` object requires `id`, `bundleId`, `os`, `osVersion`, `modelName`, `timeZone`, `appVersion`, `osLanguage`, `appLanguage`, and nullable `notificationToken`. `appVersion` requires `displayedVersion` and integer `internalVersion`. Use the connector's registered values; never create a second identity or substitute another `id`.

### `nintendo-switch-parental-controls-feedback-write`

| Method and route | JSON body | Use |
|---|---|---|
| `POST /v2/actions/feedback/sendFeedback` | `{"type": string, "content": string}` | Send user-approved feedback. `type` is `PLAYING_SUMMARY`, `PARENTAL_CONTROL_SETTING`, `CHAT`, `UNLOCK_CODE`, `EXPECTED_FUNCTION`, `BUG`, or `OTHER`. |

### `nintendo-switch-parental-controls-smart-device-write`

| Method and route | JSON body | Use |
|---|---|---|
| `POST /v2/actions/logout` | `{"smartDeviceId": string}` | Unregister the current app session. Use the connector smart-device ID; reconnect after logout. |
| `POST /v2/actions/smartDevice/updateNotificationToken` | `{"smartDeviceId": string, "notificationToken": string}` | Update a real mobile push token. The connector does not provide or consume one, so do not fabricate it. |

### `nintendo-switch-parental-controls-settings-write`

| Method and route | JSON body | Use and value source |
|---|---|---|
| `POST /v2/actions/parentalControlSetting/updateRestrictionLevel` | `{"deviceId": string, "vrRestrictionEtag": string, "parentalControlSettingEtag": string, "functionalRestrictionLevel": string, "customSettings": object, "whitelistedApplicationList": array}` | Reread settings, preserve etags and untouched fields, then change only the requested restriction fields. |
| `POST /v2/actions/parentalControlSetting/updateUnlockCode` | `{"deviceId": string, "unlockCode": string}` | Change the console unlock code after explicit confirmation; never echo the value. |

For `updateRestrictionLevel`, source `parentalControlSettingEtag` from `parentalControlSetting.etag`. Preserve the current `vrRestrictionEtag`, `functionalRestrictionLevel`, `customSettings`, and `whitelistedApplicationList` unless the user requested that specific change. `customSettings` includes age, UGC, social-posting, rating-organization, and VR restriction fields; copy the service object rather than rebuilding it from guesses.

### `nintendo-switch-parental-controls-device-write`

| Method and route | JSON body | Use and value source |
|---|---|---|
| `POST /v3/actions/device/unregisterDevice` | `{"deviceId": string}` | Remove the selected console from parental supervision. |
| `POST /v3/actions/device/updateDeviceLabel` | `{"deviceId": string, "label": string}` | Rename the selected console. |
| `POST /v3/actions/user/updateOwnedDeviceSortOrder` | `{"deviceIds": string[]}` | Send the complete desired device order, not a partial list. |

### `nintendo-switch-parental-controls-notifications-write`

| Method and route | JSON body | Use |
|---|---|---|
| `POST /v2/actions/user/clearAlarmSettingNotice` | No body | Clear the current alarm-setting notice. |
| `POST /v2/actions/user/updateNotificationSetting` | `{"notificationSetting": {"all": boolean, "relatedChildren": boolean, "announcement": boolean}}` | Replace all three notification flags together; preserve flags the user did not ask to change. |

### `nintendo-switch-parental-controls-summary-acknowledgement-write`

| Method and route | JSON body | Use |
|---|---|---|
| `POST /v3/actions/user/confirmFirstDailySummary` | `{"deviceId": string}` | Mark the first daily summary as seen for the selected device. |
| `POST /v3/actions/user/confirmNewMonthlySummary` | `{"deviceId": string}` | Mark the new monthly summary as seen for the selected device. |

## Operational Safety

- Confirm `deviceId`, `playerId`, `connectionId`, `targetNsaId`, dates, and requested effects; the firewall matches method and route, not ownership or intent.
- Never reveal, guess, or store unlock codes, synchronized PINs, pairing codes, serial numbers, notification tokens, or credential environment values.
- Read current state immediately before requests that require etags or replace complete objects.
- Do not guess POST bodies, omit required keys, or reuse identifiers from another response/account.
- Do not call federation, notification-token, or logout routes as routine setup. The connector owns its app-instance lifecycle.
- Do not call hidden legacy `/moon/v1` APIs; none are present in app 2.4.0.
- If a route or schema changes after an app update, stop and revalidate the protocol instead of probing nearby routes.

## Troubleshooting

- **401 or expired connection:** let vm0 refresh once, then reconnect if the request still fails. Never expose a token while debugging.
- **Firewall permission not enabled:** report the exact permission group from the catalog and let the user decide its policy.
- **Empty or stale device catalog:** confirm the console is linked in the official app, then reconnect the connector.
- **No play summaries:** confirm the device has activity for the requested period; do not silently try other devices or dates.
- **No GameChat identifiers/data:** read daily summaries and the relevant GameChat list first; the player, account, or region may not support GameChat.
- **409 or etag conflict:** reread the current settings and rebuild the requested change once. Do not retry a stale body.
- **Schema or route error:** record the app version and stop instead of guessing.
- **Logout completed:** reconnect explicitly; do not silently re-federate.
