# github.py
import requests
import os

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO = "lmboftheone-jpg/dreamweaver_aistudio2"

HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}

def add_label(issue_number, label):
    url = f"https://api.github.com/repos/{REPO}/issues/{issue_number}/labels"
    requests.post(url, headers=HEADERS, json={"labels": [label]})

def dispatch_retry(pr_number):
    url = f"https://api.github.com/repos/{REPO}/actions/workflows/retry-from-issue.yml/dispatches"
    requests.post(url, headers=HEADERS, json={
        "ref": "main",
        "inputs": {
            "pr_number": pr_number,
            "retry": "true"
        }
    })
