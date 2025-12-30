#!/usr/bin/env bash
set -e

ISSUE_BODY="$1"

get_flag () {
  local label="$1"
  echo "$ISSUE_BODY" | grep -q "\- \[x\] $label" && echo "true" || echo "false"
}

echo "SMOKE_ONLY=$(get_flag 'Enable smoke test only')" >> $GITHUB_ENV
echo "FORCE_CRITICAL_FAIL=$(get_flag 'Force critical failure')" >> $GITHUB_ENV
echo "FORCE_LOW_QUALITY=$(get_flag 'Force low quality score')" >> $GITHUB_ENV
echo "SIMULATE_LOW_AGENT=$(get_flag 'Simulate low-score agent')" >> $GITHUB_ENV
echo "DISABLE_AUTO_MERGE=$(get_flag 'Disable auto merge')" >> $GITHUB_ENV
