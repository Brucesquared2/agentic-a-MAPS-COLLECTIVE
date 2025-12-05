import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

interface DashboardConfig {
  dashboard: { panels: string[] }
}
interface AgentBio {
  name: string
  role?: string
  strengths?: string
  weaknesses?: string
}
interface AgentsConfig {
  agents: AgentBio[]
}
interface SignalRoute {
  id: string
  agent: string
  destination: { name: string; type: string }
}
interface SignalRouting {
  devices: { name: string; type: string }[]
  routes: SignalRoute[]
}

function loadYAML<T>(filePath: string): T {
  const fullPath = path.resolve(process.cwd(), filePath)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  return yaml.load(fileContents) as T
}

function loadDashboard(): DashboardConfig {
  return loadYAML<DashboardConfig>('dashboard.yml')
}
function loadAgents(): AgentsConfig {
  return loadYAML<AgentsConfig>('AGENTS.yml')
}
function loadSignalRouting(): SignalRouting {
  return loadYAML<SignalRouting>('signal_routing.yml')
}

function generateMermaid(): string {
  const dashboard = loadDashboard()
  const agents = loadAgents()
  const routing = loadSignalRouting()

  let diagram = 'graph TD\n'

  // Panels
  diagram += '  subgraph Dashboard Panels\n'
  dashboard.dashboard.panels.forEach((panel) => {
    const id = panel.replace(/\W+/g, '_')
    diagram += `    ${id}["${panel}"]\n`
  })
  diagram += '  end\n\n'

  // Agents
  diagram += '  subgraph Agents\n'
  agents.agents.forEach((agent) => {
    const id = agent.name.replace(/\W+/g, '_')
    diagram += `    ${id}["${agent.name}\\n(${agent.role})"]\n`
  })
  diagram += '  end\n\n'

  // Devices
  diagram += '  subgraph Devices\n'
  routing.devices.forEach((device) => {
    const id = device.name.replace(/\W+/g, '_')
    diagram += `    ${id}["${device.name}\\n(${device.type})"]\n`
  })
  diagram += '  end\n\n'

  // Routes
  routing.routes.forEach((route) => {
    const agentId = route.agent.replace(/\W+/g, '_')
    const destId = route.destination.name.replace(/\W+/g, '_')
    diagram += `  ${agentId} --> ${destId}\n`
  })

  return diagram
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const mermaid = generateMermaid()
    res.status(200).json({ mermaid })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
