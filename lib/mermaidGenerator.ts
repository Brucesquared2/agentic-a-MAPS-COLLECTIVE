import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { getCockpitConfig } from "./uiLoader";

interface SignalRoute {
  id: string;
  trigger: string;
  agent: string;
  repo: string;
  tasks: string[];
  destination: {
    type: string;
    name: string;
    connection: string;
    port?: string;
  };
  outcome: string;
}

interface SignalRouting {
  settings?: {
    ledger_path?: string;
    compilation_method?: string;
  };
  devices: {
    name: string;
    type: string;
    connection: string;
    port?: string;
  }[];
  routes: SignalRoute[];
}

function loadSignalRouting(): SignalRouting {
  const fullPath = path.resolve(process.cwd(), "signal_routing.yml");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return yaml.load(fileContents) as SignalRouting;
}

export function generateMermaid(activeAssignments: string[] = []): string {
  const { dashboard, agents } = getCockpitConfig();
  const routing = loadSignalRouting();

  let diagram = "graph TD\n";

  // Panels
  diagram += "  subgraph Dashboard Panels\n";
  dashboard.dashboard.panels.forEach((panel) => {
    const id = panel.replace(/\W+/g, "_");
    diagram += `    ${id}["${panel}"]\n`;
  });
  diagram += "  end\n\n";

  // Agents (add ⚡ badge for active assignments)
  diagram += "  subgraph Agents\n";
  agents.agents.forEach((agent) => {
    const id = agent.name.replace(/\W+/g, "_");
    const role = (agent as any).role ? `\\n(${(agent as any).role})` : "";
    const badge = activeAssignments.includes(agent.name) ? " ⚡" : "";
    diagram += `    ${id}["${agent.name}${badge}${role}"]\n`;
  });
  diagram += "  end\n\n";

  // Devices
  diagram += "  subgraph Devices\n";
  (routing.devices || []).forEach((device) => {
    const id = device.name.replace(/\W+/g, "_");
    diagram += `    ${id}["${device.name}\\n(${device.type})"]\n`;
  });
  diagram += "  end\n\n";

  // Routes
  (routing.routes || []).forEach((route) => {
    const agentId = route.agent.replace(/\W+/g, "_");
    const destId = route.destination.name.replace(/\W+/g, "_");
    diagram += `  ${agentId} --> ${destId}\n`;
  });

  return diagram;
}

// Standalone run
if (require.main === module) {
  console.log(generateMermaid());
}
