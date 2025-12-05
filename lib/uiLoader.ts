import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export interface DashboardConfig {
  dashboard: {
    panels: string[];
  };
}

export interface AgentBio {
  name: string;
  strengths: string;
  weaknesses?: string;
  role?: string;
}

export interface AgentsConfig {
  agents: AgentBio[];
}

function loadYAML<T>(filePath: string): T {
  const fullPath = path.resolve(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return yaml.load(fileContents) as T;
}

export function loadDashboard(): DashboardConfig {
  return loadYAML<DashboardConfig>("dashboard.yml");
}

export function loadAgents(): AgentsConfig {
  return loadYAML<AgentsConfig>("AGENTS.yml");
}

// Example usage: expose as JSON
export function getCockpitConfig() {
  const dashboard = loadDashboard();
  const agents = loadAgents();
  return {
    dashboard,
    agents,
  };
}

// If running standalone via ts-node
if (process.argv && process.argv[1] && process.argv[1].endsWith("uiLoader.ts")) {
  console.log("Cockpit Dashboard Config:");
  console.log(JSON.stringify(getCockpitConfig(), null, 2));
}
