#!/bin/bash

# Lark (Feishu) API Client
# Complete integration for messaging, groups, contacts, and calendar
# Usage: lark.sh <command> <subcommand> [options]

set -e

# Configuration
BASE_URL="https://open.feishu.cn/open-apis"
OUTPUT_DIR="${LARK_OUTPUT_DIR:-/tmp/lark}"
TOKEN_FILE="${OUTPUT_DIR}/token.json"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Check required environment variables
check_env() {
    if [ -z "$LARK_APP_ID" ] || [ -z "$LARK_APP_SECRET" ]; then
        log_error "LARK_APP_ID and LARK_APP_SECRET must be set"
        echo "Set them with:"
        echo "  export LARK_APP_ID=cli_xxxxx"
        echo "  export LARK_APP_SECRET=xxxxx"
        exit 1
    fi
}

# Get or refresh access token
get_token() {
    # Check if cached token is still valid
    if [ -f "$TOKEN_FILE" ]; then
        local expire_time=$(jq -r '.expire_time // 0' "$TOKEN_FILE" 2>/dev/null || echo "0")
        local current_time=$(date +%s)
        if [ "$current_time" -lt "$expire_time" ]; then
            jq -r '.tenant_access_token' "$TOKEN_FILE"
            return 0
        fi
    fi

    # Get new token
    check_env
    local response=$(curl -s -X POST "${BASE_URL}/auth/v3/tenant_access_token/internal" \
        -H "Content-Type: application/json" \
        -d "{\"app_id\": \"${LARK_APP_ID}\", \"app_secret\": \"${LARK_APP_SECRET}\"}")

    local code=$(echo "$response" | jq -r '.code // -1')
    if [ "$code" != "0" ]; then
        log_error "Failed to get token: $(echo "$response" | jq -r '.msg // "Unknown error"')"
        exit 1
    fi

    local token=$(echo "$response" | jq -r '.tenant_access_token')
    local expire=$(echo "$response" | jq -r '.expire')
    local expire_time=$(($(date +%s) + expire - 300))  # Refresh 5 min before expiry

    echo "$response" | jq ". + {expire_time: $expire_time}" > "$TOKEN_FILE"
    echo "$token"
}

# Make API request
api_request() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    local token=$(get_token)

    local curl_args=(-s -X "$method" "${BASE_URL}${endpoint}" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json")

    if [ -n "$data" ]; then
        curl_args+=(-d "$data")
    fi

    curl "${curl_args[@]}"
}

# Save response to file
save_response() {
    local prefix="$1"
    local response="$2"
    local output_file="${OUTPUT_DIR}/${prefix}_${TIMESTAMP}.json"
    echo "$response" > "$output_file"
    log_info "Response saved to: $output_file"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
}

# ============================================================================
# AUTH COMMANDS
# ============================================================================

cmd_auth() {
    check_env
    log_info "Getting tenant access token..."

    local response=$(curl -s -X POST "${BASE_URL}/auth/v3/tenant_access_token/internal" \
        -H "Content-Type: application/json" \
        -d "{\"app_id\": \"${LARK_APP_ID}\", \"app_secret\": \"${LARK_APP_SECRET}\"}")

    local code=$(echo "$response" | jq -r '.code // -1')
    if [ "$code" != "0" ]; then
        log_error "Failed: $(echo "$response" | jq -r '.msg')"
        exit 1
    fi

    local expire=$(echo "$response" | jq -r '.expire')
    local expire_time=$(($(date +%s) + expire - 300))
    echo "$response" | jq ". + {expire_time: $expire_time}" > "$TOKEN_FILE"

    log_info "Token obtained successfully!"
    log_info "Expires in: ${expire} seconds"
    log_info "Cached to: $TOKEN_FILE"
}

# ============================================================================
# MESSAGE COMMANDS
# ============================================================================

cmd_message() {
    local subcmd="$1"
    shift

    case "$subcmd" in
        send) cmd_message_send "$@" ;;
        reply) cmd_message_reply "$@" ;;
        list) cmd_message_list "$@" ;;
        *)
            echo "Usage: lark.sh message <send|reply|list> [options]"
            exit 1
            ;;
    esac
}

cmd_message_send() {
    local receive_id=""
    local receive_id_type="open_id"
    local text=""
    local post=""
    local card=""
    local image=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --to) receive_id="$2"; shift 2 ;;
            --type) receive_id_type="$2"; shift 2 ;;
            --text) text="$2"; shift 2 ;;
            --post) post="$2"; shift 2 ;;
            --card) card="$2"; shift 2 ;;
            --image) image="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$receive_id" ]; then
        log_error "--to is required"
        exit 1
    fi

    local msg_type=""
    local content=""

    if [ -n "$text" ]; then
        msg_type="text"
        content="{\"text\": \"$text\"}"
    elif [ -n "$post" ]; then
        msg_type="post"
        content="$post"
    elif [ -n "$card" ]; then
        msg_type="interactive"
        content="$card"
    elif [ -n "$image" ]; then
        msg_type="image"
        content="{\"image_key\": \"$image\"}"
    else
        log_error "One of --text, --post, --card, or --image is required"
        exit 1
    fi

    log_info "Sending $msg_type message to $receive_id..."

    local data=$(jq -n \
        --arg receive_id "$receive_id" \
        --arg msg_type "$msg_type" \
        --argjson content "$content" \
        '{receive_id: $receive_id, msg_type: $msg_type, content: ($content | tostring)}')

    local response=$(api_request "POST" "/im/v1/messages?receive_id_type=${receive_id_type}" "$data")
    save_response "message" "$response"
}

cmd_message_reply() {
    local message_id=""
    local text=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --message-id) message_id="$2"; shift 2 ;;
            --text) text="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$message_id" ] || [ -z "$text" ]; then
        log_error "--message-id and --text are required"
        exit 1
    fi

    log_info "Replying to message $message_id..."

    local content="{\"text\": \"$text\"}"
    local data=$(jq -n \
        --arg msg_type "text" \
        --arg content "$content" \
        '{msg_type: $msg_type, content: $content}')

    local response=$(api_request "POST" "/im/v1/messages/${message_id}/reply" "$data")
    save_response "reply" "$response"
}

cmd_message_list() {
    local chat_id=""
    local limit=20

    while [[ $# -gt 0 ]]; do
        case $1 in
            --chat-id) chat_id="$2"; shift 2 ;;
            --limit) limit="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$chat_id" ]; then
        log_error "--chat-id is required"
        exit 1
    fi

    log_info "Getting messages from chat $chat_id..."

    local response=$(api_request "GET" "/im/v1/messages?container_id_type=chat&container_id=${chat_id}&page_size=${limit}")
    save_response "messages" "$response"
}

# ============================================================================
# CHAT COMMANDS
# ============================================================================

cmd_chat() {
    local subcmd="$1"
    shift

    case "$subcmd" in
        create) cmd_chat_create "$@" ;;
        list) cmd_chat_list "$@" ;;
        info) cmd_chat_info "$@" ;;
        add-member) cmd_chat_add_member "$@" ;;
        remove-member) cmd_chat_remove_member "$@" ;;
        *)
            echo "Usage: lark.sh chat <create|list|info|add-member|remove-member> [options]"
            exit 1
            ;;
    esac
}

cmd_chat_create() {
    local name=""
    local members=""
    local description=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --name) name="$2"; shift 2 ;;
            --members) members="$2"; shift 2 ;;
            --description) description="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$name" ]; then
        log_error "--name is required"
        exit 1
    fi

    log_info "Creating chat: $name..."

    local data="{\"name\": \"$name\""

    if [ -n "$description" ]; then
        data="$data, \"description\": \"$description\""
    fi

    if [ -n "$members" ]; then
        local member_array=$(echo "$members" | tr ',' '\n' | jq -R . | jq -s .)
        data="$data, \"user_id_list\": $member_array"
    fi

    data="$data}"

    local response=$(api_request "POST" "/im/v1/chats?user_id_type=open_id" "$data")
    save_response "chat" "$response"
}

cmd_chat_list() {
    log_info "Getting chat list..."
    local response=$(api_request "GET" "/im/v1/chats")
    save_response "chats" "$response"
}

cmd_chat_info() {
    local chat_id=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --chat-id) chat_id="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$chat_id" ]; then
        log_error "--chat-id is required"
        exit 1
    fi

    log_info "Getting chat info: $chat_id..."
    local response=$(api_request "GET" "/im/v1/chats/${chat_id}")
    save_response "chat_info" "$response"
}

cmd_chat_add_member() {
    local chat_id=""
    local members=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --chat-id) chat_id="$2"; shift 2 ;;
            --members) members="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$chat_id" ] || [ -z "$members" ]; then
        log_error "--chat-id and --members are required"
        exit 1
    fi

    log_info "Adding members to chat $chat_id..."

    local member_array=$(echo "$members" | tr ',' '\n' | jq -R . | jq -s .)
    local data="{\"id_list\": $member_array}"

    local response=$(api_request "POST" "/im/v1/chats/${chat_id}/members?member_id_type=open_id" "$data")
    save_response "chat_members" "$response"
}

cmd_chat_remove_member() {
    local chat_id=""
    local members=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --chat-id) chat_id="$2"; shift 2 ;;
            --members) members="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$chat_id" ] || [ -z "$members" ]; then
        log_error "--chat-id and --members are required"
        exit 1
    fi

    log_info "Removing members from chat $chat_id..."

    local member_array=$(echo "$members" | tr ',' '\n' | jq -R . | jq -s .)
    local data="{\"id_list\": $member_array}"

    local response=$(api_request "DELETE" "/im/v1/chats/${chat_id}/members?member_id_type=open_id" "$data")
    save_response "chat_members" "$response"
}

# ============================================================================
# CONTACT COMMANDS
# ============================================================================

cmd_contact() {
    local subcmd="$1"
    shift

    case "$subcmd" in
        user) cmd_contact_user "$@" ;;
        search) cmd_contact_search "$@" ;;
        departments) cmd_contact_departments "$@" ;;
        members) cmd_contact_members "$@" ;;
        *)
            echo "Usage: lark.sh contact <user|search|departments|members> [options]"
            exit 1
            ;;
    esac
}

cmd_contact_user() {
    local user_id=""
    local user_id_type="open_id"

    while [[ $# -gt 0 ]]; do
        case $1 in
            --user-id) user_id="$2"; shift 2 ;;
            --type) user_id_type="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$user_id" ]; then
        log_error "--user-id is required"
        exit 1
    fi

    log_info "Getting user info: $user_id..."
    local response=$(api_request "GET" "/contact/v3/users/${user_id}?user_id_type=${user_id_type}")
    save_response "user" "$response"
}

cmd_contact_search() {
    local query=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --query) query="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$query" ]; then
        log_error "--query is required"
        exit 1
    fi

    log_info "Searching users: $query..."

    local data="{\"query\": \"$query\"}"
    local response=$(api_request "POST" "/contact/v3/users/search?user_id_type=open_id" "$data")
    save_response "users" "$response"
}

cmd_contact_departments() {
    local parent_id="0"

    while [[ $# -gt 0 ]]; do
        case $1 in
            --parent-id) parent_id="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    log_info "Getting departments (parent: $parent_id)..."
    local response=$(api_request "GET" "/contact/v3/departments?parent_department_id=${parent_id}")
    save_response "departments" "$response"
}

cmd_contact_members() {
    local department_id=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --department-id) department_id="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$department_id" ]; then
        log_error "--department-id is required"
        exit 1
    fi

    log_info "Getting department members: $department_id..."
    local response=$(api_request "GET" "/contact/v3/users/find_by_department?department_id=${department_id}&user_id_type=open_id")
    save_response "members" "$response"
}

# ============================================================================
# CALENDAR COMMANDS
# ============================================================================

cmd_calendar() {
    local subcmd="$1"
    shift

    case "$subcmd" in
        list) cmd_calendar_list "$@" ;;
        create-event) cmd_calendar_create_event "$@" ;;
        events) cmd_calendar_events "$@" ;;
        *)
            echo "Usage: lark.sh calendar <list|create-event|events> [options]"
            exit 1
            ;;
    esac
}

cmd_calendar_list() {
    log_info "Getting calendar list..."
    local response=$(api_request "GET" "/calendar/v4/calendars")
    save_response "calendars" "$response"
}

cmd_calendar_create_event() {
    local calendar_id=""
    local summary=""
    local start_time=""
    local end_time=""
    local description=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --calendar-id) calendar_id="$2"; shift 2 ;;
            --summary) summary="$2"; shift 2 ;;
            --start) start_time="$2"; shift 2 ;;
            --end) end_time="$2"; shift 2 ;;
            --description) description="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$calendar_id" ] || [ -z "$summary" ] || [ -z "$start_time" ] || [ -z "$end_time" ]; then
        log_error "--calendar-id, --summary, --start, and --end are required"
        exit 1
    fi

    log_info "Creating event: $summary..."

    # Convert ISO 8601 to Unix timestamp
    local start_ts=$(date -j -f "%Y-%m-%dT%H:%M:%S%z" "$start_time" "+%s" 2>/dev/null || date -d "$start_time" "+%s")
    local end_ts=$(date -j -f "%Y-%m-%dT%H:%M:%S%z" "$end_time" "+%s" 2>/dev/null || date -d "$end_time" "+%s")

    local data=$(jq -n \
        --arg summary "$summary" \
        --arg description "$description" \
        --arg start_ts "$start_ts" \
        --arg end_ts "$end_ts" \
        '{
            summary: $summary,
            description: $description,
            start_time: {timestamp: $start_ts},
            end_time: {timestamp: $end_ts}
        }')

    local response=$(api_request "POST" "/calendar/v4/calendars/${calendar_id}/events" "$data")
    save_response "event" "$response"
}

cmd_calendar_events() {
    local calendar_id=""
    local start_time=""
    local end_time=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --calendar-id) calendar_id="$2"; shift 2 ;;
            --start) start_time="$2"; shift 2 ;;
            --end) end_time="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [ -z "$calendar_id" ]; then
        log_error "--calendar-id is required"
        exit 1
    fi

    log_info "Getting events from calendar: $calendar_id..."

    local query_params=""
    if [ -n "$start_time" ]; then
        local start_ts=$(date -j -f "%Y-%m-%dT%H:%M:%S%z" "$start_time" "+%s" 2>/dev/null || date -d "$start_time" "+%s")
        query_params="start_time=${start_ts}"
    fi
    if [ -n "$end_time" ]; then
        local end_ts=$(date -j -f "%Y-%m-%dT%H:%M:%S%z" "$end_time" "+%s" 2>/dev/null || date -d "$end_time" "+%s")
        [ -n "$query_params" ] && query_params="${query_params}&"
        query_params="${query_params}end_time=${end_ts}"
    fi

    local endpoint="/calendar/v4/calendars/${calendar_id}/events"
    [ -n "$query_params" ] && endpoint="${endpoint}?${query_params}"

    local response=$(api_request "GET" "$endpoint")
    save_response "events" "$response"
}

# ============================================================================
# BOT COMMANDS
# ============================================================================

cmd_bot() {
    local subcmd="$1"
    shift

    case "$subcmd" in
        info) cmd_bot_info "$@" ;;
        *)
            echo "Usage: lark.sh bot <info> [options]"
            exit 1
            ;;
    esac
}

cmd_bot_info() {
    log_info "Getting bot info..."
    local response=$(api_request "GET" "/bot/v3/info")
    save_response "bot" "$response"
}

# ============================================================================
# MAIN
# ============================================================================

show_help() {
    cat << EOF
Lark (Feishu) API Client

Usage: lark.sh <command> <subcommand> [options]

Commands:
  auth                      Get and cache access token

  message send              Send a message
  message reply             Reply to a message
  message list              Get chat history

  chat create               Create a group chat
  chat list                 List all chats
  chat info                 Get chat details
  chat add-member           Add members to chat
  chat remove-member        Remove members from chat

  contact user              Get user info
  contact search            Search users
  contact departments       List departments
  contact members           Get department members

  calendar list             List calendars
  calendar create-event     Create an event
  calendar events           List events

  bot info                  Get bot information

Environment Variables:
  LARK_APP_ID               Lark app ID (required)
  LARK_APP_SECRET           Lark app secret (required)
  LARK_OUTPUT_DIR           Output directory (default: /tmp/lark)

Examples:
  # Get access token
  lark.sh auth

  # Send text message
  lark.sh message send --to "ou_xxx" --type "open_id" --text "Hello"

  # Create group
  lark.sh chat create --name "Team" --members "ou_xxx,ou_yyy"

  # Search users
  lark.sh contact search --query "John"

For more information, see SKILL.md
EOF
}

# Parse global options
while [[ $# -gt 0 ]]; do
    case $1 in
        --output-dir)
            OUTPUT_DIR="$2"
            TOKEN_FILE="${OUTPUT_DIR}/token.json"
            mkdir -p "$OUTPUT_DIR"
            shift 2
            ;;
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
    auth) cmd_auth "$@" ;;
    message) cmd_message "$@" ;;
    chat) cmd_chat "$@" ;;
    contact) cmd_contact "$@" ;;
    calendar) cmd_calendar "$@" ;;
    bot) cmd_bot "$@" ;;
    ""|help) show_help ;;
    *)
        log_error "Unknown command: $command"
        show_help
        exit 1
        ;;
esac
