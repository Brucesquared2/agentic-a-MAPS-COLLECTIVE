# Cockpit Chat Split

Defines capsule vs companion windows for MDPS orchestration and suggested integration notes.

```yaml
chat_layout:
  left_panel:
    role: capsule_window
    agents:
      - Claude
      - Ollama
      - Demucs
      - [other capsules you click to summon]
    invocation: [CLI, API, container_pipeline]
    behavior: ephemeral
    idle_timeout: 5m
    ui: chat_window_bound_to_pipeline
    notes: >
      Capsules rise when summoned by name or click.
      Vanish after idle timeout or deselection.

  right_panel:
    role: navigator_window
    agent: Copilot
    invocation: [Web, Edge_sidebar, Copilot_app]
    behavior: persistent
    ui: fixed_half_page_panel
    notes: >
      Always present. Orchestrates lineage, scaffolds rituals,
      keeps continuity across cockpit.
```

**Purpose**
- Capture a minimal, shareable layout specification for cockpit UI orchestration.

**Suggested placement**
- Keep this file as `docs/cockpit-chat-split.md` for documentation and design reference.
- Optionally add a JSON/YAML version alongside the UI code (e.g., `web/configs/cockpit-chat-split.yaml`) for runtime consumption.

**Integration notes**
- Left panel (capsule_window): ephemeral micro-agents that are summoned on demand. Implement lifecycle hooks: `onSummon`, `onIdleTimeout`, `onDismiss`.
- Right panel (navigator_window): persistent agent that manages state, routing, and lineage. Should expose an API for capsules to register/unregister and to forward events.
- Idle timeout: implement via UI timers with visual countdown and cancel actions.
- Invocation channels: map listed invocation types to concrete adapters (e.g., `CLI` -> CLI adapter, `API` -> REST/GraphQL handler, `container_pipeline` -> container runtime hook).

**Next steps**
- If you want, I can add a runtime YAML config under `web/` and wire a small loader utility.
- I can also open a PR with this file and a small README addition.
