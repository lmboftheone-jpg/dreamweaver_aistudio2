import json
import sys

gt = json.load(open("ai/eval/ground_truth.json"))
pred = json.load(open(sys.argv[1]))

score = 0
total = 0
errors = []

for case in gt:
    expected = case["expected"]

    for key, value in expected.items():
        total += 1
        if key in pred and pred[key] == value:
            score += 1
        else:
            errors.append({
                "key": key,
                "expected": value,
                "actual": pred.get(key)
            })

accuracy = score / total if total else 0

result = {
    "accuracy": round(accuracy, 2),
    "passed": accuracy >= 0.8,
    "errors": errors
}

print(json.dumps(result, indent=2))

if not result["passed"]:
    sys.exit(1)
