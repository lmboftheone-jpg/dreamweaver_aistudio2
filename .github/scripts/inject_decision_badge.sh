#!/usr/bin/env bash
set -e

DECISION="$1"
DASHBOARD_FILE="$2"

ICON=""
TEXT=""
COLOR=""

case "$DECISION" in
  READY_AND_MERGE)
    ICON="🚀"
    TEXT="READY + AUTO MERGE"
    COLOR="#2ecc71"
    ;;
  READY_NO_MERGE)
    ICON="✅"
    TEXT="READY (NO AUTO MERGE)"
    COLOR="#3498db"
    ;;
  READY_ONLY)
    ICON="🧪"
    TEXT="READY (SMOKE ONLY)"
    COLOR="#9b59b6"
    ;;
  BLOCK_*)
    ICON="🚫"
    TEXT="BLOCKED"
    COLOR="#e74c3c"
    ;;
  *)
    ICON="⚠️"
    TEXT="UNKNOWN"
    COLOR="#95a5a6"
    ;;
esac

BADGE_HTML=$(cat <<EOF
<div id="decision-badge" style="
  display:flex;
  align-items:center;
  gap:10px;
  padding:12px 16px;
  margin-bottom:16px;
  border-radius:10px;
  font-family:Arial, sans-serif;
  font-size:16px;
  font-weight:bold;
  color:white;
  background:${COLOR};
">
  <span style="font-size:20px;">${ICON}</span>
  <span>Decision: ${TEXT}</span>
</div>
EOF
)

# <body> 바로 아래에 삽입
perl -0777 -i -pe "s|<body[^>]*>|$&\n$BADGE_HTML|s" "$DASHBOARD_FILE"
