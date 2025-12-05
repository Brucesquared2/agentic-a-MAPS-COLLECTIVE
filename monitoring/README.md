# Monitoring

This folder contains Grafana dashboards and Prometheus alert rules for the Cockpit.

Files:
- `grafana/cockpit-dashboard.json` — Grafana dashboard to visualize `cockpit_active_assignments`, `cockpit_completed_tasks`, and `cockpit_rotations`.
- `grafana/alert_rules_high_active.json` — Alert rule: triggers when active assignments &gt; 8 for 5 minutes.
- `grafana/alert_rules_no_completions.json` — Alert rule: triggers when no completed tasks in the last 24h.

Quick import

1. Import the dashboard into Grafana: on the Grafana UI go to "Dashboards → Import" and upload `grafana/cockpit-dashboard.json`. Set the Prometheus datasource (default name in the JSON is `Prometheus`).

2. Alert rules: If you use Grafana's new unified alerting, create a new Alert RuleGroup and paste the JSON rules or configure them in your alerting stack (Prometheus `rules` files or Grafana Alerting).

Prometheus / Pushgateway

- The repository exposes `/api/metrics` in the Cockpit app. Point Prometheus to scrape `http://<host>:3000/api/metrics`.
- For durable ingestion across multiple instances, consider adding a Pushgateway and updating `monitoring/` with a `docker-compose` snippet.

Notes

- `metrics.json` is written by the app and ignored in `.gitignore`.
- If you want metrics rotated daily for forensic lineage, we can add a simple rotation script that copies `metrics.json` → `metrics-YYYY-MM-DD.json` on midnight or after rotation events.
