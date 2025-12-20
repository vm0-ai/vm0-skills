#!/bin/bash

# Qiita API Client
# Search, read, and publish technical articles on Qiita
# Usage: qiita.sh <command> <subcommand> [options]

set -e

# Configuration
BASE_URL="https://qiita.com/api/v2"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Helper functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1" >&2; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1" >&2; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

# Check for required tools
check_deps() {
    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed"
        exit 1
    fi
}

check_deps

# Check authentication
check_auth() {
    if [ -z "$QIITA_ACCESS_TOKEN" ]; then
        log_error "QIITA_ACCESS_TOKEN is not set"
        echo "Set it with: export QIITA_ACCESS_TOKEN=your_token" >&2
        echo "Get token from: https://qiita.com/settings/tokens/new" >&2
        exit 1
    fi
}

# Make API request
api_request() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    local auth_required="${4:-false}"

    local curl_args=(-s -X "$method" "${BASE_URL}${endpoint}")
    curl_args+=(-H "Content-Type: application/json")

    if [ -n "$QIITA_ACCESS_TOKEN" ]; then
        curl_args+=(-H "Authorization: Bearer $QIITA_ACCESS_TOKEN")
    elif [ "$auth_required" = "true" ]; then
        check_auth
    fi

    if [ -n "$data" ]; then
        curl_args+=(-d "$data")
    fi

    local response
    local http_code

    response=$(curl -w "\n%{http_code}" "${curl_args[@]}")
    http_code=$(echo "$response" | tail -n1)
    response=$(echo "$response" | sed '$d')

    if [ "$http_code" -ge 400 ]; then
        log_error "API request failed (HTTP $http_code)"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
        exit 1
    fi

    echo "$response"
}

# Output response
output_response() {
    local response="$1"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
}

# URL encode
urlencode() {
    local string="$1"
    python3 -c "import urllib.parse; print(urllib.parse.quote('''$string''', safe=''))"
}

# ============================================================================
# ITEM COMMANDS
# ============================================================================

cmd_item() {
    local subcmd="$1"
    shift

    case "$subcmd" in
        search) cmd_item_search "$@" ;;
        get) cmd_item_get "$@" ;;
        mine) cmd_item_mine "$@" ;;
        post) cmd_item_post "$@" ;;
        update) cmd_item_update "$@" ;;
        delete) cmd_item_delete "$@" ;;
        *)
            echo "Usage: qiita.sh item <search|get|mine|post|update|delete> [options]"
            exit 1
            ;;
    esac
}

cmd_item_search() {
    local query=""
    local page=1
    local per_page=20

    while [[ $# -gt 0 ]]; do
        case $1 in
            --query) query="$2"; shift 2 ;;
            --page) page="$2"; shift 2 ;;
            --per-page) per_page="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$query" ]; then
        log_error "--query is required"
        exit 1
    fi

    log_info "Searching articles: $query"

    local encoded_query=$(urlencode "$query")
    local response=$(api_request "GET" "/items?query=${encoded_query}&page=${page}&per_page=${per_page}")
    output_response "$response"
}

cmd_item_get() {
    local item_id=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --id) item_id="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$item_id" ]; then
        log_error "--id is required"
        exit 1
    fi

    log_info "Getting article: $item_id"

    local response=$(api_request "GET" "/items/${item_id}")
    output_response "$response"
}

cmd_item_mine() {
    local page=1
    local per_page=20

    while [[ $# -gt 0 ]]; do
        case $1 in
            --page) page="$2"; shift 2 ;;
            --per-page) per_page="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    check_auth
    log_info "Getting my articles..."

    local response=$(api_request "GET" "/authenticated_user/items?page=${page}&per_page=${per_page}" "" "true")
    output_response "$response"
}

cmd_item_post() {
    local title=""
    local body=""
    local body_file=""
    local tags=""
    local private="false"

    while [[ $# -gt 0 ]]; do
        case $1 in
            --title) title="$2"; shift 2 ;;
            --body) body="$2"; shift 2 ;;
            --body-file) body_file="$2"; shift 2 ;;
            --tags) tags="$2"; shift 2 ;;
            --private) private="true"; shift ;;
            *) shift ;;
        esac
    done

    if [ -z "$title" ]; then
        log_error "--title is required"
        exit 1
    fi

    if [ -z "$body" ] && [ -z "$body_file" ]; then
        log_error "--body or --body-file is required"
        exit 1
    fi

    if [ -z "$tags" ]; then
        log_error "--tags is required"
        exit 1
    fi

    # Read body from file if specified
    if [ -n "$body_file" ]; then
        if [ ! -f "$body_file" ]; then
            log_error "File not found: $body_file"
            exit 1
        fi
        body=$(cat "$body_file")
    fi

    check_auth
    log_info "Posting article: $title"

    # Build tags array
    local tags_json=$(echo "$tags" | tr ',' '\n' | jq -R '{name: .}' | jq -s '.')

    local data=$(jq -n \
        --arg title "$title" \
        --arg body "$body" \
        --argjson tags "$tags_json" \
        --argjson private "$private" \
        '{title: $title, body: $body, tags: $tags, private: $private}')

    local response=$(api_request "POST" "/items" "$data" "true")
    output_response "$response"
}

cmd_item_update() {
    local item_id=""
    local title=""
    local body=""
    local body_file=""
    local tags=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --id) item_id="$2"; shift 2 ;;
            --title) title="$2"; shift 2 ;;
            --body) body="$2"; shift 2 ;;
            --body-file) body_file="$2"; shift 2 ;;
            --tags) tags="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$item_id" ]; then
        log_error "--id is required"
        exit 1
    fi

    # Read body from file if specified
    if [ -n "$body_file" ]; then
        if [ ! -f "$body_file" ]; then
            log_error "File not found: $body_file"
            exit 1
        fi
        body=$(cat "$body_file")
    fi

    check_auth
    log_info "Updating article: $item_id"

    # Build update data
    local data="{}"

    if [ -n "$title" ]; then
        data=$(echo "$data" | jq --arg title "$title" '. + {title: $title}')
    fi

    if [ -n "$body" ]; then
        data=$(echo "$data" | jq --arg body "$body" '. + {body: $body}')
    fi

    if [ -n "$tags" ]; then
        local tags_json=$(echo "$tags" | tr ',' '\n' | jq -R '{name: .}' | jq -s '.')
        data=$(echo "$data" | jq --argjson tags "$tags_json" '. + {tags: $tags}')
    fi

    local response=$(api_request "PATCH" "/items/${item_id}" "$data" "true")
    output_response "$response"
}

cmd_item_delete() {
    local item_id=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --id) item_id="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$item_id" ]; then
        log_error "--id is required"
        exit 1
    fi

    check_auth
    log_info "Deleting article: $item_id"

    api_request "DELETE" "/items/${item_id}" "" "true"
    log_info "Article deleted successfully"
}

# ============================================================================
# USER COMMANDS
# ============================================================================

cmd_user() {
    local subcmd="$1"
    shift

    case "$subcmd" in
        me) cmd_user_me "$@" ;;
        get) cmd_user_get "$@" ;;
        items) cmd_user_items "$@" ;;
        stocks) cmd_user_stocks "$@" ;;
        followers) cmd_user_followers "$@" ;;
        following) cmd_user_following "$@" ;;
        *)
            echo "Usage: qiita.sh user <me|get|items|stocks|followers|following> [options]"
            exit 1
            ;;
    esac
}

cmd_user_me() {
    check_auth
    log_info "Getting authenticated user..."

    local response=$(api_request "GET" "/authenticated_user" "" "true")
    output_response "$response"
}

cmd_user_get() {
    local user_id=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --id) user_id="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$user_id" ]; then
        log_error "--id is required"
        exit 1
    fi

    log_info "Getting user: $user_id"

    local response=$(api_request "GET" "/users/${user_id}")
    output_response "$response"
}

cmd_user_items() {
    local user_id=""
    local page=1
    local per_page=20

    while [[ $# -gt 0 ]]; do
        case $1 in
            --id) user_id="$2"; shift 2 ;;
            --page) page="$2"; shift 2 ;;
            --per-page) per_page="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$user_id" ]; then
        log_error "--id is required"
        exit 1
    fi

    log_info "Getting articles by user: $user_id"

    local response=$(api_request "GET" "/users/${user_id}/items?page=${page}&per_page=${per_page}")
    output_response "$response"
}

cmd_user_stocks() {
    local user_id=""
    local page=1
    local per_page=20

    while [[ $# -gt 0 ]]; do
        case $1 in
            --id) user_id="$2"; shift 2 ;;
            --page) page="$2"; shift 2 ;;
            --per-page) per_page="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$user_id" ]; then
        log_error "--id is required"
        exit 1
    fi

    log_info "Getting stocks by user: $user_id"

    local response=$(api_request "GET" "/users/${user_id}/stocks?page=${page}&per_page=${per_page}")
    output_response "$response"
}

cmd_user_followers() {
    local user_id=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --id) user_id="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$user_id" ]; then
        log_error "--id is required"
        exit 1
    fi

    log_info "Getting followers of: $user_id"

    local response=$(api_request "GET" "/users/${user_id}/followers")
    output_response "$response"
}

cmd_user_following() {
    local user_id=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --id) user_id="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$user_id" ]; then
        log_error "--id is required"
        exit 1
    fi

    log_info "Getting users followed by: $user_id"

    local response=$(api_request "GET" "/users/${user_id}/followees")
    output_response "$response"
}

# ============================================================================
# TAG COMMANDS
# ============================================================================

cmd_tag() {
    local subcmd="$1"
    shift

    case "$subcmd" in
        list) cmd_tag_list "$@" ;;
        get) cmd_tag_get "$@" ;;
        items) cmd_tag_items "$@" ;;
        *)
            echo "Usage: qiita.sh tag <list|get|items> [options]"
            exit 1
            ;;
    esac
}

cmd_tag_list() {
    local page=1
    local per_page=20
    local sort="count"

    while [[ $# -gt 0 ]]; do
        case $1 in
            --page) page="$2"; shift 2 ;;
            --per-page) per_page="$2"; shift 2 ;;
            --sort) sort="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    log_info "Getting tags (sort: $sort)..."

    local response=$(api_request "GET" "/tags?page=${page}&per_page=${per_page}&sort=${sort}")
    output_response "$response"
}

cmd_tag_get() {
    local tag_id=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --id) tag_id="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$tag_id" ]; then
        log_error "--id is required"
        exit 1
    fi

    log_info "Getting tag: $tag_id"

    local response=$(api_request "GET" "/tags/${tag_id}")
    output_response "$response"
}

cmd_tag_items() {
    local tag_id=""
    local page=1
    local per_page=20

    while [[ $# -gt 0 ]]; do
        case $1 in
            --id) tag_id="$2"; shift 2 ;;
            --page) page="$2"; shift 2 ;;
            --per-page) per_page="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$tag_id" ]; then
        log_error "--id is required"
        exit 1
    fi

    log_info "Getting articles with tag: $tag_id"

    local response=$(api_request "GET" "/tags/${tag_id}/items?page=${page}&per_page=${per_page}")
    output_response "$response"
}

# ============================================================================
# COMMENT COMMANDS
# ============================================================================

cmd_comment() {
    local subcmd="$1"
    shift

    case "$subcmd" in
        list) cmd_comment_list "$@" ;;
        post) cmd_comment_post "$@" ;;
        delete) cmd_comment_delete "$@" ;;
        *)
            echo "Usage: qiita.sh comment <list|post|delete> [options]"
            exit 1
            ;;
    esac
}

cmd_comment_list() {
    local item_id=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --item-id) item_id="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$item_id" ]; then
        log_error "--item-id is required"
        exit 1
    fi

    log_info "Getting comments for article: $item_id"

    local response=$(api_request "GET" "/items/${item_id}/comments")
    output_response "$response"
}

cmd_comment_post() {
    local item_id=""
    local body=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --item-id) item_id="$2"; shift 2 ;;
            --body) body="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$item_id" ]; then
        log_error "--item-id is required"
        exit 1
    fi

    if [ -z "$body" ]; then
        log_error "--body is required"
        exit 1
    fi

    check_auth
    log_info "Posting comment to: $item_id"

    local data=$(jq -n --arg body "$body" '{body: $body}')
    local response=$(api_request "POST" "/items/${item_id}/comments" "$data" "true")
    output_response "$response"
}

cmd_comment_delete() {
    local comment_id=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --id) comment_id="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$comment_id" ]; then
        log_error "--id is required"
        exit 1
    fi

    check_auth
    log_info "Deleting comment: $comment_id"

    api_request "DELETE" "/comments/${comment_id}" "" "true"
    log_info "Comment deleted successfully"
}

# ============================================================================
# AUTH COMMANDS
# ============================================================================

cmd_auth() {
    local subcmd="$1"
    shift

    case "$subcmd" in
        verify) cmd_auth_verify "$@" ;;
        *)
            echo "Usage: qiita.sh auth <verify> [options]"
            exit 1
            ;;
    esac
}

cmd_auth_verify() {
    check_auth
    log_info "Verifying access token..."

    local response=$(api_request "GET" "/authenticated_user" "" "true")
    local username=$(echo "$response" | jq -r '.id // "unknown"')
    log_info "Token valid for user: $username"
    output_response "$response"
}

# ============================================================================
# MAIN
# ============================================================================

show_help() {
    cat << EOF
Qiita API Client

Usage: qiita.sh <command> <subcommand> [options]

Commands:
  item search             Search articles
  item get                Get article by ID
  item mine               Get my articles
  item post               Post new article
  item update             Update article
  item delete             Delete article

  user me                 Get authenticated user
  user get                Get user profile
  user items              Get user's articles
  user stocks             Get user's stocks
  user followers          Get user's followers
  user following          Get users followed by user

  tag list                List popular tags
  tag get                 Get tag info
  tag items               Get articles by tag

  comment list            Get article comments
  comment post            Post comment
  comment delete          Delete comment

  auth verify             Verify access token

Environment Variables:
  QIITA_ACCESS_TOKEN      Qiita access token (required for write operations)

Examples:
  # Search articles
  qiita.sh item search --query "tag:Python"

  # Get user's articles
  qiita.sh user items --id "username" --per-page 5

  # Post article
  qiita.sh item post --title "My Article" --body "# Hello" --tags "Python"

  # Get trending tags
  qiita.sh tag list --sort count --per-page 10

For more information, see SKILL.md
EOF
}

# Parse global options
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            break
            ;;
    esac
done

# Main command routing
command="$1"
shift || true

case "$command" in
    item) cmd_item "$@" ;;
    user) cmd_user "$@" ;;
    tag) cmd_tag "$@" ;;
    comment) cmd_comment "$@" ;;
    auth) cmd_auth "$@" ;;
    ""|help) show_help ;;
    *)
        log_error "Unknown command: $command"
        show_help
        exit 1
        ;;
esac
