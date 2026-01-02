#!/usr/bin/env bash
set -e

mkdir -p ai/input

cat <<EOF > ai/input/runtime.json
{
  "failure_patterns": $(cat ci/failure_patterns.json),
  "human_only_rules": $(cat ci/human_only_rules.json),
  "ci_metrics": {
    "retry_success_rate": 0.18,
    "avg_ci_duration": 420
  },
  "tenant": {
    "plan": "pro"
  }
}
EOF
