# Scripts Directory

This directory contains Python utility scripts for managing manifests, risk policies, and platform operations.

## Available Scripts

### validate_manifest.py

Validates YAML manifests for signal routing, agents, and dashboard configuration.

**Usage:**
```bash
python scripts/validate_manifest.py
```

**What it validates:**
- `signal_routing.yml`: Routes, devices, triggers, and destinations
- `AGENTS.yml`: Agent definitions with strengths, weaknesses, and notes
- `dashboard.yml`: Dashboard panels and their references

**Exit codes:**
- 0: All manifests valid
- 1: Validation errors found

### merge_risk.py

Merges risk policies from indicator manifests into a consolidated `ta_service/config/risk.yml` file.

**Usage:**
```bash
python scripts/merge_risk.py
```

**What it does:**
- Extracts risk policies from `signal_routing.yml` routes
- Converts agent weaknesses from `AGENTS.yml` into risk policies
- Assesses risk levels (high, medium, low) based on route types
- Generates mitigation strategies
- Writes consolidated risk policies to `ta_service/config/risk.yml`

### cli.py

Command-line interface for platform management tasks.

**Usage:**
```bash
# Onboard a new indicator
python scripts/cli.py onboard <indicator-name>

# Onboard with PR creation (not yet implemented)
python scripts/cli.py onboard <indicator-name> --pr

# List onboarded indicators
python scripts/cli.py list
```

**What it does:**
- Creates indicator directory structure
- Generates initial configuration files
- Updates signal routing with new routes
- Provides onboarding workflow automation

### new_manifest.py

Generates new manifest files with proper structure and templates.

**Usage:**
```bash
# Create an indicator manifest
python scripts/new_manifest.py my-indicator

# Create a specific type of manifest
python scripts/new_manifest.py --type agent my-agent
python scripts/new_manifest.py --type route my-route
python scripts/new_manifest.py --type device my-device

# Create a full suite of manifests
python scripts/new_manifest.py --full-suite my-indicator

# Specify custom output directory
python scripts/new_manifest.py --output-dir ./custom/path my-indicator
```

**Manifest types:**
- `indicator`: Full indicator configuration with metadata and risk profile
- `agent`: Agent definition with strengths and weaknesses
- `route`: Signal routing configuration
- `device`: Device specification with connection details

## Makefile Integration

These scripts are integrated with the Makefile:

```bash
# Validate all manifests
make validate

# Merge risk policies
make merge-risk

# Onboard new indicator
make onboard indicator=my-indicator

# Onboard with PR
make onboard-pr indicator=my-indicator

# Create new manifest
make new-manifest indicator=my-indicator
```

## CI/CD Integration

### GitHub Actions

The scripts are used in the following workflows:

1. **risk-merge-combined.yml**: Validates manifests and merges risk policies on push
2. **pre-commit hooks**: Validates manifests before commits

### Pre-commit Hooks

Install pre-commit hooks to run validation automatically:

```bash
pip install pre-commit
pre-commit install
```

## Dependencies

Required Python packages:
- `pyyaml` - YAML parsing
- `pytest` - Unit testing (for development)

Install dependencies:
```bash
pip install pyyaml pytest
```

## Testing

Unit tests are located in the `tests/` directory.

Run tests:
```bash
pytest tests/test_validate_manifest.py -v
```

## Development

All scripts follow these conventions:
- Python 3.11+ compatible
- Type hints for main functions
- Docstrings for classes and methods
- Error handling with descriptive messages
- Exit codes: 0 for success, 1 for errors

## Examples

### Validate manifests before committing
```bash
python scripts/validate_manifest.py
```

### Generate and merge risk policies
```bash
python scripts/merge_risk.py
git add ta_service/config/risk.yml
git commit -m "chore: update risk policies"
```

### Create and onboard a new indicator
```bash
# Generate manifests
python scripts/new_manifest.py --full-suite my-indicator

# Onboard the indicator
python scripts/cli.py onboard my-indicator

# Validate everything
make validate

# Commit changes
git add .
git commit -m "feat: add my-indicator"
```

## Troubleshooting

### ModuleNotFoundError: No module named 'yaml'
Install PyYAML:
```bash
pip install pyyaml
```

### pytest: command not found
Install pytest:
```bash
pip install pytest
```

### Permission denied
Make scripts executable:
```bash
chmod +x scripts/*.py
```

## Contributing

When adding new scripts:
1. Follow the existing patterns and conventions
2. Add comprehensive docstrings
3. Include error handling
4. Write unit tests in `tests/`
5. Update this README
6. Update the Makefile if adding new commands
