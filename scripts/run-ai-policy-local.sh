#!/usr/bin/env bash
set -e

PROMPT_NAME=$1
INPUT_JSON="ai/input/runtime.json"
OUTPUT_JSON="ai/output/${PROMPT_NAME}.json"

SYSTEM_PROMPT=$(cat ai/system.txt)
TASK_PROMPT=$(cat ai/${PROMPT_NAME}.txt)

RESPONSE=$(curl -s http://localhost:11434/api/generate \
  -d "{
    \"model\": \"qwen2.5:7b\",
    \"prompt\": \"$SYSTEM_PROMPT\n\n$TASK_PROMPT\n\nInput:\n$(cat $INPUT_JSON)\",
    \"stream\": false
  }")

echo "$RESPONSE" | jq -r '.response' | jq '.' > "$OUTPUT_JSON"
