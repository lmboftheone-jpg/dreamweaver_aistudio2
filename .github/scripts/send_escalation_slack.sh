#!/usr/bin/env bash
set -e

STATS_FILE="$1"
DASHBOARD_URL="$2"
WEBHOOK="$SLACK_WEBHOOK_URL"

TOTAL=$(jq '.total' "$STATS_FILE")

get_count () {
  jq -r --arg r "$1" '.by_reason[]? | select(.reason==$r) | .count' "$STATS_FILE" || echo 0
}

CRITICAL=$(get_count critical-failure)
SMOKE=$(get_count smoke-failure)
QUALITY=$(get_count quality-failure)
AGENT=$(get_count human-review)

MESSAGE=$(cat <<EOF
{
  "text": "🚨 *Weekly Escalation Report*\\n\\n\
• Total Escalations: *$TOTAL*\\n\
• Critical Failure: $CRITICAL\\n\
• Smoke Failure: $SMOKE\\n\
• Quality Failure: $QUALITY\\n\
• Agent Policy: $AGENT\\n\\n\
📊 Dashboard:\\n$DASHBOARD_URL"
}
EOF
)

curl -X POST -H 'Content-type: application/json' \
  --data "$MESSAGE" \
  "$WEBHOOK"
