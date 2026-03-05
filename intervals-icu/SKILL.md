---
name: intervals-icu
description: Intervals.icu API via curl. Use this skill to access training activities, wellness data, workouts, calendar events, and athlete profiles on Intervals.icu.
vm0_secrets:
  - INTERVALS_ICU_TOKEN
---

# Intervals.icu API

Use the Intervals.icu API via direct `curl` calls to access **activities, wellness, workouts, calendar events, and athlete profiles**.

> Official docs: `https://intervals.icu/api/v1/docs`

---

## When to Use

Use this skill when you need to:

- **View athlete profile** - get athlete info and settings
- **List and manage activities** - view rides, runs, and other activities with streams data
- **Track wellness** - access daily wellness records (sleep, fatigue, soreness, etc.)
- **Manage workouts** - list, create, and modify workout library entries
- **Calendar events** - view and create planned workouts and events

---

## Prerequisites

1. Connect your Intervals.icu account at [vm0 Settings > Connectors](https://app.vm0.ai/settings/connectors) and click **intervals-icu**
2. The `INTERVALS_ICU_TOKEN` environment variable is automatically configured

Verify authentication and get your athlete ID:

```bash
bash -c 'curl -s "https://intervals.icu/api/v1/athlete/0" -H "Authorization: Bearer $INTERVALS_ICU_TOKEN"' | jq '{id, name, email, locale}'
```

> The special athlete ID `0` returns the authenticated user's profile. Save the `id` value (e.g., `i230851`) for use in other endpoints.

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

> **Placeholders:** Values in `<angle-brackets>` like `<athlete-id>` are placeholders. Replace them with actual values when executing. Use the athlete ID from the profile endpoint above.

## How to Use

All examples below assume `INTERVALS_ICU_TOKEN` is set.

Base URL: `https://intervals.icu`

---

### 1. Get Athlete Profile

Get the authenticated athlete's profile:

```bash
bash -c 'curl -s "https://intervals.icu/api/v1/athlete/0" -H "Authorization: Bearer $INTERVALS_ICU_TOKEN"' | jq '{id, name, email, locale, weight, ftp, max_hr, resting_hr}'
```

---

### 2. List Activities

Get activities for a date range:

> **Note:** Replace `<athlete-id>` with your athlete ID. Dates are in `YYYY-MM-DD` format.

```bash
ATHLETE=<athlete-id> bash -c 'curl -s "https://intervals.icu/api/v1/athlete/$ATHLETE/activities?oldest=2025-01-01&newest=2025-01-31" -H "Authorization: Bearer $INTERVALS_ICU_TOKEN"' | jq '.[] | {id, name, type, start_date_local, moving_time, distance, total_elevation_gain, icu_training_load}'
```

---

### 3. Get Activity Details

Get details for a specific activity:

> **Note:** Replace `<activity-id>` with an actual activity ID from the "List Activities" output.

```bash
ACTIVITY=<activity-id> bash -c 'curl -s "https://intervals.icu/api/v1/activity/$ACTIVITY" -H "Authorization: Bearer $INTERVALS_ICU_TOKEN"' | jq '{id, name, type, start_date_local, moving_time, distance, average_speed, average_watts, average_heartrate, icu_training_load}'
```

---

### 4. Get Activity Streams

Get detailed data streams (GPS, heart rate, power, etc.) for an activity:

> **Note:** Replace `<activity-id>` with an actual activity ID. Available stream types: `time`, `watts`, `heartrate`, `cadence`, `distance`, `altitude`, `latlng`, `velocity_smooth`, `temp`.

```bash
ACTIVITY=<activity-id> bash -c 'curl -s "https://intervals.icu/api/v1/activity/$ACTIVITY/streams?types=watts,heartrate,cadence" -H "Authorization: Bearer $INTERVALS_ICU_TOKEN"' | jq 'keys'
```

---

### 5. Get Activity Power Curve

Get the power curve for an activity:

> **Note:** Replace `<activity-id>` with an actual activity ID.

```bash
ACTIVITY=<activity-id> bash -c 'curl -s "https://intervals.icu/api/v1/activity/$ACTIVITY/power-curve" -H "Authorization: Bearer $INTERVALS_ICU_TOKEN"' | jq '.[0:10]'
```

---

### 6. Get Wellness Data

Get wellness record for a specific date:

> **Note:** Replace `<athlete-id>` with your athlete ID and `<date>` with `YYYY-MM-DD`.

```bash
ATHLETE=<athlete-id> DATE=<date> bash -c 'curl -s "https://intervals.icu/api/v1/athlete/$ATHLETE/wellness/$DATE" -H "Authorization: Bearer $INTERVALS_ICU_TOKEN"' | jq '{id, ctl, atl, rampRate, sleepTime, sleepScore, fatigue, soreness, stress, mood, motivation, weight, restingHR, hrv}'
```

---

### 7. Update Wellness Data

Update wellness record for a date:

> **Note:** Replace `<athlete-id>` with your athlete ID and `<date>` with `YYYY-MM-DD`.

```bash
ATHLETE=<athlete-id> DATE=<date> bash -c 'curl -s -X PUT "https://intervals.icu/api/v1/athlete/$ATHLETE/wellness/$DATE" -H "Authorization: Bearer $INTERVALS_ICU_TOKEN" -H "Content-Type: application/json" -d "{\"weight\":72.5,\"restingHR\":52}"' | jq '{id, weight, restingHR}'
```

---

### 8. List Calendar Events

Get planned workouts and events for a date range:

> **Note:** Replace `<athlete-id>` with your athlete ID.

```bash
ATHLETE=<athlete-id> bash -c 'curl -s "https://intervals.icu/api/v1/athlete/$ATHLETE/events?oldest=2025-01-01&newest=2025-01-31" -H "Authorization: Bearer $INTERVALS_ICU_TOKEN"' | jq '.[] | {id, start_date_local, name, category, type, description}'
```

---

### 9. Create Calendar Event

Create a planned workout or event:

> **Note:** Replace `<athlete-id>` with your athlete ID.

```bash
ATHLETE=<athlete-id> bash -c 'curl -s -X POST "https://intervals.icu/api/v1/athlete/$ATHLETE/events" -H "Authorization: Bearer $INTERVALS_ICU_TOKEN" -H "Content-Type: application/json" -d "{\"category\":\"WORKOUT\",\"start_date_local\":\"2025-02-01\",\"name\":\"Easy Run\",\"description\":\"30 min easy run\",\"type\":\"Run\"}"' | jq '{id, name, start_date_local, category, type}'
```

---

### 10. List Workouts

Get workouts from the workout library:

> **Note:** Replace `<athlete-id>` with your athlete ID.

```bash
ATHLETE=<athlete-id> bash -c 'curl -s "https://intervals.icu/api/v1/athlete/$ATHLETE/workouts" -H "Authorization: Bearer $INTERVALS_ICU_TOKEN"' | jq '.[] | {id, name, type, description}' | head -40
```

---

### 11. Create Manual Activity

Create a manual activity entry:

> **Note:** Replace `<athlete-id>` with your athlete ID.

```bash
ATHLETE=<athlete-id> bash -c 'curl -s -X POST "https://intervals.icu/api/v1/athlete/$ATHLETE/activities/manual" -H "Authorization: Bearer $INTERVALS_ICU_TOKEN" -H "Content-Type: application/json" -d "{\"type\":\"Run\",\"name\":\"Morning Run\",\"start_date_local\":\"2025-02-01T07:00:00\",\"moving_time\":1800,\"distance\":5000,\"description\":\"Easy morning run\"}"' | jq '{id, name, type, start_date_local, moving_time, distance}'
```

---

### 12. Delete Activity

Delete an activity:

> **Note:** Replace `<activity-id>` with the activity ID.

```bash
ACTIVITY=<activity-id> bash -c 'curl -s -X DELETE "https://intervals.icu/api/v1/activity/$ACTIVITY" -H "Authorization: Bearer $INTERVALS_ICU_TOKEN" -w "\nHTTP Status: %{http_code}\n"'
```

---

## Guidelines

1. **Athlete ID**: Use `0` as a shortcut for the authenticated athlete in the `/athlete/{id}` endpoint. For other endpoints, use the actual athlete ID (e.g., `i230851`).
2. **Date ranges**: Most list endpoints require `oldest` and `newest` query parameters in `YYYY-MM-DD` format.
3. **Rate limits**: Be mindful of API rate limits. Avoid rapid successive calls.
4. **Activity types**: Common types include `Ride`, `Run`, `Swim`, `WeightTraining`, `Yoga`, `Walk`, `Hike`.
