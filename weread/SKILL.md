---
name: weread
description: WeRead (微信读书) API for searching books, browsing your bookshelf, and
  reading your notes, highlights, reviews, and reading statistics. Use when the user
  mentions "WeRead", "微信读书", "WeChat Reading", "weread.qq.com", "我的书架", "阅读时长",
  "划线", "读书笔记", or asks to search the WeRead bookstore, check reading progress,
  export highlights, or get personalised book recommendations.
---

## Troubleshooting

If a request fails, run `zero doctor check-connector --env-name WEREAD_API_KEY` or
`zero doctor check-connector --url "https://i.weread.qq.com/api/agent/gateway"`.

A non-zero `errcode` in the JSON response means the request failed — surface the
message to the user. A `401`/`403` usually means the API key is missing, expired,
or not connected.

## Official Docs

- WeRead Skill page: https://weread.qq.com/r/weread-skills

## Prerequisites

Connect the **WeRead** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).
The API key is obtained by opening the [WeRead Skill page](https://weread.qq.com/r/weread-skills),
scanning the QR code with WeChat to sign in, and copying the generated key (format
`wrk-xxxxxxxx`).

The connector provides:

- `WEREAD_API_KEY` — the `wrk-` API key, bound to one WeChat Reading account

## Gateway API

WeRead exposes every capability through a single gateway endpoint. There is no
path-based REST — the `api_name` field in the request body selects the sub-API.

### Endpoint and auth

```
POST https://i.weread.qq.com/api/agent/gateway
Authorization: Bearer $WEREAD_API_KEY
Content-Type: application/json
```

The API key is bound to the user's WeRead identity (`vid`). Endpoints that need a
user identity resolve it automatically from the key — never pass `vid` manually.

### Request format

- Method `POST`, `Content-Type: application/json`.
- Body is a flat JSON object: `api_name` selects the sub-API, business parameters
  are **flattened at the top level**, and **every request must include
  `skill_version`** (use `1.0.3`).

```bash
curl -X POST "https://i.weread.qq.com/api/agent/gateway" \
  -H "Authorization: Bearer $WEREAD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"api_name": "/store/search", "keyword": "三体", "skill_version": "1.0.3"}'
```

**Correct** — business params flattened next to `api_name`:

```json
{"api_name":"/user/notebooks","count":100,"lastSort":1516907353,"skill_version":"1.0.3"}
```

**Wrong** — do NOT wrap params in `params`/`data`/`body`. The backend will not
forward them and silently returns the first page with defaults:

```json
{"api_name":"/user/notebooks","params":{"count":100},"skill_version":"1.0.3"}
```

Only array/object fields explicitly declared by an endpoint (such as the `reviews`
array of `/book/readreviews`) may be passed as nested business fields.

### Response format

- JSON, trimmed to core fields.
- `errcode != 0` means an error — give the user a clear message.
- `POST {"api_name":"/_list","skill_version":"1.0.3"}` returns every available
  sub-API with its parameter definitions — use it to discover or verify endpoints.
- If a response contains an `upgrade_info` field, the bundled skill is behind the
  server. Finish the user's request on a best-effort basis, then tell the user the
  WeRead connector skill may need an update — do not attempt to self-download.

### General rules

- **Read this file before calling an endpoint.** Field names are easy to
  misread (units, counting scope); follow the field notes here rather than
  guessing from the name.
- **bookId resolution**: when the user gives a book title, call `/store/search`
  first to get the `bookId`, then continue.
- **Context carry-over**: remember `bookId`s already resolved in the conversation
  so the user need not repeat them.
- **Timestamps**: every Unix timestamp field (`updateTime`, `createTime`,
  `finishTime`, `readUpdateTime`, etc.) must be displayed as `YYYY-MM-DD`, never
  the raw number.
- **Reading durations**: all duration fields are in **seconds** — display as
  "X hours Y minutes". Never treat them as minutes or hours.

## Capabilities

| Capability | Sub-API | Notes |
| --- | --- | --- |
| Search books | `/store/search` | Bookstore search, `scope` selects the tab |
| Book info | `/book/info` | Title, author, rating, ISBN, word count |
| Chapter list | `/book/chapterinfo` | Table of contents, `chapterUid` for other calls |
| Reading progress | `/book/getprogress` | Percent + cumulative reading time |
| Bookshelf | `/shelf/sync` | Ebooks (`books`) + audiobooks (`albums`) |
| Reading stats | `/readdata/detail` | Duration, days, preferences by period |
| Notebook overview | `/user/notebooks` | Per-book note counts |
| Highlights (one book) | `/book/bookmarklist` | Highlight text, filters out bookmarks |
| Personal thoughts | `/review/list/mine` | Highlight thoughts + chapter/book reviews |
| Popular highlights | `/book/bestbookmarks` | Book-wide popular highlights with text |
| Highlight heat | `/book/underlines` | Per-range highlight counts, no text |
| Thoughts under a highlight | `/book/readreviews` | Comments under specific ranges |
| Single thought detail | `/review/single` | One thought with comments/likes |
| Public book reviews | `/review/list` | Others' public reviews of a book |
| Recommendations | `/book/recommend` | Personalised "for you" |
| Similar books | `/book/similar` | Books similar to a given book |

### Search — `/store/search`

Params: `keyword` (required), `scope` (int, see below), `maxIdx` (paging offset),
`count` (page size).

`scope`: `0` all, `10` ebooks (default for "find a book"), `16` web novels,
`14` audiobooks, `6` authors, `12` full-text, `13` booklists, `2` official
accounts, `4` articles. Use `10` when the user clearly wants to find a book, `0`
for a generic search.

Response is the V3 format: `results[]` groups, each with `books[]` carrying
`bookInfo` (`bookId`, `title`, `author`, `cover`, `category`, `price`), plus
`readingCount`, `newRating` (0-100), `newRatingCount`. Page with the last item's
`searchIdx` as the next `maxIdx` while `hasMore == 1`.

### Book — `/book/info`, `/book/chapterinfo`, `/book/getprogress`

- `/book/info` — `bookId` → title, author, translator, cover, intro, category,
  publisher, ISBN, `wordCount`, `newRating` (0-100), `newRatingCount`.
- `/book/chapterinfo` — `bookId` → `chapters[]` with `chapterUid`, `chapterIdx`,
  `title`, `wordCount`, `level` (indent depth), `price`/`paid`. `chapterUid` is
  the input for `/book/underlines` and `/book/bestbookmarks`.
- `/book/getprogress` — `bookId` → `book.progress` is an **integer 0-100 percent**
  (1 means 1%, not 100%); only `100` (with `finishTime`) means finished. Always
  display with a `%` sign. `book.recordReadingTime` is cumulative seconds.

### Bookshelf — `/shelf/sync`

No params (identity comes from the key). Returns `books[]` (ebooks),
`albums[]` (audiobooks — a separate array), and `mp` (an article-collection entry
object).

**Shelf total** when the user asks "how many books on my shelf":
`books.length + albums.length + (mp is non-empty ? 1 : 0)`. Audiobooks
(`albums[]`) count as books on the shelf. Do not use server-side count fields.

- Private reads = `books[].secret == 1` count + `albums[].albumInfoExtra.secret == 1`
  count + (`mp` non-empty ? 1 : 0).
- Ebook-only count = `bookCount` or `books.length`.

### Reading stats — `/readdata/detail`

Params: `mode` (`weekly` / `monthly` (default) / `annually` / `overall`),
`baseTime` (int timestamp, `0` = current period).

Key fields: `totalReadTime` (period total, **seconds** — the authoritative total),
`readDays` (days with >= 1 min reading), `dayAverageReadTime` (per-calendar-day
seconds), `compare` (ratio vs previous period), `readLongest[]` (top books by
`readTime`), `readStat[]` (summary like 读过/读完/笔记), `preferCategory[]`,
`preferTime[]` (24-hour buckets starting at 06:00), `preferAuthor[]`.

`/readdata/detail` only supports fixed natural periods. For an arbitrary date
range, combine periods: whole years via `annually`, whole months via `monthly`,
then add/subtract. Use a completed period's `totalReadTime`; for a partial
boundary period prefer `dailyReadTimes` (day-level detail) when present.

### Notes & highlights

Note counting: **total notes = bookmarks + highlights + thoughts**, i.e.
`reviewCount + noteCount + bookmarkCount`. `noteCount` is the highlight count, not
the total. `reviewCount` already includes personal reviews — do not double-count.

- `/user/notebooks` — overview of all books with notes. Params `count`,
  `lastSort` (cursor). Returns `totalBookCount`, `totalNoteCount`, `hasMore`,
  and `books[]` with `reviewCount`, `noteCount`, `bookmarkCount`, `sort`. Paginate
  with `count` + `lastSort` (the last item's `sort`) until `hasMore == 0`. Never
  use `offset`/`limit`.
- `/book/bookmarklist` — `bookId` → `updated[]` highlights (`markText`,
  `chapterUid`, `range`, `createTime`, `colorStyle`) plus `chapters[]`. Bookmarks
  are filtered out; bookmark content cannot be exported.
- `/review/list/mine` — `bookid`, `synckey`, `count` → the user's own highlight
  thoughts, chapter reviews, and whole-book reviews (`reviews[].review`).
- `/book/bestbookmarks` — `bookId`, optional `chapterUid` → book-wide popular
  highlights (`items[]` with `markText`, `range`, `totalCount`). Server returns
  the top 20, no paging.
- `/book/underlines` — `bookId`, `chapterUid` → per-range highlight heat
  (`underlines[]` with `range`, `count`, `score`) — **no highlight text**.
- `/book/readreviews` — `bookId`, `chapterUid`, `reviews[]` (each `{range}`) →
  thoughts written under those ranges.
- `/review/single` — `reviewId` → one thought with comments and likes.

To export a single book's notes, call `/book/bookmarklist` (highlights) AND
`/review/list/mine` (thoughts) and merge — highlights alone are incomplete.

### Public reviews — `/review/list`

Params: `bookId`, `reviewListType` (`0` all / `1` recommended / `2` negative /
`3` newest / `4` neutral), `count`, `maxIdx`, `synckey`. `reviews[].review.review.star`
is `20`/`40`/`60`/`80`/`100` for 1-5 stars. Page with the last item's `idx`.

### Discovery — `/book/recommend`, `/book/similar`

- `/book/recommend` — params `count`, `maxIdx` → personalised `books[]` with a
  `reason` field. Page with `searchIdx`.
- `/book/similar` — params `bookId`, `count`, `maxIdx`, `sessionId` → similar
  books under `booksimilar.books[]`. Page with the last `idx` plus `sessionId`.

## Deep links (URL schema)

When showing books, chapters, or highlights, append a `weread://` link so the
user can jump straight into the WeRead app.

- Open a book at its last position: `weread://reading?bId={bookId}`
- Jump to a chapter: `weread://reading?bId={bookId}&chapterUid={chapterUid}`
- Jump to a highlight: split `range` (`"900-2004"`) into `rangeStart`/`rangeEnd`:
  `weread://bestbookmark?bookId={bookId}&chapterUid={chapterUid}&rangeStart={start}&rangeEnd={end}`

## Output guidance

- Show lists with numbers so the user can pick by index.
- Search results: lead with title, author, rating, reading count, category.
- Do not translate response field names literally — explain them using the field
  notes in this file.
- Convert all timestamps to `YYYY-MM-DD` and all durations (seconds) to
  "X hours Y minutes" before displaying.
