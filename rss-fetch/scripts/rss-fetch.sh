#!/bin/bash

# RSS Feed Fetcher
# Fetches and parses RSS feeds from provided URLs
# Usage: rss-fetch.sh "url1" "url2" "url3" ...
# Output: /tmp/rss/feeds.json

set -e

# Check if RSS URLs are provided
if [ $# -eq 0 ]; then
    echo "Error: No RSS feed URLs provided"
    echo "Usage: rss-fetch.sh \"url1\" \"url2\" \"url3\" ..."
    echo ""
    echo "Example:"
    echo "  rss-fetch.sh \"https://hnrss.org/frontpage\" \"https://techcrunch.com/feed/\""
    exit 1
fi

# RSS feeds from command line arguments
RSS_FEEDS=("$@")

OUTPUT_DIR="/tmp/rss"
OUTPUT_FILE="${OUTPUT_DIR}/feeds.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Fetching RSS feeds..."
echo "Output will be saved to: $OUTPUT_FILE"

# Initialize JSON structure
echo "{" > "$OUTPUT_FILE"
echo "  \"fetched_at\": \"$TIMESTAMP\"," >> "$OUTPUT_FILE"
echo "  \"sources\": [" >> "$OUTPUT_FILE"

# Add sources list
first_source=true
for feed in "${RSS_FEEDS[@]}"; do
  source_domain=$(echo "$feed" | sed -E 's|https?://([^/]+).*|\1|')
  if [ "$first_source" = true ]; then
    echo "    \"$source_domain\"" >> "$OUTPUT_FILE"
    first_source=false
  else
    echo "    ,\"$source_domain\"" >> "$OUTPUT_FILE"
  fi
done

echo "  ]," >> "$OUTPUT_FILE"
echo "  \"articles\": [" >> "$OUTPUT_FILE"

# Fetch and parse each feed
first_article=true
for feed in "${RSS_FEEDS[@]}"; do
  source_domain=$(echo "$feed" | sed -E 's|https?://([^/]+).*|\1|')
  echo "Fetching: $source_domain"

  # Fetch RSS feed
  rss_content=$(curl -s -L --max-time 10 "$feed" 2>/dev/null || echo "")

  if [ -z "$rss_content" ]; then
    echo "  Warning: Failed to fetch $feed"
    continue
  fi

  # Parse RSS items using grep and sed (basic XML parsing)
  # Extract items between <item> tags
  items=$(echo "$rss_content" | tr '\n' ' ' | grep -oP '<item>.*?</item>' 2>/dev/null | head -10 || true)

  if [ -z "$items" ]; then
    # Try entry tags for Atom feeds
    items=$(echo "$rss_content" | tr '\n' ' ' | grep -oP '<entry>.*?</entry>' 2>/dev/null | head -10 || true)
  fi

  # Process each item
  while IFS= read -r item; do
    [ -z "$item" ] && continue

    # Extract title
    title=$(echo "$item" | grep -oP '<title[^>]*>\K[^<]+' 2>/dev/null | head -1 || echo "")
    title=$(echo "$title" | sed 's/"/\\"/g' | sed "s/'/\\'/g" | tr -d '\n\r')

    # Extract link
    link=$(echo "$item" | grep -oP '<link[^>]*>\K[^<]+' 2>/dev/null | head -1 || echo "")
    if [ -z "$link" ]; then
      link=$(echo "$item" | grep -oP '<link[^>]*href="[^"]*"' 2>/dev/null | grep -oP 'href="\K[^"]+' | head -1 || echo "")
    fi

    # Extract description
    description=$(echo "$item" | grep -oP '<description[^>]*>\K[^<]+' 2>/dev/null | head -1 || echo "")
    if [ -z "$description" ]; then
      description=$(echo "$item" | grep -oP '<summary[^>]*>\K[^<]+' 2>/dev/null | head -1 || echo "")
    fi
    # Clean and truncate description
    description=$(echo "$description" | sed 's/<[^>]*>//g' | sed 's/"/\\"/g' | tr -d '\n\r' | cut -c1-300)

    # Extract pubDate
    pubDate=$(echo "$item" | grep -oP '<pubDate[^>]*>\K[^<]+' 2>/dev/null | head -1 || echo "")
    if [ -z "$pubDate" ]; then
      pubDate=$(echo "$item" | grep -oP '<published[^>]*>\K[^<]+' 2>/dev/null | head -1 || echo "")
    fi
    if [ -z "$pubDate" ]; then
      pubDate=$(echo "$item" | grep -oP '<updated[^>]*>\K[^<]+' 2>/dev/null | head -1 || echo "")
    fi

    # Skip if no title or link
    [ -z "$title" ] || [ -z "$link" ] && continue

    # Add article to JSON
    if [ "$first_article" = true ]; then
      first_article=false
    else
      echo "    ," >> "$OUTPUT_FILE"
    fi

    cat >> "$OUTPUT_FILE" << EOF
    {
      "title": "$title",
      "description": "$description",
      "link": "$link",
      "pubDate": "$pubDate",
      "source": "$source_domain"
    }
EOF
  done <<< "$items"
done

# Close JSON structure
echo "" >> "$OUTPUT_FILE"
echo "  ]" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

# Count articles
article_count=$(grep -c '"title":' "$OUTPUT_FILE" 2>/dev/null || echo "0")

echo ""
echo "Done! Fetched $article_count articles"
echo "Output saved to: $OUTPUT_FILE"

# Show preview
echo ""
echo "Preview of fetched articles:"
cat "$OUTPUT_FILE" | head -50
