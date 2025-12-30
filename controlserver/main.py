control-serve# main.py
from fastapi import FastAPI, Request
from slack import handle_slack_action
from github import add_label, dispatch_retry

app = FastAPI()

@app.post("/slack/actions")
async def slack_actions(request: Request):
    action, pr, payload = await handle_slack_action(request)

    if action == "retry-ci":
        add_label(pr, "retry-ci")
        dispatch_retry(pr)

    elif action == "assign-human":
        add_label(pr, "human-review")

    elif action == "human-approved":
        add_label(pr, "human-approved")
        dispatch_retry(pr)

    return {
        "text": f"✅ Action `{action}` executed for PR #{pr}"
    }
