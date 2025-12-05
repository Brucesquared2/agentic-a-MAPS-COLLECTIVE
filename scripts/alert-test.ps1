# PowerShell test script for Alertmanager -> Discord bridge
param(
  [string]$BaseUrl = 'http://localhost:8080'
)

Write-Host "Sending firing (warning) alert to $BaseUrl/alert"

$firing = @'
{
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
}
'@

Invoke-RestMethod -Uri "$BaseUrl/alert" -Method Post -ContentType 'application/json' -Body $firing

Write-Host "\nSending resolved alert"

$resolved = @'
{
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
}
'@

Invoke-RestMethod -Uri "$BaseUrl/alert" -Method Post -ContentType 'application/json' -Body $resolved

Write-Host "\nDone. Check your Discord channel for embeds."
