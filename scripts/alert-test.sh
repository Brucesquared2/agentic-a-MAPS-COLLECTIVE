#!/usr/bin/env bash
# Simple curl tests for Alertmanager -> Discord bridge
set -euo pipefail

BASE_URL=${BASE_URL:-http://localhost:8080}

echo "Sending firing (warning) alert..."
curl -s -X POST "$BASE_URL/alert" \
  -H "Content-Type: application/json" \
  -d '{
    "alerts": [
      {
        "status": "firing",
        "labels": {
          "alertname": "CompletedTasksDrift",
          "severity": "warning"
        },
        "annotations": {
          "summary": "Drift detected in completed tasks",
          "description": "Live completed_tasks differs from ledger replay by more than 10."
        },
        "startsAt": "2025-12-05T19:28:00Z",
        "generatorURL": "http://prometheus:9090/graph?g0.expr=abs(cockpit_completed_tasks-cockpit_completed_tasks_ledger)%20%3E%2010"
      }
    ]
  }'

echo "\nSending resolved alert..."
curl -s -X POST "$BASE_URL/alert" \
  -H "Content-Type: application/json" \
  -d '{
    "alerts": [
      {
        "status": "resolved",
        "labels": {
          "alertname": "CompletedTasksDrift",
          "severity": "warning"
        },
        "annotations": {
          "summary": "Drift resolved in completed tasks",
          "description": "Live completed_tasks now matches ledger replay within acceptable bounds."
        },
        "startsAt": "2025-12-05T19:28:00Z",
        "endsAt": "2025-12-05T19:35:00Z"
      }
    ]
  }'

echo "\nDone. Check your Discord channel for embeds."
