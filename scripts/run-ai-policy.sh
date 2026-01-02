#!/usr/bin/env bash
set -e

PROMPT_NAME=$1
INPUT_JSON="ai/input/runtime.json"
OUTPUT_JSON="ai/output/${PROMPT_NAME}.json"

mkdir -p ai/output

if [ ! -f "ai/system.txt" ]; then
  echo "❌ ai/system.txt not found!"
  ls -R ai/
  exit 1
fi

SYSTEM_PROMPT=$(cat ai/system.txt)
TASK_PROMPT=$(cat ai/${PROMPT_NAME}.txt)

if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️ OPENAI_API_KEY is missing. Using mock response."
  cat <<EOF > response.json
{
  "choices": [
    {
      "message": {
        "content": "{\"mock\": true, \"reason\": \"No API Key\"}"
      }
    }
  ]
}
EOF
else
  curl https://api.openai.com/v1/chat/completions \
    -s \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d @- <<EOF > response.json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    { "role": "system", "content": "$SYSTEM_PROMPT" },
    { "role": "user", "content": "$TASK_PROMPT\n\nInput:\n$(cat $INPUT_JSON)" }
  ],
  "temperature": 0.1
}
EOF
fi

if ! jq -e '.choices[0].message.content' response.json > /dev/null; then
  echo "❌ Invalid API Response:"
  cat response.json
  exit 1
fi

jq -r '.choices[0].message.content' response.json > "$OUTPUT_JSON"
