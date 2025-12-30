#!/usr/bin/env bash
set -e

PERIOD="$1"
STATS_FILE="$2"
OUT="escalation-dashboard-${PERIOD}.html"

TOTAL=$(jq '.total' "$STATS_FILE")

ROWS=$(jq -r '.by_reason[] | "<tr><td>\(.reason)</td><td>\(.count)</td></tr>"' "$STATS_FILE")

cat <<EOF > "$OUT"
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Escalation Dashboard (${PERIOD})</title>
  <style>
    body { font-family: Arial; padding: 24px; }
    h1 { margin-bottom: 8px; }
    .summary { font-size: 18px; margin-bottom: 20px; }
    table { border-collapse: collapse; width: 420px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
  </style>
</head>
<body>
  <h1>🚨 Escalation Dashboard (${PERIOD})</h1>
  <div class="summary">Total Escalations: <b>${TOTAL}</b></div>
  <table>
    <tr><th>Reason</th><th>Count</th></tr>
    ${ROWS}
  </table>
</body>
</html>
EOF
