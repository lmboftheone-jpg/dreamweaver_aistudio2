#!/usr/bin/env bash
set -e

echo "🔍 Vercel Prebuild Check 시작..."
echo "----------------------------------"

FAIL=0

# 1️⃣ 필수 환경변수 체크
REQUIRED_ENVS=(
  "SLACK_SIGNING_SECRET"
  "GITHUB_WEBHOOK_SECRET"
  "NODE_ENV"
)

echo "🧪 환경 변수 체크"
for VAR in "${REQUIRED_ENVS[@]}"; do
  if [ -z "${!VAR}" ]; then
    echo "❌ 환경 변수 누락: $VAR"
    FAIL=1
  else
    echo "✅ $VAR OK"
  fi
done

# 2️⃣ Node 버전 체크
echo ""
echo "🧪 Node 버전 체크"
NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_NODE_MAJOR=18

NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)

if [ "$NODE_MAJOR" -lt "$REQUIRED_NODE_MAJOR" ]; then
  echo "❌ Node 버전 낮음: $NODE_VERSION (>=18 필요)"
  FAIL=1
else
  echo "✅ Node 버전 OK: $NODE_VERSION"
fi

# 3️⃣ 빌드 타임 실행 금지 코드 탐지
echo ""
echo "🧪 빌드 타임 위험 코드 스캔"

DANGEROUS_PATTERNS=(
  "new Slack"
  "slack\.chat"
  "process\.env\.SLACK_.*!"
  "fetch\\(\"https://slack.com"
  "fetch\\(\"https://api.github.com"
)

for PATTERN in "${DANGEROUS_PATTERNS[@]}"; do
  if grep -R "$PATTERN" ./src ./app ./pages 2>/dev/null; then
    echo "❌ 빌드 타임 실행 위험 코드 발견: $PATTERN"
    FAIL=1
  fi
done

# 4️⃣ Next.js API Route 체크
echo ""
echo "🧪 Next.js API Route 구조 체크"

if [ -d "./app" ]; then
  if ! find ./app -path "*api*" | grep -q route.ts; then
    echo "⚠️ app router 사용 중인데 route.ts 없음 (확인 필요)"
  else
    echo "✅ app router API 구조 OK"
  fi
fi

# 5️⃣ lock 파일 체크
echo ""
echo "🧪 Lock 파일 체크"

if [ ! -f "package-lock.json" ]; then
  echo "❌ package-lock.json 없음 (npm ci 실패 가능)"
  FAIL=1
else
  echo "✅ package-lock.json OK"
fi

# 6️⃣ node_modules 존재 여부
echo ""
echo "🧪 node_modules 체크"

if [ -d "node_modules" ]; then
  echo "⚠️ node_modules 존재 → Vercel에서는 무시되지만 로컬 테스트 영향 가능"
else
  echo "✅ node_modules 없음"
fi

echo ""
echo "----------------------------------"

if [ "$FAIL" -eq 1 ]; then
  echo "🚨 Vercel Prebuild Check FAILED"
  exit 1
else
  echo "🎉 Vercel Prebuild Check PASSED"
fi
