#!/bin/bash
MODEL="${1:-nano-banana-pro}"
PROMPT=$(cat | jq -Rs .)
curl -s -X POST "https://fal.run/fal-ai/${MODEL}" -H "Authorization: Key ${FAL_KEY}" -H "Content-Type: application/json" -d "{\"prompt\": ${PROMPT}}" | jq -r '.images[0].url'
