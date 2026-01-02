#!/usr/bin/env bash
set -e

SUMMARY="$1"
JOB_URL="$2"

payload=$(cat <<EOF
{
  "text": "🚨 *Vercel Build Failed*\n\n${SUMMARY}\n\n🔗 <$JOB_URL|GitHub Actions 로그 보기>"
}
EOF
)

curl -X POST \
  -H 'Content-type: application/json' \
  --data "$payload" \
  "$SLACK_WEBHOOK_URL"
