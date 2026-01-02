#!/usr/bin/env bash
set -e

PROMPT_NAME=$1
INPUT_JSON="ai/input/runtime.json"
OUTPUT_JSON="ai/output/${PROMPT_NAME}.json"

mkdir -p ai/output

SYSTEM_PROMPT=$(cat ai/system.txt)
TASK_PROMPT=$(cat ai/${PROMPT_NAME}.txt)

curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- <<EOF > response.json
{
  "model": "gpt-5.2",
  "messages": [
    { "role": "system", "content": "$SYSTEM_PROMPT" },
    { "role": "user", "content": "$TASK_PROMPT\n\nInput:\n$(cat $INPUT_JSON)" }
  ],
  "temperature": 0.1
}
EOF

jq '.choices[0].message.content | fromjson' response.json > "$OUTPUT_JSON"
