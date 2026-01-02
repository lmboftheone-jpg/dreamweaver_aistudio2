#!/usr/bin/env bash
set -e

LOG_FILE=$1

SUMMARY=""

if grep -q "Environment Variable" "$LOG_FILE"; then
  SUMMARY+="• ❌ 환경 변수 누락\n"
fi

if grep -q "Node.js version" "$LOG_FILE"; then
  SUMMARY+="• ❌ Node 버전 불일치\n"
fi

if grep -q "fetch failed" "$LOG_FILE"; then
  SUMMARY+="• ❌ 빌드 타임 외부 API 호출\n"
fi

if grep -q "Module not found" "$LOG_FILE"; then
  SUMMARY+="• ❌ 의존성 누락 또는 import 오류\n"
fi

if grep -q "route.ts" "$LOG_FILE"; then
  SUMMARY+="• ❌ Next.js API Route 구조 오류\n"
fi

if [ -z "$SUMMARY" ]; then
  SUMMARY="• ⚠️ 알 수 없는 빌드 오류 (로그 확인 필요)"
fi

echo -e "$SUMMARY"
