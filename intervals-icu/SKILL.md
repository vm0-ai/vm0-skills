---
name: intervals-icu
description: Intervals.icu API for fitness data. Use when user mentions "Intervals.icu",
  "cycling data", "fitness tracking", or workout analytics.
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


Verify authentication and get your athlete ID:

```bash
curl -s "https://intervals.icu/api/v1/athlete/0/activities?oldest=2025-01-01&newest=2025-12-31" --header "Authorization: Bearer $(printenv INTERVALS_ICU_TOKEN)" | jq '.[0] | {icu_athlete_id}'
```

> Save the `icu_athlete_id` value (e.g., `i230851`) for use in other endpoints that require an athlete ID.

---

> **Placeholders:** Values in `<angle-brackets>` like `<athlete-id>` are placeholders. Replace them with actual values when executing.

## How to Use

All examples below assume `INTERVALS_ICU_TOKEN` is set.

Base URL: `https://intervals.icu`

---

### 1. Get Athlete Profile

Get the authenticated athlete's profile and settings:

```bash
curl -s "https://intervals.icu/api/v1/athlete/0" --header "Authorization: Bearer $(printenv INTERVALS_ICU_TOKEN)" | jq '{id, name, firstname, lastname, email, locale, weight, icu_weight, icu_resting_hr, sex, country, city, timezone}'
```

---

### 2. List Activities

Get activities for a date range:

> **Note:** Replace `<athlete-id>` with your athlete ID. Dates are in `YYYY-MM-DD` format.

```bash
curl -s "https://intervals.icu/api/v1/athlete/<athlete-id>/activities?oldest=2025-01-01&newest=2025-01-31" --header "Authorization: Bearer $(printenv INTERVALS_ICU_TOKEN)" | jq '.[] | {id, name, type, start_date_local, moving_time, distance, total_elevation_gain, icu_training_load}'
```

---

### 3. Get Activity Details

Get details for a specific activity:

> **Note:** Replace `<activity-id>` with an actual activity ID from the "List Activities" output. Activities imported from Strava may have limited data.

```bash
curl -s "https://intervals.icu/api/v1/activity/<activity-id>" --header "Authorization: Bearer $(printenv INTERVALS_ICU_TOKEN)" | jq '{id, name, type, start_date_local, moving_time, distance, average_speed, average_watts, average_heartrate, icu_training_load}'
```

---

### 4. Get Activity Streams

Get detailed data streams (GPS, heart rate, power, etc.) for an activity:

> **Note:** Replace `<activity-id>` with an actual activity ID. Available stream types: `time`, `watts`, `heartrate`, `cadence`, `distance`, `altitude`, `latlng`, `velocity_smooth`, `temp`. Only activities with recorded sensor data will have streams.

```bash
curl -s "https://intervals.icu/api/v1/activity/<activity-id>/streams?types=watts,heartrate,cadence" --header "Authorization: Bearer $(printenv INTERVALS_ICU_TOKEN)" | jq 'keys'
```

---

### 5. Get Activity Power Curve

Get the power curve for an activity:

> **Note:** Replace `<activity-id>` with an actual activity ID. Only activities with power data will have a power curve.

```bash
curl -s "https://intervals.icu/api/v1/activity/<activity-id>/power-curve" --header "Authorization: Bearer $(printenv INTERVALS_ICU_TOKEN)" | jq '.[0:10]'
```

---

### 6. Get Wellness Data

Get wellness record for a specific date:

> **Note:** Replace `<athlete-id>` with your athlete ID and `<date>` with `YYYY-MM-DD`.

```bash
curl -s "https://intervals.icu/api/v1/athlete/<athlete-id>/wellness/<date>" --header "Authorization: Bearer $(printenv INTERVALS_ICU_TOKEN)" | jq '{id, ctl, atl, rampRate, sleepTime, sleepScore, fatigue, soreness, stress, mood, motivation, weight, restingHR, hrv}'
```

---

### 7. Update Wellness Data

Update wellness record for a date:

> **Note:** Replace `<athlete-id>` with your athlete ID and `<date>` with `YYYY-MM-DD`.

Write to `/tmp/intervals_wellness.json`:

```json
{
  "weight": 72.5,
  "restingHR": 52
}
```

```bash
curl -s -X PUT "https://intervals.icu/api/v1/athlete/<athlete-id>/wellness/<date>" --header "Authorization: Bearer $(printenv INTERVALS_ICU_TOKEN)" --header "Content-Type: application/json" -d @/tmp/intervals_wellness.json | jq '{id, weight, restingHR}'
```

---

### 8. List Calendar Events

Get planned workouts and events for a date range:

> **Note:** Replace `<athlete-id>` with your athlete ID.

```bash
curl -s "https://intervals.icu/api/v1/athlete/<athlete-id>/events?oldest=2025-01-01&newest=2025-12-31" --header "Authorization: Bearer $(printenv INTERVALS_ICU_TOKEN)" | jq '.[] | {id, start_date_local, name, category, type, description}'
```

---

### 9. Create Calendar Event

Create a planned workout or event:

> **Note:** Replace `<athlete-id>` with your athlete ID. `start_date_local` must include a time component.

Write to `/tmp/intervals_event.json`:

```json
{
  "category": "WORKOUT",
  "start_date_local": "2025-02-01T09:00:00",
  "name": "Easy Run",
  "description": "30 min easy run",
  "type": "Run"
}
```

```bash
curl -s -X POST "https://intervals.icu/api/v1/athlete/<athlete-id>/events" --header "Authorization: Bearer $(printenv INTERVALS_ICU_TOKEN)" --header "Content-Type: application/json" -d @/tmp/intervals_event.json | jq '{id, name, start_date_local, category, type}'
```

---

### 10. List Workouts

Get workouts from the workout library:

> **Note:** Replace `<athlete-id>` with your athlete ID.

```bash
curl -s "https://intervals.icu/api/v1/athlete/<athlete-id>/workouts" --header "Authorization: Bearer $(printenv INTERVALS_ICU_TOKEN)" | jq '.[] | {id, name, type, description}' | head -40
```

---

### 11. Create Manual Activity

Create a manual activity entry:

> **Note:** Replace `<athlete-id>` with your athlete ID. `start_date_local` must include a time component.

Write to `/tmp/intervals_activity.json`:

```json
{
  "type": "Run",
  "name": "Morning Run",
  "start_date_local": "2025-02-01T07:00:00",
  "moving_time": 1800,
  "distance": 5000,
  "description": "Easy morning run"
}
```

```bash
curl -s -X POST "https://intervals.icu/api/v1/athlete/<athlete-id>/activities/manual" --header "Authorization: Bearer $(printenv INTERVALS_ICU_TOKEN)" --header "Content-Type: application/json" -d @/tmp/intervals_activity.json | jq '{id, name, type, start_date_local, moving_time, distance}'
```

---

### 12. Delete Activity

Delete an activity:

> **Note:** Replace `<activity-id>` with the activity ID.

```bash
curl -s -X DELETE "https://intervals.icu/api/v1/activity/<activity-id>" --header "Authorization: Bearer $(printenv INTERVALS_ICU_TOKEN)" -w "\nHTTP Status: %{http_code}\n"
```

---

## Guidelines

1. **Athlete ID**: Use `0` as a shortcut for the authenticated athlete in the `/athlete/{id}` endpoint only. For all other endpoints, use the actual athlete ID (e.g., `i230851`).
2. **Date ranges**: Most list endpoints require `oldest` and `newest` query parameters in `YYYY-MM-DD` format.
3. **Datetime fields**: When creating activities or events, `start_date_local` must include a time component (e.g., `2025-02-01T09:00:00`), not just a date.
4. **Rate limits**: Be mindful of API rate limits. Avoid rapid successive calls.
5. **Activity types**: Common types include `Ride`, `Run`, `Swim`, `WeightTraining`, `Yoga`, `Walk`, `Hike`.
6. **Strava activities**: Activities imported from Strava may have limited data and show a note that they are not fully available via the API.
