---
name: exa
description: Exa API for AI-native web search, contents retrieval, answer generation,
  and research. Use when user mentions "Exa", semantic search, web search for AI,
  contents extraction, or grounded answers with citations.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name EXA_TOKEN` or `zero doctor check-connector --url https://api.exa.ai/search --method POST`

## Official Docs

- Search API: https://exa.ai/docs/reference/search
- Contents API: https://exa.ai/docs/reference/contents
- Answer API: https://exa.ai/docs/reference/answer

## Prerequisites

Connect the **Exa** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

## Search

Write to `/tmp/exa_search.json`:

```json
{
  "query": "latest developments in LLM agents",
  "type": "auto",
  "contents": {
    "highlights": true
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.exa.ai/search" --header "x-api-key: $EXA_TOKEN" --header "Content-Type: application/json" -d @/tmp/exa_search.json | jq .
```

## Answer

Write to `/tmp/exa_answer.json`:

```json
{
  "query": "What changed recently in AI agent infrastructure?",
  "text": true
}
```

Then run:

```bash
curl -s -X POST "https://api.exa.ai/answer" --header "x-api-key: $EXA_TOKEN" --header "Content-Type: application/json" -d @/tmp/exa_answer.json | jq .
```

## Guidelines

- Use `contents.text`, `contents.highlights`, or `contents.summary` when the answer needs source material, not just URLs.
- Prefer `type: "auto"` unless the user specifically requests neural, fast, or deep search.
- Treat generated answers as grounded summaries and inspect citations before using them in high-stakes contexts.
