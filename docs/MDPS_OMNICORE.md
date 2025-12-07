# MDPS-OmniCore Agent

## Overview

**MDPS-OmniCore** is a specialized orchestration agent designed for Multi-Domain Processing System (MDPS) workflows within the Agentic platform. It serves as the central coordinator for complex, multi-agent tasks that require brain file management, cross-domain processing, and lineage tracking.

## Role & Responsibilities

### Primary Functions

1. **Brain File Management**
   - Scan and index files in `MDPS/brain/` and related directories
   - Stage files into `Sunshine_Digital/archive/` for runtime use
   - Maintain brain file versioning and lineage
   - Coordinate brain file access across multiple agents

2. **Cross-Agent Coordination**
   - Distribute tasks across specialized agents (Claude Capsule, Copilot Companion, etc.)
   - Manage agent communication and handoffs
   - Aggregate results from multiple agents
   - Handle agent failure recovery and retry logic

3. **Processing Lineage**
   - Log all operations into `Sunshine_Digital/key_log.yml`
   - Maintain audit trail with timestamps and file references
   - Ensure narratable lineage: "📥 import: brain file X fossilized"
   - Track processing dependencies and data flow

4. **Multi-Domain Processing**
   - Coordinate transformations across different data domains
   - Normalize headers and metadata across archives
   - Apply consistent naming conventions
   - Handle domain-specific validation and quality checks

## Architecture

```yaml
mdps_omnicore:
  role: orchestrator
  type: persistent
  invocation: [API, CLI, container_pipeline]
  dependencies:
    - Claude Capsule (planning & batch transforms)
    - Copilot Companion (code execution & scaffolding)
    - Ollama Local (local model inference)
    - File system (MDPS/brain/, Sunshine_Digital/)
  outputs:
    - key_log.yml (operation ledger)
    - processed brain files
    - coordination reports
```

## Directory Structure

MDPS-OmniCore expects the following directory structure:

```
MDPS/
├── brain/                    # Source brain files
│   ├── domain_a/            # Domain-specific brain files
│   ├── domain_b/
│   └── shared/              # Cross-domain resources
├── config/                   # MDPS configuration files
│   ├── agent_routes.yml     # Agent routing configuration
│   └── processing_rules.yml # Processing rules per domain
└── temp/                     # Temporary processing workspace

Sunshine_Digital/
├── archive/                  # Staged brain files for runtime
├── key_log.yml              # Operation ledger
└── reports/                 # Processing reports and metrics
```

## Usage

### Invoking MDPS-OmniCore

**Via API:**
```bash
curl -X POST http://localhost:8080/api/mdps/orchestrate \
  -H "Content-Type: application/json" \
  -d '{
    "task": "pull_brain_files",
    "domains": ["domain_a", "domain_b"],
    "options": {
      "validate": true,
      "archive": true
    }
  }'
```

**Via CLI:**
```bash
# Pull and process brain files
npm run mdps:orchestrate -- --task=pull_brain_files --domains=domain_a,domain_b

# Run batch transformations
npm run mdps:orchestrate -- --task=batch_transform --input=MDPS/brain/domain_a
```

**Via Docker Compose:**
```bash
docker compose up mdps_omnicore
```

### Common Tasks

#### 1. Pull Brain Files
```yaml
task: pull_brain_files
description: Scan and stage brain files from MDPS/brain/
steps:
  - Scan MDPS/brain/ directories
  - Validate file integrity
  - Stage files to Sunshine_Digital/archive/
  - Log to key_log.yml
```

#### 2. Batch Transformations
```yaml
task: batch_transform
description: Normalize and transform brain files
steps:
  - Load processing rules
  - Apply transformations per domain
  - Validate outputs
  - Update lineage in key_log.yml
```

#### 3. Cross-Agent Coordination
```yaml
task: coordinate_agents
description: Distribute work across multiple agents
steps:
  - Parse task requirements
  - Route to appropriate agents
  - Collect and aggregate results
  - Update coordination report
```

## Integration with Other Agents

### With Claude Capsule
- **Use case**: Planning and high-level batch transformations
- **Handoff**: MDPS-OmniCore invokes Claude Capsule for complex planning tasks
- **Return**: Claude provides transformation plans; MDPS-OmniCore executes

### With Copilot Companion
- **Use case**: Code scaffolding and inline edits during brain file processing
- **Handoff**: MDPS-OmniCore delegates code generation tasks
- **Return**: Copilot provides code; MDPS-OmniCore integrates into workflow

### With Ollama Local
- **Use case**: Local model inference for brain file analysis
- **Handoff**: MDPS-OmniCore sends brain files for analysis
- **Return**: Ollama provides insights; MDPS-OmniCore incorporates findings

## Configuration

MDPS-OmniCore can be configured via `MDPS/config/mdps_omnicore.yml`:

```yaml
mdps_omnicore:
  # Brain file management
  brain_sources:
    - path: MDPS/brain/
      scan_interval: 5m
      auto_stage: true
  
  # Agent coordination
  agent_routes:
    planning: claude_capsule
    code_gen: copilot_companion
    analysis: ollama_local
  
  # Logging and lineage
  ledger:
    path: Sunshine_Digital/key_log.yml
    rotation: monthly
    retention: 12m
  
  # Processing rules
  domains:
    - name: domain_a
      rules: MDPS/config/processing_rules.yml
      priority: high
    - name: domain_b
      rules: MDPS/config/processing_rules.yml
      priority: medium
```

## Monitoring & Observability

### Key Metrics
- Brain files processed per hour
- Agent coordination latency
- Ledger write operations
- Processing error rate
- Domain-specific throughput

### Dashboards
Access MDPS-OmniCore dashboards at:
- Grafana: `http://localhost:3001/d/mdps-omnicore`
- Prometheus metrics: `http://localhost:9090/metrics/mdps`

### Alerts
MDPS-OmniCore generates alerts for:
- Brain file corruption
- Agent coordination failures
- Ledger rotation issues
- Domain processing bottlenecks

## Troubleshooting

### Common Issues

**Issue: Brain files not being staged**
- Check MDPS/brain/ directory permissions
- Verify Sunshine_Digital/archive/ exists and is writable
- Review key_log.yml for error entries

**Issue: Agent coordination failures**
- Verify agent availability (check docker compose ps)
- Review agent_routes.yml configuration
- Check network connectivity between services

**Issue: Ledger rotation problems**
- Verify LEDGER_PATH environment variable
- Check disk space in Sunshine_Digital/
- Review ledger-rotation.yml GitHub workflow logs

## Development

To extend MDPS-OmniCore functionality:

1. Add new task types in `MDPS/config/processing_rules.yml`
2. Implement task handlers in the orchestration layer
3. Update agent routing in `MDPS/config/agent_routes.yml`
4. Add tests for new functionality
5. Update key_log.yml schema if needed

## References

- [CLAUDE_TASKS.md](./CLAUDE_TASKS.md) - Capsule task manifest
- [AGENTS.yml](../AGENTS.yml) - Agent configuration
- [cockpit-chat-split.md](./cockpit-chat-split.md) - UI orchestration
- [cockpit-ritual.md](./cockpit-ritual.md) - Ritual patterns

## Support

For MDPS-OmniCore issues:
1. Check the troubleshooting section above
2. Review logs in `Sunshine_Digital/key_log.yml`
3. Open an issue with the `mdps-omnicore` label
4. Include relevant log entries and configuration files
