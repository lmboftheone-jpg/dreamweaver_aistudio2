#!/usr/bin/env bash
set -e

PERIOD="$1" # week | month
SINCE=""

if [ "$PERIOD" = "week" ]; then
  SINCE=$(date -u -d '7 days ago' +%Y-%m-%d)
else
  SINCE=$(date -u -d '30 days ago' +%Y-%m-%d)
fi

echo "Collecting escalation stats since $SINCE"

gh issue list \
  --state all \
  --label escalation-required \
  --search "created:>=$SINCE" \
  --json labels,createdAt \
  > issues.json

jq '
  {
    total: length,
    by_reason: (
      map(.labels[].name) | flatten |
      map(select(
        .=="critical-failure" or
        .=="smoke-failure" or
        .=="quality-failure" or
        .=="human-review"
      )) |
      group_by(.) |
      map({ reason: .[0], count: length })
    )
  }
' issues.json > stats.json
