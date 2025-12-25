---
name: perplexity
description: AI-powered search engine with real-time web grounding and citations
vm0_env:
  - PERPLEXITY_API_KEY
---

# Perplexity AI

AI search engine that provides real-time web-grounded answers with source citations. Unlike traditional search, Perplexity synthesizes information from multiple sources into coherent responses.

> Official docs: https://docs.perplexity.ai/

---

## When to Use

Use this skill when you need to:

- Get real-time information with source citations
- Research topics that require up-to-date web data
- Answer complex questions that need multi-source synthesis
- Perform academic or SEC filings research
- Get AI-generated summaries grounded in current web content

---

## Prerequisites

1. Create an account at https://perplexity.ai/
2. Navigate to API settings: https://perplexity.ai/account/api
3. Generate an API key

Set environment variable:

```bash
export PERPLEXITY_API_KEY="pplx-your-api-key"
```

---

## How to Use

### 1. Chat Completions (Recommended)

AI-powered Q&A with web search and citations. OpenAI SDK compatible.

**Basic query with sonar model:**

```bash
curl -s -X POST "https://api.perplexity.ai/chat/completions" --header "Authorization: Bearer ${PERPLEXITY_API_KEY}" --header "Content-Type: application/json" -d '{
  "model": "sonar",
  "messages": [
  {"role": "user", "content": "What is the current price of Bitcoin?"}
  ]
  }' > /tmp/resp_3634ac.json
cat /tmp/resp_3634ac.json | jq .
```

**With system prompt:**

```bash
curl -s -X POST "https://api.perplexity.ai/chat/completions" --header "Authorization: Bearer ${PERPLEXITY_API_KEY}" --header "Content-Type: application/json" -d '{
  "model": "sonar",
  "messages": [
  {"role": "system", "content": "Be precise and concise. Answer in bullet points."},
  {"role": "user", "content": "What are the latest developments in AI?"}
  ]
  }' > /tmp/resp_af50c7.json
cat /tmp/resp_af50c7.json | jq .
```

**Advanced query with sonar-pro:**

```bash
curl -s -X POST "https://api.perplexity.ai/chat/completions" --header "Authorization: Bearer ${PERPLEXITY_API_KEY}" --header "Content-Type: application/json" -d '{
  "model": "sonar-pro",
  "messages": [
  {"role": "user", "content": "Compare the latest iPhone and Samsung Galaxy flagship phones"}
  ],
  "temperature": 0.2,
  "web_search_options": {
  "search_context_size": "high"
  }
  }' > /tmp/resp_ecf62b.json
cat /tmp/resp_ecf62b.json | jq .
```

### 2. Search with Domain Filter

Limit search to specific domains:

```bash
curl -s -X POST "https://api.perplexity.ai/chat/completions" --header "Authorization: Bearer ${PERPLEXITY_API_KEY}" --header "Content-Type: application/json" -d '{
  "model": "sonar",
  "messages": [
  {"role": "user", "content": "Latest research on transformer architectures"}
  ],
  "search_domain_filter": ["arxiv.org", "openai.com", "anthropic.com"]
  }' > /tmp/resp_5a8e0c.json
cat /tmp/resp_5a8e0c.json | jq .
```

**Exclude domains (add `-` prefix):**

```bash
curl -s -X POST "https://api.perplexity.ai/chat/completions" --header "Authorization: Bearer ${PERPLEXITY_API_KEY}" --header "Content-Type: application/json" -d '{
  "model": "sonar",
  "messages": [
  {"role": "user", "content": "Best programming practices"}
  ],
  "search_domain_filter": ["-reddit.com", "-quora.com"]
  }' > /tmp/resp_a69294.json
cat /tmp/resp_a69294.json | jq .
```

### 3. Search with Time Filter

Filter by recency:

```bash
curl -s -X POST "https://api.perplexity.ai/chat/completions" --header "Authorization: Bearer ${PERPLEXITY_API_KEY}" --header "Content-Type: application/json" -d '{
  "model": "sonar",
  "messages": [
  {"role": "user", "content": "Major tech news"}
  ],
  "search_recency_filter": "week"
  }' > /tmp/resp_8d86fb.json
cat /tmp/resp_8d86fb.json | jq .
```

**Filter by date range:**

```bash
curl -s -X POST "https://api.perplexity.ai/chat/completions" --header "Authorization: Bearer ${PERPLEXITY_API_KEY}" --header "Content-Type: application/json" -d '{
  "model": "sonar",
  "messages": [
  {"role": "user", "content": "AI announcements"}
  ],
  "search_after_date_filter": "12/01/2024",
  "search_before_date_filter": "12/31/2024"
  }' > /tmp/resp_9c998c.json
cat /tmp/resp_9c998c.json | jq .
```

### 4. Academic Search

Search academic sources:

```bash
curl -s -X POST "https://api.perplexity.ai/chat/completions" --header "Authorization: Bearer ${PERPLEXITY_API_KEY}" --header "Content-Type: application/json" -d '{
  "model": "sonar",
  "messages": [
  {"role": "user", "content": "Recent papers on large language model alignment"}
  ],
  "search_mode": "academic"
  }' > /tmp/resp_995817.json
cat /tmp/resp_995817.json | jq .
```

### 5. Raw Search API

Get raw search results without AI synthesis:

```bash
curl -s -X POST "https://api.perplexity.ai/search" --header "Authorization: Bearer ${PERPLEXITY_API_KEY}" --header "Content-Type: application/json" -d '{
  "query": "Claude AI Anthropic",
  "max_results": 5
  }' > /tmp/resp_59d48e.json
cat /tmp/resp_59d48e.json | jq .
```

**With domain and time filters:**

```bash
curl -s -X POST "https://api.perplexity.ai/search" --header "Authorization: Bearer ${PERPLEXITY_API_KEY}" --header "Content-Type: application/json" -d '{
  "query": "machine learning tutorials",
  "max_results": 10,
  "search_domain_filter": ["github.com", "medium.com"],
  "search_recency_filter": "month",
  "country": "US"
  }' > /tmp/resp_cf12dd.json
cat /tmp/resp_cf12dd.json | jq .
```

### 6. Deep Research (Long-form)

For comprehensive research reports:

```bash
curl -s -X POST "https://api.perplexity.ai/chat/completions" --header "Authorization: Bearer ${PERPLEXITY_API_KEY}" --header "Content-Type: application/json" -d '{
  "model": "sonar-deep-research",
  "messages": [
  {"role": "user", "content": "Write a comprehensive analysis of the electric vehicle market in 2024"}
  ],
  "reasoning_effort": "high"
  }' > /tmp/resp_c20a56.json
cat /tmp/resp_c20a56.json | jq .
```

### 7. Reasoning Model

For complex problem-solving:

```bash
curl -s -X POST "https://api.perplexity.ai/chat/completions" --header "Authorization: Bearer ${PERPLEXITY_API_KEY}" --header "Content-Type: application/json" -d '{
  "model": "sonar-reasoning-pro",
  "messages": [
  {"role": "user", "content": "Analyze the pros and cons of microservices vs monolithic architecture for a startup"}
  ]
  }' > /tmp/resp_412b6c.json
cat /tmp/resp_412b6c.json | jq .
```

---

## Models

| Model | Description | Best For |
|-------|-------------|----------|
| `sonar` | Lightweight, cost-effective | Quick facts, news, simple Q&A |
| `sonar-pro` | Advanced search, deeper understanding | Complex queries, detailed research |
| `sonar-reasoning-pro` | Multi-step reasoning with search | Problem-solving, analysis |
| `sonar-deep-research` | Exhaustive research, reports | Academic research, market analysis |

---

## Response Format

Chat completions return:

```json
{
  "id": "uuid",
  "model": "sonar",
  "choices": [
  {
  "message": {
  "role": "assistant",
  "content": "The answer with [1] citations..."
  }
  }
  ],
  "citations": ["https://source1.com", "https://source2.com"],
  "search_results": [
  {
  "title": "Source Title",
  "url": "https://source.com",
  "snippet": "Relevant excerpt..."
  }
  ],
  "usage": {
  "prompt_tokens": 10,
  "completion_tokens": 150,
  "total_tokens": 160
  }
}
```

---

## Guidelines

1. **Model Selection**: Use `sonar` for simple queries, `sonar-pro` for complex ones
2. **Cost Optimization**: Lower `search_context_size` reduces costs (low/medium/high)
3. **Domain Filters**: Limit to 20 domains max; use `-` prefix to exclude
4. **Recency Filters**: Options are `day`, `week`, `month`, `year`
5. **Temperature**: Lower (0.1-0.3) for factual queries, higher for creative
6. **Rate Limits**: Vary by tier; check https://docs.perplexity.ai/guides/rate-limits-usage-tiers
7. **Citations**: Response includes numbered citations `[1]` that map to `citations` array
