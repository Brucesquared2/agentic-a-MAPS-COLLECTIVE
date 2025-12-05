.PHONY: merge-risk onboard onboard-pr new-manifest

merge-risk:
	python scripts/merge_risk.py

onboard:
	python scripts/cli.py onboard $(indicator)

onboard-pr:
	python scripts/cli.py onboard $(indicator) --pr

new-manifest:
	python scripts/new_manifest.py $(indicator)

.PHONY: connectivity-check

connectivity-check:
	@echo "🔍 Running connectivity probe..."
	@scripts/connectivity_probe.sh
