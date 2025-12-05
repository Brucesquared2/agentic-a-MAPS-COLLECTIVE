# SHELL_GANG_HANDOFF

handoff:
  - agent: Claude Capsule
    mode: shell
    role: Analysis & strategy
    invocation: ./scripts/claude_runner.ts
    comms: VS Code terminal -> publish endpoint
  - agent: DeepSeek (Ollama)
    mode: local container
    role: Market insights
    invocation: ollama run deepseek
    comms: publish endpoint -> orchestrator
  - agent: Qwen
    mode: local container
    role: Content validation
    invocation: ollama run qwen
    comms: publish endpoint -> orchestrator
  - agent: Copilot
    mode: companion
    role: Manifest updates, lineage fossilization
    invocation: cockpit UI
    comms: publish endpoint -> SSE bus

## Coordination Flow

- Trading -> Integration API Metrics extracted, content generated.
- Integration -> Orchestrator Hub Tasks distributed to agents.
- Shell Gang Execution
  - Claude: analysis & strategy.
  - DeepSeek: market insights.
  - Qwen: validate content.
  - Copilot: update manifests.

## VS Code Communication

- Claude runner (claude_runner.ts) posts events with x-publish-token.
- VS Code extension listens for SSE updates, shows “Work completed” notifications.
- Contributors can trigger workloads via VS Code tasks -> orchestrator.

## Ledger Fossilization

All events are appended to `logs/key_log.yml` for permanent lineage.

## Dashboards

Prometheus metrics + Discord feed show progress.
