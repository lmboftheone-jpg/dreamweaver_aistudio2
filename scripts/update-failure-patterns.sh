#!/usr/bin/env bash
set -e

LOG_FILE=$1
PATTERN_FILE="ci/failure_patterns.json"

update_pattern () {
  local key=$1
  jq ".$key.count += 1" "$PATTERN_FILE" > tmp.json && mv tmp.json "$PATTERN_FILE"
}

grep -q "환경 변수" "$LOG_FILE" && update_pattern "missing_env"
grep -q "Node 버전" "$LOG_FILE" && update_pattern "node_version"
grep -q "fetch failed" "$LOG_FILE" && update_pattern "build_time_fetch"
grep -q "route.ts" "$LOG_FILE" && update_pattern "next_route_error"
