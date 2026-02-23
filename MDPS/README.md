# MDPS (Multi-Domain Processing System)

This directory contains the MDPS-OmniCore orchestration system for managing brain files and coordinating multi-agent workflows.

## Quick Start

### 1. Understanding MDPS-OmniCore

MDPS-OmniCore is an orchestration agent that:
- Manages brain files across multiple domains
- Coordinates tasks between specialized agents
- Maintains processing lineage and audit trails
- Applies transformations and validations

See [docs/MDPS_OMNICORE.md](../docs/MDPS_OMNICORE.md) for complete documentation.

### 2. Directory Structure

```
MDPS/
├── brain/                    # Source brain files
│   ├── domain_a/            # Core brain files
│   ├── domain_b/            # Auxiliary brain files
│   └── shared/              # Cross-domain resources
├── config/                   # Configuration files
│   ├── mdps_omnicore.yml   # Main MDPS-OmniCore config
│   ├── agent_routes.yml    # Agent routing rules
│   └── processing_rules.yml # Transformation & validation rules
└── temp/                     # Temporary processing workspace

Sunshine_Digital/
├── archive/                  # Staged brain files (runtime)
├── reports/                 # Processing reports
└── key_log.yml             # Operation ledger (audit trail)
```

### 3. Adding Brain Files

1. Choose the appropriate domain:
   - `domain_a/` for core, high-priority files (strict validation)
   - `domain_b/` for auxiliary files (relaxed validation)
   - `shared/` for cross-domain resources

2. Create a brain file following the domain requirements:

```yaml
# Example: MDPS/brain/domain_a/my_brain.yml
version: "1.0"
author: "your_name"
date: "2025-12-07"
id: "brain_unique_id"
timestamp: "2025-12-07T13:00:00Z"
source: "manual_upload"
content: |
  Your brain file content here
```

3. MDPS-OmniCore will automatically:
   - Scan and validate the file
   - Apply transformations
   - Stage to `Sunshine_Digital/archive/`
   - Log to `Sunshine_Digital/key_log.yml`

### 4. Configuration

Edit configuration files in `MDPS/config/`:

**mdps_omnicore.yml** - Main system configuration
- Brain file scanning intervals
- Agent routing preferences
- Ledger settings
- Domain priorities

**agent_routes.yml** - Task-to-agent mapping
- Define which agent handles which task type
- Configure timeouts and fallbacks
- Set health check intervals

**processing_rules.yml** - Validation and transformation rules
- Domain-specific validation requirements
- Transformation steps
- Quality gates and metrics
- Archival policies

### 5. Monitoring

Check processing status:

```bash
# View operation ledger
cat Sunshine_Digital/key_log.yml

# Check archived files
ls -la Sunshine_Digital/archive/

# View processing reports
ls -la Sunshine_Digital/reports/
```

For metrics and dashboards:
- Grafana: `http://localhost:3001/d/mdps-omnicore`
- Prometheus: `http://localhost:9090/metrics/mdps`

### 6. Common Operations

**Manual brain file pull:**
```bash
# Trigger MDPS-OmniCore to scan and process brain files
npm run mdps:orchestrate -- --task=pull_brain_files --domains=domain_a
```

**Batch transformations:**
```bash
# Apply transformations to existing brain files
npm run mdps:orchestrate -- --task=batch_transform --domain=domain_a
```

**Agent coordination test:**
```bash
# Test multi-agent coordination
npm run mdps:orchestrate -- --task=coordinate_agents --agents=claude,copilot
```

### 7. Integration with Other Agents

MDPS-OmniCore coordinates with:

- **Claude Capsule** - Planning, batch transforms, high-level tasks
- **Copilot Companion** - Code generation, scaffolding
- **Ollama Local** - Local model inference
- **Qwen 2.5 b7** - File operations
- **DeepSeek** - Indexing and search

Task routing is automatic based on `config/agent_routes.yml`.

### 8. Troubleshooting

**Brain files not being processed?**
- Check file format matches domain requirements
- Verify MDPS/brain/ permissions
- Review Sunshine_Digital/key_log.yml for errors

**Agent coordination issues?**
- Verify agents are running: `docker compose ps`
- Check agent routes: `config/agent_routes.yml`
- Review network connectivity

**Ledger not updating?**
- Check LEDGER_PATH environment variable
- Verify write permissions on Sunshine_Digital/
- Review ledger rotation workflow

## Examples

See `brain/domain_a/example_brain.yml` for a complete example brain file.

## References

- [Complete MDPS-OmniCore Documentation](../docs/MDPS_OMNICORE.md)
- [Agent Configuration](../AGENTS.yml)
- [Claude Tasks](../docs/CLAUDE_TASKS.md)
- [Cockpit Orchestration](../docs/cockpit-chat-split.md)

## Support

For MDPS-OmniCore issues:
1. Check this README and documentation
2. Review `Sunshine_Digital/key_log.yml` for errors
3. Open an issue with `mdps-omnicore` label
4. Include config files and relevant log entries
