#!/bin/bash

# Dev.to Publisher
# Publishes articles to Dev.to using their API
# Usage: devto-publish.sh <article_file> [--title "Title"] [--tags "tag1,tag2"] [--published true|false] [--image url]

set -e

API_URL="https://dev.to/api/articles"

# Check if API key is set
if [ -z "$DEVTO_API_KEY" ]; then
    echo "Error: DEVTO_API_KEY environment variable is not set"
    echo ""
    echo "To get your API key:"
    echo "1. Go to https://dev.to/settings/extensions"
    echo "2. Scroll to 'DEV Community API Keys'"
    echo "3. Generate a new API key"
    exit 1
fi

# Check if article file is provided
if [ -z "$1" ] || [[ "$1" == --* ]]; then
    echo "Error: Article file is required"
    echo "Usage: devto-publish.sh <article_file> [--title \"Title\"] [--tags \"tag1,tag2\"] [--published true|false] [--image url]"
    exit 1
fi

ARTICLE_FILE="$1"
shift

# Check if file exists
if [ ! -f "$ARTICLE_FILE" ]; then
    echo "Error: File not found: $ARTICLE_FILE"
    exit 1
fi

# Default values
TITLE=""
TAGS=""
PUBLISHED="false"
COVER_IMAGE=""

# Parse optional arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --title)
            TITLE="$2"
            shift 2
            ;;
        --tags)
            TAGS="$2"
            shift 2
            ;;
        --published)
            PUBLISHED="$2"
            shift 2
            ;;
        --image)
            COVER_IMAGE="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Read article content
CONTENT=$(cat "$ARTICLE_FILE")

# Extract title from H1 if not provided
if [ -z "$TITLE" ]; then
    TITLE=$(echo "$CONTENT" | grep -m1 '^# ' | sed 's/^# //')
    if [ -z "$TITLE" ]; then
        echo "Error: No title provided and no H1 found in article"
        exit 1
    fi
    # Remove the H1 from content since Dev.to will use the title
    CONTENT=$(echo "$CONTENT" | sed '0,/^# .*$/d')
fi

OUTPUT_DIR="/tmp/devto"
mkdir -p "$OUTPUT_DIR"

echo "Publishing to Dev.to..."
echo "Title: $TITLE"
echo "Published: $PUBLISHED"
[ -n "$TAGS" ] && echo "Tags: $TAGS"
[ -n "$COVER_IMAGE" ] && echo "Cover Image: $COVER_IMAGE"
echo ""

# Build tags array
TAGS_JSON="[]"
if [ -n "$TAGS" ]; then
    # Convert comma-separated tags to JSON array, lowercase, max 4
    TAGS_JSON=$(echo "$TAGS" | tr ',' '\n' | tr '[:upper:]' '[:lower:]' | head -4 | jq -R . | jq -s .)
fi

# Escape content for JSON
ESCAPED_CONTENT=$(echo "$CONTENT" | jq -Rs '.')
ESCAPED_TITLE=$(echo "$TITLE" | jq -Rs '.')

# Build request body
if [ -n "$COVER_IMAGE" ]; then
    REQUEST_BODY=$(cat <<EOF
{
  "article": {
    "title": $ESCAPED_TITLE,
    "body_markdown": $ESCAPED_CONTENT,
    "published": $PUBLISHED,
    "tags": $TAGS_JSON,
    "main_image": "$COVER_IMAGE"
  }
}
EOF
)
else
    REQUEST_BODY=$(cat <<EOF
{
  "article": {
    "title": $ESCAPED_TITLE,
    "body_markdown": $ESCAPED_CONTENT,
    "published": $PUBLISHED,
    "tags": $TAGS_JSON
  }
}
EOF
)
fi

# Call Dev.to API
echo "Calling Dev.to API..."
RESPONSE=$(curl -s -X POST "$API_URL" \
    -H "api-key: $DEVTO_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$REQUEST_BODY")

# Save response
echo "$RESPONSE" | jq '.' > "$OUTPUT_DIR/publish_response.json" 2>/dev/null || echo "$RESPONSE" > "$OUTPUT_DIR/publish_response.json"

# Check for errors
if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
    echo "Error publishing to Dev.to:"
    echo "$RESPONSE" | jq '.'
    exit 1
fi

# Extract article info
ARTICLE_URL=$(echo "$RESPONSE" | jq -r '.url')
ARTICLE_ID=$(echo "$RESPONSE" | jq -r '.id')
IS_PUBLISHED=$(echo "$RESPONSE" | jq -r '.published')

if [ -z "$ARTICLE_URL" ] || [ "$ARTICLE_URL" = "null" ]; then
    echo "Error: Failed to get article URL"
    echo "Response:"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

echo ""
echo "Success!"
echo "Article ID: $ARTICLE_ID"
echo "URL: $ARTICLE_URL"
echo "Published: $IS_PUBLISHED"
echo ""
echo "Response saved to: $OUTPUT_DIR/publish_response.json"

if [ "$IS_PUBLISHED" = "false" ]; then
    echo ""
    echo "Note: Article saved as draft. Edit and publish at: https://dev.to/dashboard"
fi
