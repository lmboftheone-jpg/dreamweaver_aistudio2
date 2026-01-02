#!/usr/bin/env bash
set -e

LOG_FILE=$1
RULE_FILE="ci/human_only_rules.json"

HUMAN_REQUIRED=0
REASONS=""

for row in $(jq -c '.patterns[]' "$RULE_FILE"); do
  id=$(echo "$row" | jq -r '.id')
  match=$(echo "$row" | jq -r '.match')
  reason=$(echo "$row" | jq -r '.reason')

  if grep -Ei "$match" "$LOG_FILE" >/dev/null; then
    HUMAN_REQUIRED=1
    REASONS+="• ❌ $reason ($id)\n"
  fi
done

if [ "$HUMAN_REQUIRED" -eq 1 ]; then
  echo -e "$REASONS"
  exit 42
fi
