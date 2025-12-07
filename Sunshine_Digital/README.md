# Sunshine Digital

This directory serves as the runtime workspace for MDPS-OmniCore operations.

## Structure

- `archive/` - Staged brain files ready for runtime use
- `reports/` - Processing reports and metrics
- `key_log.yml` - Operation ledger (append-only)

## Key Log

The `key_log.yml` file is the central ledger for all MDPS-OmniCore operations. It tracks:
- Brain file imports
- Transformations applied
- Agent coordination events
- Processing lineage
- Error conditions

### Log Format

```yaml
entries:
  - timestamp: "2025-12-07T13:00:00Z"
    event: brain_file_import
    agent: mdps_omnicore
    source: MDPS/brain/domain_a/example.yml
    destination: Sunshine_Digital/archive/domain_a/example.yml
    checksum: sha256:abc123...
    status: success
    narrative: "📥 import: example.yml fossilized"
```

## Rotation

The key log is rotated monthly via GitHub Actions workflow. Old logs are archived with timestamps and retained for 12 months.

## See Also

- [MDPS-OmniCore Documentation](../docs/MDPS_OMNICORE.md)
- [Ledger Rotation Workflow](../.github/workflows/ledger-rotation.yml)
