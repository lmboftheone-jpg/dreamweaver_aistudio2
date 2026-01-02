#!/usr/bin/env bash
set -e

PATTERN_FILE="ci/failure_patterns.json"
BLOCKED=0
REASONS=""

for key in $(jq -r 'keys[]' "$PATTERN_FILE"); do
  count=$(jq -r ".${key}.count" "$PATTERN_FILE")
  threshold=$(jq -r ".${key}.threshold" "$PATTERN_FILE")
  message=$(jq -r ".${key}.message" "$PATTERN_FILE")

  if [ "$count" -ge "$threshold" ]; then
    BLOCKED=1
    REASONS+="• ❌ $message (count=$count)\n"
  fi
done

if [ "$BLOCKED" -eq 1 ]; then
  echo -e "🚫 Fail Fast Activated\n\n$REASONS"
  exit 1
fi
