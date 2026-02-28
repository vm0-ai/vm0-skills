---
name: strava
description: Strava API v3 via curl. Use this skill to query athlete activities, segments, clubs, gear, and routes on Strava. Use when users mention Strava, running/cycling activities, fitness tracking, or want to retrieve workout data.
vm0_secrets:
  - STRAVA_ACCESS_TOKEN
---

# Strava API

Use the Strava API v3 via `curl` to access **athlete activities, segments, clubs, gear, and routes**.

> Official docs: `https://developers.strava.com/docs/reference/`

---

## Prerequisites

1. Go to https://www.strava.com/settings/api and create an application
2. Complete the OAuth 2.0 flow to obtain an access token (see [Strava authentication docs](https://developers.strava.com/docs/authentication/))
3. Set the environment variable:

```bash
export STRAVA_ACCESS_TOKEN="your-access-token"
```

> Access tokens expire every **6 hours**. Use your refresh token to obtain a new one when needed.

---

> **Important:** When using `$VAR` with pipes, wrap the command in `bash -c '...'` to avoid a Claude Code bug where variables are silently cleared.

---

## Available Scopes

| Scope | Access |
|-------|--------|
| `read` | Public segments, routes, profiles, club feeds, leaderboards |
| `read_all` | Private routes, segments, and events |
| `profile:read_all` | All profile info regardless of visibility |
| `profile:write` | Update athlete weight, FTP, manage segment stars |
| `activity:read` | Visible activities (Everyone/Followers only) |
| `activity:read_all` | All activities including "Only You" + privacy zones |
| `activity:write` | Create manual activities, process uploads, edit activities |

---

## Rate Limits

- **200 requests / 15 min**, **2,000 requests / day** (overall)
- **100 requests / 15 min**, **1,000 requests / day** (non-upload)
- Returns `429 Too Many Requests` when exceeded
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Usage`

---

## How to Use

Base URL: `https://www.strava.com/api/v3`

### 1. Get Authenticated Athlete Profile

```bash
bash -c 'curl -s "https://www.strava.com/api/v3/athlete" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '{id, firstname, lastname, city, country, sex, premium, created_at, follower_count, friend_count}'
```

---

### 2. Get Athlete Statistics

```bash
ATHLETE_ID="<athlete-id>"

bash -c 'curl -s "https://www.strava.com/api/v3/athletes/$ATHLETE_ID/stats" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '{recent_run_totals, recent_ride_totals, ytd_run_totals, ytd_ride_totals, all_run_totals, all_ride_totals}'
```

> Use the `id` from the athlete profile above as `ATHLETE_ID`.

---

### 3. List Recent Activities

```bash
bash -c 'curl -s "https://www.strava.com/api/v3/athlete/activities?per_page=30" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '.[] | {id, name, type, distance, moving_time, elapsed_time, total_elevation_gain, start_date_local, average_speed, max_speed}'
```

Query parameters:
- `before=EPOCH` - Activities before timestamp
- `after=EPOCH` - Activities after timestamp
- `page=1` - Page number
- `per_page=30` - Results per page (max 200)

---

### 4. Get Activity Details

```bash
ACTIVITY_ID="<activity-id>"

bash -c 'curl -s "https://www.strava.com/api/v3/activities/$ACTIVITY_ID" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '{id, name, type, distance, moving_time, elapsed_time, total_elevation_gain, average_speed, max_speed, average_heartrate, max_heartrate, calories, description, gear_id}'
```

---

### 5. Create Manual Activity

```bash
bash -c 'curl -s -X POST "https://www.strava.com/api/v3/activities" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN" --header "Content-Type: application/json" -d '"'"'{"name":"Morning Run","type":"Run","start_date_local":"2024-01-15T08:00:00Z","elapsed_time":3600,"distance":10000,"description":"Easy morning run"}'"'"'' | jq '{id, name, type, distance}'
```

Required fields: `name`, `type`, `start_date_local` (ISO 8601), `elapsed_time` (seconds)
Optional: `distance` (meters), `description`, `trainer` (0/1), `commute` (0/1)

Activity types: `Run`, `Ride`, `Swim`, `Walk`, `Hike`, `WeightTraining`, `Yoga`, `Workout`, etc.

---

### 6. Update Activity

```bash
ACTIVITY_ID="<activity-id>"

bash -c 'curl -s -X PUT "https://www.strava.com/api/v3/activities/$ACTIVITY_ID" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN" --header "Content-Type: application/json" -d '"'"'{"name":"Updated Name","description":"Updated description","commute":false}'"'"'' | jq '{id, name, description}'
```

---

### 7. List Activity Comments

```bash
ACTIVITY_ID="<activity-id>"

bash -c 'curl -s "https://www.strava.com/api/v3/activities/$ACTIVITY_ID/comments" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '.[] | {id, text, created_at, athlete: .athlete.firstname}'
```

---

### 8. List Activity Kudoers

```bash
ACTIVITY_ID="<activity-id>"

bash -c 'curl -s "https://www.strava.com/api/v3/activities/$ACTIVITY_ID/kudos" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '.[] | {id, firstname, lastname}'
```

---

### 9. Get Activity Laps

```bash
ACTIVITY_ID="<activity-id>"

bash -c 'curl -s "https://www.strava.com/api/v3/activities/$ACTIVITY_ID/laps" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '.[] | {id, name, elapsed_time, distance, average_speed, average_heartrate}'
```

---

### 10. List Starred Segments

```bash
bash -c 'curl -s "https://www.strava.com/api/v3/segments/starred" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '.[] | {id, name, distance, average_grade, maximum_grade, city, state, country}'
```

---

### 11. Get Segment Details

```bash
SEGMENT_ID="<segment-id>"

bash -c 'curl -s "https://www.strava.com/api/v3/segments/$SEGMENT_ID" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '{id, name, activity_type, distance, average_grade, maximum_grade, elevation_high, elevation_low, city, country, effort_count, athlete_count, kom}'
```

---

### 12. Get Segment Leaderboard

```bash
SEGMENT_ID="<segment-id>"

bash -c 'curl -s "https://www.strava.com/api/v3/segments/$SEGMENT_ID/leaderboard?per_page=10" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '{entry_count, entries: [.entries[] | {rank, athlete_name, elapsed_time, moving_time, start_date_local}]}'
```

Parameters: `gender` (M/F), `age_group`, `weight_class`, `following` (true/false), `per_page`

---

### 13. Get Athlete's Gear

```bash
bash -c 'curl -s "https://www.strava.com/api/v3/athlete" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '{bikes: .bikes, shoes: .shoes}'
```

---

### 14. Get Gear Details

```bash
GEAR_ID="<gear-id>"

bash -c 'curl -s "https://www.strava.com/api/v3/gear/$GEAR_ID" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '{id, name, brand_name, model_name, distance, converted_distance}'
```

> Bike IDs start with `b`, shoe IDs start with `g`.

---

### 15. List Athlete Clubs

```bash
bash -c 'curl -s "https://www.strava.com/api/v3/athlete/clubs" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '.[] | {id, name, sport_type, city, country, member_count}'
```

---

### 16. Get Club Details

```bash
CLUB_ID="<club-id>"

bash -c 'curl -s "https://www.strava.com/api/v3/clubs/$CLUB_ID" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '{id, name, sport_type, city, country, member_count, description}'
```

---

### 17. List Club Activities

```bash
CLUB_ID="<club-id>"

bash -c 'curl -s "https://www.strava.com/api/v3/clubs/$CLUB_ID/activities?per_page=20" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '.[] | {name, type, distance, moving_time, athlete: (.athlete.firstname + " " + .athlete.lastname)}'
```

---

### 18. Get Athlete Routes

```bash
ATHLETE_ID="<athlete-id>"

bash -c 'curl -s "https://www.strava.com/api/v3/athletes/$ATHLETE_ID/routes?per_page=20" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '.[] | {id, name, type, distance, elevation_gain, estimated_moving_time}'
```

---

### 19. Get Activity Streams (GPS/HR Data)

Retrieve time-series data streams for an activity:

```bash
ACTIVITY_ID="<activity-id>"

bash -c 'curl -s "https://www.strava.com/api/v3/activities/$ACTIVITY_ID/streams?keys=time,distance,heartrate,velocity_smooth&key_by_type=true" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq 'keys'
```

Available stream keys: `time`, `distance`, `latlng`, `altitude`, `velocity_smooth`, `heartrate`, `cadence`, `watts`, `temp`, `moving`, `grade_smooth`

---

### 20. Upload Activity (GPX/FIT file)

```bash
bash -c 'curl -s -X POST "https://www.strava.com/api/v3/uploads" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN" -F "data_type=gpx" -F "file=@/path/to/activity.gpx" -F "name=My Activity"' | jq '{id, status, error}'
```

Check upload status:

```bash
UPLOAD_ID="<upload-id>"

bash -c 'curl -s "https://www.strava.com/api/v3/uploads/$UPLOAD_ID" --header "Authorization: Bearer $STRAVA_ACCESS_TOKEN"' | jq '{id, status, error, activity_id}'
```

Supported formats: `fit`, `fit.gz`, `tcx`, `tcx.gz`, `gpx`, `gpx.gz`

---

## Guidelines

1. **Token expiry**: Access tokens expire every 6 hours — refresh using the refresh token flow
2. **Pagination**: Use `page` and `per_page` (max 200) for list endpoints
3. **Time filters**: Use Unix epoch timestamps for `before`/`after` parameters
4. **Scope requirements**: Ensure token has correct scopes; `activity:read_all` needed for private activities
5. **Rate limits**: 200 req/15min — add delays for bulk operations
6. **Distance units**: All distances are in **meters**, speeds in **meters/second**
7. **Time units**: All durations are in **seconds**
