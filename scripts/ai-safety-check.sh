#!/usr/bin/env bash
set -e

OUTPUT=$1

# JSON 파싱 가능 여부
jq empty "$OUTPUT"

# 절대 금지 규칙
if jq -e '.human_only == false and .pattern | test("security|auth|token")' "$OUTPUT"; then
  echo "❌ Security 관련 패턴에서 human_only=false"
  exit 1
fi

# Retry 금지 규칙
if jq -e '.retry_success_rate < 0.2 and .auto_retry == true' "$OUTPUT"; then
  echo "❌ Retry 성공률 낮은데 auto_retry 활성"
  exit 1
fi
