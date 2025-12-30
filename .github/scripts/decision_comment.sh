#!/usr/bin/env bash
set -e

DECISION="$1"
QUALITY_SCORE="$2"
QUALITY_THRESHOLD="$3"

STATUS=""
REASON=""
DETAILS=""
NEXT=""

case "$DECISION" in
  BLOCK_CRITICAL)
    STATUS="❌ BLOCKED (CRITICAL)"
    REASON="Critical failure detected"
    DETAILS="Pipeline stopped by forced critical error"
    NEXT="Fix critical issue and reopen PR"
    ;;
  BLOCK_SMOKE_FAIL)
    STATUS="❌ BLOCKED (SMOKE)"
    REASON="Smoke test failed"
    DETAILS="Basic checks did not pass"
    NEXT="Fix smoke test failures and retry"
    ;;
  BLOCK_AGENT_POLICY)
    STATUS="❌ BLOCKED (AGENT POLICY)"
    REASON="Agent policy violation"
    DETAILS="Low-score agent result rejected"
    NEXT="Review agent output or assign human reviewer"
    ;;
  BLOCK_LOW_QUALITY)
    STATUS="❌ BLOCKED (QUALITY)"
    REASON="Quality score below threshold"
    DETAILS="${QUALITY_SCORE} < ${QUALITY_THRESHOLD}"
    NEXT="Improve code quality and rerun pipeline"
    ;;
  READY_ONLY)
    STATUS="✅ READY"
    REASON="Smoke test passed"
    DETAILS="Draft PR marked as Ready"
    NEXT="Manual review or enable full pipeline"
    ;;
  READY_NO_MERGE)
    STATUS="✅ READY (NO AUTO MERGE)"
    REASON="All checks passed"
    DETAILS="Auto merge disabled by flag"
    NEXT="Merge manually when ready"
    ;;
  READY_AND_MERGE)
    STATUS="🚀 READY + AUTO MERGE"
    REASON="All checks passed"
    DETAILS="PR will be merged automatically"
    NEXT="No action required"
    ;;
  *)
    STATUS="⚠️ UNKNOWN"
    REASON="Unknown decision state"
    DETAILS="$DECISION"
    NEXT="Check decision.yml"
    ;;
esac

cat <<EOF > decision_comment.md
🧠 **Decision Result**

**Status:** $STATUS  
**Reason:** $REASON  
**Details:** $DETAILS  

🔧 **Next Action**
- $NEXT
EOF
