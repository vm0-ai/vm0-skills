---
name: openweather
description: OpenWeather API for current weather, forecast, and historical climate data. Use when user mentions "OpenWeather", "weather", "forecast", "temperature", or asks for current/forecast conditions for a city or coordinates.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name OPENWEATHER_TOKEN` or `zero doctor check-connector --url https://api.openweathermap.org/data/2.5/weather --method GET`.

## How to Use

OpenWeather authenticates with an API key passed as the `appid` query
parameter on every request. The base URL is
`https://api.openweathermap.org`.

### 1. Current weather by city

```bash
curl -s -G "https://api.openweathermap.org/data/2.5/weather" \
  --data-urlencode "q=Beijing" \
  --data-urlencode "units=metric" \
  --data-urlencode "appid=$OPENWEATHER_TOKEN"
```

### 2. Current weather by coordinates

```bash
curl -s -G "https://api.openweathermap.org/data/2.5/weather" \
  --data-urlencode "lat=39.9042" \
  --data-urlencode "lon=116.4074" \
  --data-urlencode "units=metric" \
  --data-urlencode "appid=$OPENWEATHER_TOKEN"
```

### 3. 5-day / 3-hour forecast

```bash
curl -s -G "https://api.openweathermap.org/data/2.5/forecast" \
  --data-urlencode "q=Palo Alto,US" \
  --data-urlencode "units=imperial" \
  --data-urlencode "appid=$OPENWEATHER_TOKEN"
```

### 4. One Call API 3.0 (current + minute + hourly + daily)

```bash
curl -s -G "https://api.openweathermap.org/data/3.0/onecall" \
  --data-urlencode "lat=37.4220" \
  --data-urlencode "lon=-122.0841" \
  --data-urlencode "units=metric" \
  --data-urlencode "exclude=minutely,alerts" \
  --data-urlencode "appid=$OPENWEATHER_TOKEN"
```

### 5. Geocoding helper

```bash
curl -s -G "https://api.openweathermap.org/geo/1.0/direct" \
  --data-urlencode "q=Tokyo" \
  --data-urlencode "limit=5" \
  --data-urlencode "appid=$OPENWEATHER_TOKEN"
```

## Guidelines

1. **Pick `units` explicitly** — defaults to Kelvin. Use `metric` or `imperial` for human-readable output.
2. **One Call 3.0 requires a paid plan** — `data/2.5/weather` and `data/2.5/forecast` are sufficient for free-tier usage.
3. **Cache aggressively** — quota is per call. Current-weather data only changes a few times per hour.
4. **Use the `geo/` endpoints for lookups** — never parse free-text city names yourself; resolve via `geo/1.0/direct` first.
