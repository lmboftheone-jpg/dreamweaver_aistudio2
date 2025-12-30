#!/usr/bin/env bash
set -e

DECISION="$1"
PR_NUMBER="$2"
QUALITY_SCORE="$3"
QUALITY_THRESHOLD="$4"
REPO="${GITHUB_REPOSITORY}"

TITLE=""
LABEL=""
BODY=""

case "$DECISION" in
  BLOCK_CRITICAL)
    TITLE="🚨 Critical Failure for PR #${PR_NUMBER}"
    LABEL="critical-failure"
    BODY=$(cat <<EOF
🚨 **Critical Failure Detected**

Linked PR: #${PR_NUMBER}

Action Required:
- Manual investigation required
EOF
)
    ;;
  BLOCK_SMOKE_FAIL)
    TITLE="🧪 Smoke Test Failure for PR #${PR_NUMBER}"
    LABEL="smoke-failure"
    BODY=$(cat <<EOF
🧪 **Smoke Test Failed**

Linked PR: #${PR_NUMBER}

Action Required:
- Fix smoke tests
- Re-run pipeline
EOF
)
    ;;
  BLOCK_LOW_QUALITY)
    TITLE="📉 Quality Improvement Needed for PR #${PR_NUMBER}"
    LABEL="quality-failure"
    BODY=$(cat <<EOF
📉 **Quality Below Threshold**

Linked PR: #${PR_NUMBER}

Score: ${QUALITY_SCORE}
Threshold: ${QUALITY_THRESHOLD}

Suggested Action:
- Improve code quality
- Re-run pipeline
EOF
)
    ;;
  BLOCK_AGENT_POLICY)
    TITLE="🧑‍⚖️ Human Review Required for PR #${PR_NUMBER}"
    LABEL="human-review"
    BODY=$(cat <<EOF
🧑‍⚖️ **Human Review Required**

Linked PR: #${PR_NUMBER}

Reason:
- Agent policy blocked AI result

Action Required:
- Human reviewer must inspect
EOF
)
    ;;
  *)
    echo "No block issue needed for $DECISION"
    exit 0
    ;;
esac

# 🔒 중복 방지: 이미 같은 PR용 Issue가 있으면 생성 안 함
EXISTING=$(gh issue list --search "PR #${PR_NUMBER} in:title" --json number --jq 'length')
if [ "$EXISTING" != "0" ]; then
  echo "⚠️ Block issue already exists"
  exit 0
fi

gh issue create \
  --title "$TITLE" \
  --label "$LABEL" \
  --body "$BODY"
