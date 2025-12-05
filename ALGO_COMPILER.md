# Algorithm Compiler Panel

## Prompt Boxes
- Agent: (dropdown)
- Repo: (dropdown / paste URL / upload)
- Task(s): 1._________ 2._________ 3._________
- Device Connection: _______________________________
- Local Port: _______________________________

## Explanation
Write 1–2 paragraphs narrating the intent of this configuration.

## Generated Algorithm Block
```yaml
assignment:
  agent_primary: "Claude Capsule"
  repo: "AMD Drivers"
  tasks:
    - "Validate firmware v23.9"
    - "Patch self-healing routine"
  device_connection: "USB3DPrinter01"
  local_port: "8080"
  explanation: |
    This capsule invocation assigns Claude to the AMD Drivers repo.
    The task is to validate firmware version 23.9 against the current board specs
    and patch the driver with a self-healing routine.
    The output is intended for direct deployment to a connected 3D printer via USB,
    using port 8080 for communication.
```

---

## 5. File Navigator Panel (`FILE_NAV.md`)

```markdown
# File Navigator Panel

## Saved Algorithms
- [Algo_2025-12-05_A1.yml] ⭐
- [Algo_2025-12-05_A2.yml]
- [Algo_2025-12-05_A3.yml]

## Actions
- Drag & Drop → move algo into active page
- Star → mark as favorite
- Archive → move algo into Sunshine_Digital/archive
- Export → copy algo block for external use

## Context
Each file contains:
- Agent assignments
- Repo connections
- Capsule tasks
- Device/port bindings
- Explanation paragraph
✅ Outcome
Paste these five files into VS Code (CONFIG_PANEL.md, REPOS.md, HOOK_LOG.md, ALGO_COMPILER.md, FILE_NAV.md).

They reflect directly into your pipeline as narratable manifests.

Dropdowns, prompt boxes, and YAML blocks give you structured + human context.

File Navigator ensures prior algos are reusable.

Together, the packet makes your cockpit modular, reproducible, and audit‑ready.
```
