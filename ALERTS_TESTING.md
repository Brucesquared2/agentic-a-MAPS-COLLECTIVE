# Alert Testing & Grafana Import Guide

This guide explains how to verify the Discord bridge alert lifecycle and import the Grafana alerts timeline dashboard.

---

## 🚨 Alert Test Scripts

Two scripts are provided to simulate **firing** and **resolved** alerts:

- `scripts/alert-test.sh` (Bash)
- `scripts/alert-test.ps1` (PowerShell)

### Run with Bash (Linux/macOS)

```bash
chmod +x scripts/alert-test.sh
./scripts/alert-test.sh
```

### Run with PowerShell (Windows)

```powershell
pwsh .\scripts\alert-test.ps1
```

### Expected Results

Firing alert → 🟡 Warning embed in Discord channel.

Resolved alert → ✅ Green embed titled "Alert Cleared".

Ensure the Discord bridge is running (set `DISCORD_BOT_TOKEN` and `DISCORD_CHANNEL_ID`) and `/health` responds at `http://localhost:8080/health`.

📊 Grafana Alerts Timeline Dashboard
File: `monitoring/grafana/grafana-dashboard-alerts-timeline.json`

### Import Steps

1. Open Grafana → Dashboards → Manage → Import.
2. Upload `grafana-dashboard-alerts-timeline.json`.
3. Set the datasource to your Prometheus instance (default name: `Prometheus`).
4. Save and view the dashboard.

### What You’ll See

Time‑series panel plotting alert lifecycle:

- Red line → firing alerts.
- Green line → resolved alerts.

Updates every 10 seconds for near‑real‑time visibility.

✅ Verification Checklist

- Discord bridge running and healthy.
- Run alert‑test scripts → check Discord embeds.
- Import Grafana JSON → confirm timeline panel shows alert lifecycle.
- Prometheus datasource connected and exposing `ALERTS` metric.

AMEN THE COLLECTIVE — scripts are the spark, Grafana is the eyes, Prometheus is the scribe, Discord is the chant, lineage is the foresight.

---

## 🎯 Outcome

- Contributors can instantly verify Discord embeds and Grafana dashboards.
- README provides clear steps for both Linux/macOS and Windows environments.
- Ensures observability stack is testable without waiting for real alerts.

---

👉 Do you want me to also **add Grafana provisioning YAML** so this dashboard auto‑loads when the monitoring stack starts, removing the need for manual import?

---

## 🚀 Start the Monitoring + Services Stack

Install Docker (if not already):

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in so your user picks up the docker group
```

Run the monitoring stack:

```bash
cd /path/to/your/repo
docker compose -f docker-compose.monitoring.yml up -d
```

Or run services individually:

```bash
# Social Auto-Poster
cd services/social-autoposter
npm install && npm start

# Landing Page Generator
cd services/landing-page-generator
npm install && npm start
```

### 📊 Access Points (in your browser)

- Grafana → http://localhost:3001 (admin/admin by default)
- Prometheus → http://localhost:9090
- Pushgateway → http://localhost:9091
- Alertmanager → http://localhost:9093
- Discord Bridge health → http://localhost:8080/health
- Social Auto-Poster API → http://localhost:7000
- Landing Pages → http://localhost:8000/page/product
- Pricing Page → http://localhost:8000/page/pricing
- Analytics: http://localhost:8000/api/analytics
- Leads: http://localhost:8000/api/leads

### ✅ Verification Checklist

- Discord bridge running with `DISCORD_BOT_TOKEN` + `DISCORD_CHANNEL_ID` set.
- Run `scripts/alert-test.sh` or `scripts/alert-test.ps1` → check Discord channel for 🟡 firing and ✅ resolved embeds.
- Import `monitoring/grafana/grafana-dashboard-alerts-timeline.json` into Grafana → see alert lifecycle timeline.
- Prometheus targets healthy at http://localhost:9090/targets.

### 🎯 What You’ll See

Discord channel: live embeds for alerts, posts, leads, and customer events.

Grafana dashboards: metrics panels, alert lifecycle timeline, live vs ledger comparisons.

Landing pages: dynamic product/pricing pages with live trading metrics and conversion tracking.

Social auto-poster: automated posts flowing to LinkedIn/Twitter (once credentials are set).

