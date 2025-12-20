#!/bin/bash

# Firecrawl - Web scraping and crawling API for AI
# Usage: firecrawl.sh <command> <url|query> [options]
# Commands: scrape, crawl, map, search, extract

set -e

API_BASE="https://api.firecrawl.dev/v1"
OUTPUT_DIR=""
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Parse global options first
while [ $# -gt 0 ]; do
    case "$1" in
        --output-dir)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        *)
            break
            ;;
    esac
done

# Default to temp directory if not specified
if [ -z "$OUTPUT_DIR" ]; then
    OUTPUT_DIR="${TMPDIR:-/tmp}/firecrawl"
fi

# Check API key
if [ -z "$FIRECRAWL_API_KEY" ]; then
    echo "Error: FIRECRAWL_API_KEY environment variable is not set"
    echo "Get your API key from: https://www.firecrawl.dev/"
    echo "Set it with: export FIRECRAWL_API_KEY=fc-your-key"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Show usage
show_usage() {
    echo "Firecrawl - Web scraping and crawling API for AI"
    echo ""
    echo "Usage: firecrawl.sh [--output-dir <dir>] <command> <url|query> [options]"
    echo ""
    echo "Global Options:"
    echo "  --output-dir <dir>  Output directory for results (default: \$TMPDIR/firecrawl)"
    echo ""
    echo "Commands:"
    echo "  scrape <url>     Scrape a single webpage"
    echo "  crawl <url>      Crawl an entire website"
    echo "  map <url>        Get all URLs from a website"
    echo "  search <query>   Search the web"
    echo "  extract <url>    Extract structured data with AI"
    echo ""
    echo "Examples:"
    echo "  firecrawl.sh scrape \"https://example.com\" --format markdown"
    echo "  firecrawl.sh --output-dir ./output crawl \"https://example.com\" --limit 50"
    echo "  firecrawl.sh map \"https://example.com\" --search \"blog\""
    echo "  firecrawl.sh search \"AI news\" --limit 5"
    echo "  firecrawl.sh extract \"https://example.com\" --prompt \"Extract product info\""
    exit 1
}

# API request helper
api_request() {
    local method="$1"
    local endpoint="$2"
    local data="$3"

    if [ "$method" = "GET" ]; then
        curl -s -X GET "${API_BASE}${endpoint}" \
            -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
            -H "Content-Type: application/json"
    else
        curl -s -X POST "${API_BASE}${endpoint}" \
            -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
            -H "Content-Type: application/json" \
            -d "$data"
    fi
}

# Check for errors in response
check_error() {
    local response="$1"
    local success=$(echo "$response" | jq -r '.success // empty')

    if [ "$success" = "false" ]; then
        local error=$(echo "$response" | jq -r '.error // "Unknown error"')
        echo "Error: $error"
        echo "$response" | jq '.' 2>/dev/null
        exit 1
    fi
}

# Scrape command
cmd_scrape() {
    local url="$1"
    shift

    local format="markdown"
    local main_only="false"
    local timeout="30000"

    while [ $# -gt 0 ]; do
        case "$1" in
            --format) format="$2"; shift 2 ;;
            --main-only) main_only="true"; shift ;;
            --timeout) timeout="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    echo "Scraping: $url"
    echo "Format: $format"

    local data=$(cat <<EOF
{
    "url": "$url",
    "formats": ["$format"],
    "onlyMainContent": $main_only,
    "timeout": $timeout
}
EOF
)

    local response=$(api_request "POST" "/scrape" "$data")
    check_error "$response"

    # Save full response
    local json_file="${OUTPUT_DIR}/scrape_${TIMESTAMP}.json"
    echo "$response" | jq '.' > "$json_file"
    echo "Response saved to: $json_file"

    # Extract and save markdown if available
    local markdown=$(echo "$response" | jq -r '.data.markdown // empty')
    if [ -n "$markdown" ] && [ "$markdown" != "null" ]; then
        local md_file="${OUTPUT_DIR}/scrape_${TIMESTAMP}.md"
        echo "$markdown" > "$md_file"
        echo "Markdown saved to: $md_file"
    fi

    # Show metadata
    echo ""
    echo "Metadata:"
    echo "$response" | jq '.data.metadata // {}' 2>/dev/null
}

# Crawl command
cmd_crawl() {
    local url="$1"
    shift

    local limit="100"
    local depth="3"
    local include=""
    local exclude=""
    local wait="true"

    while [ $# -gt 0 ]; do
        case "$1" in
            --limit) limit="$2"; shift 2 ;;
            --depth) depth="$2"; shift 2 ;;
            --include) include="$2"; shift 2 ;;
            --exclude) exclude="$2"; shift 2 ;;
            --no-wait) wait="false"; shift ;;
            *) shift ;;
        esac
    done

    echo "Crawling: $url"
    echo "Limit: $limit pages, Depth: $depth"

    # Build request
    local include_json=""
    local exclude_json=""
    [ -n "$include" ] && include_json=", \"includePaths\": [\"$include\"]"
    [ -n "$exclude" ] && exclude_json=", \"excludePaths\": [\"$exclude\"]"

    local data=$(cat <<EOF
{
    "url": "$url",
    "limit": $limit,
    "maxDepth": $depth
    $include_json
    $exclude_json
}
EOF
)

    local response=$(api_request "POST" "/crawl" "$data")
    check_error "$response"

    local job_id=$(echo "$response" | jq -r '.id // empty')

    if [ -z "$job_id" ]; then
        echo "Error: Failed to start crawl job"
        echo "$response" | jq '.'
        exit 1
    fi

    echo "Crawl job started: $job_id"

    if [ "$wait" = "true" ]; then
        echo "Waiting for completion..."

        while true; do
            sleep 5
            local status_response=$(api_request "GET" "/crawl/$job_id")
            local status=$(echo "$status_response" | jq -r '.status // empty')
            local completed=$(echo "$status_response" | jq -r '.completed // 0')
            local total=$(echo "$status_response" | jq -r '.total // 0')

            echo "Status: $status ($completed/$total pages)"

            if [ "$status" = "completed" ]; then
                local json_file="${OUTPUT_DIR}/crawl_${job_id}.json"
                echo "$status_response" | jq '.' > "$json_file"
                echo ""
                echo "Crawl completed!"
                echo "Results saved to: $json_file"
                echo "Total pages: $(echo "$status_response" | jq '.data | length')"
                break
            elif [ "$status" = "failed" ]; then
                echo "Crawl failed!"
                echo "$status_response" | jq '.'
                exit 1
            fi
        done
    else
        echo "Job ID: $job_id"
        echo "Check status with: curl -H \"Authorization: Bearer \$FIRECRAWL_API_KEY\" ${API_BASE}/crawl/$job_id"
    fi
}

# Map command
cmd_map() {
    local url="$1"
    shift

    local search=""
    local limit="1000"

    while [ $# -gt 0 ]; do
        case "$1" in
            --search) search="$2"; shift 2 ;;
            --limit) limit="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    echo "Mapping: $url"
    [ -n "$search" ] && echo "Filter: $search"

    local search_json=""
    [ -n "$search" ] && search_json=", \"search\": \"$search\""

    local data=$(cat <<EOF
{
    "url": "$url",
    "limit": $limit
    $search_json
}
EOF
)

    local response=$(api_request "POST" "/map" "$data")
    check_error "$response"

    local json_file="${OUTPUT_DIR}/map_${TIMESTAMP}.json"
    echo "$response" | jq '.' > "$json_file"

    local count=$(echo "$response" | jq '.links | length')
    echo ""
    echo "Found $count URLs"
    echo "Results saved to: $json_file"

    # Show first 10 URLs
    echo ""
    echo "Sample URLs:"
    echo "$response" | jq -r '.links[:10][]' 2>/dev/null
}

# Search command
cmd_search() {
    local query="$1"
    shift

    local limit="10"
    local format="markdown"

    while [ $# -gt 0 ]; do
        case "$1" in
            --limit) limit="$2"; shift 2 ;;
            --format) format="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    echo "Searching: $query"
    echo "Limit: $limit results"

    local data=$(cat <<EOF
{
    "query": "$query",
    "limit": $limit,
    "scrapeOptions": {
        "formats": ["$format"]
    }
}
EOF
)

    local response=$(api_request "POST" "/search" "$data")
    check_error "$response"

    local json_file="${OUTPUT_DIR}/search_${TIMESTAMP}.json"
    echo "$response" | jq '.' > "$json_file"

    local count=$(echo "$response" | jq '.data | length')
    echo ""
    echo "Found $count results"
    echo "Results saved to: $json_file"

    # Show titles
    echo ""
    echo "Results:"
    echo "$response" | jq -r '.data[]? | "- \(.metadata.title // .url)"' 2>/dev/null
}

# Extract command
cmd_extract() {
    local url="$1"
    shift

    local prompt=""
    local schema=""

    while [ $# -gt 0 ]; do
        case "$1" in
            --prompt) prompt="$2"; shift 2 ;;
            --schema) schema="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$prompt" ]; then
        echo "Error: --prompt is required for extract"
        echo "Usage: firecrawl.sh extract <url> --prompt \"description of data to extract\""
        exit 1
    fi

    echo "Extracting from: $url"
    echo "Prompt: $prompt"

    local schema_json=""
    [ -n "$schema" ] && schema_json=", \"schema\": $schema"

    local data=$(cat <<EOF
{
    "urls": ["$url"],
    "prompt": "$prompt"
    $schema_json
}
EOF
)

    local response=$(api_request "POST" "/extract" "$data")
    check_error "$response"

    local json_file="${OUTPUT_DIR}/extract_${TIMESTAMP}.json"
    echo "$response" | jq '.' > "$json_file"

    echo ""
    echo "Extraction complete!"
    echo "Results saved to: $json_file"

    # Show extracted data
    echo ""
    echo "Extracted data:"
    echo "$response" | jq '.data // .' 2>/dev/null
}

# Main
if [ $# -lt 2 ]; then
    show_usage
fi

command="$1"
shift

case "$command" in
    scrape)
        cmd_scrape "$@"
        ;;
    crawl)
        cmd_crawl "$@"
        ;;
    map)
        cmd_map "$@"
        ;;
    search)
        cmd_search "$@"
        ;;
    extract)
        cmd_extract "$@"
        ;;
    *)
        echo "Unknown command: $command"
        show_usage
        ;;
esac
