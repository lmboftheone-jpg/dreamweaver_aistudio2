# slack.py
from fastapi import Request
from urllib.parse import parse_qs
import json

async def handle_slack_action(request: Request):
    body = await request.body()
    payload = json.loads(parse_qs(body.decode())["payload"][0])

    action_value = payload["actions"][0]["value"]
    action, pr = action_value.split("|")

    return action, pr, payload
