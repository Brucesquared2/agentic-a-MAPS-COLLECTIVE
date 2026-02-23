# MDPS Brain Files

This directory contains brain files organized by domain for the MDPS-OmniCore orchestration system.

## Structure

- `domain_a/` - Primary domain for core brain files
- `domain_b/` - Secondary domain for auxiliary brain files  
- `shared/` - Cross-domain shared resources

## Usage

Brain files placed in these directories will be automatically:
1. Scanned by MDPS-OmniCore at configured intervals
2. Validated according to processing rules
3. Transformed and normalized
4. Staged to `Sunshine_Digital/archive/` for runtime use
5. Logged to `Sunshine_Digital/key_log.yml` for lineage tracking

## File Requirements

### Domain A Files
- Must include: id, timestamp, source, content
- Supported formats: text/plain, application/json, text/yaml
- Strict schema validation

### Domain B Files
- Must include: id, content
- Supported formats: text/plain, application/json
- Relaxed validation

### Shared Files
- Must include: id, type, content, shared_with, purpose
- Supported formats: text/plain, application/json, text/yaml, text/markdown
- Cross-domain availability
- Strict validation

## Adding Brain Files

1. Place files in the appropriate domain directory
2. Ensure files meet validation requirements (see `MDPS/config/processing_rules.yml`)
3. MDPS-OmniCore will automatically process them on next scan
4. Check `Sunshine_Digital/key_log.yml` for processing status

## Example Brain File

```yaml
# Example: domain_a/example_brain.yml
version: 1.0
author: mdps_system
date: 2025-12-07
id: brain_001
timestamp: 2025-12-07T13:00:00Z
source: manual_upload
content: |
  This is an example brain file for domain_a.
  It contains processing instructions and metadata.
```

## See Also

- [MDPS-OmniCore Documentation](../../docs/MDPS_OMNICORE.md)
- [Processing Rules](../config/processing_rules.yml)
- [Agent Routes](../config/agent_routes.yml)
