import fs from 'fs/promises'
import path from 'path'
import yaml from 'js-yaml'

const repoRoot = process.cwd()

async function readYamlFile(relPath: string) {
  try {
    const abs = path.resolve(repoRoot, relPath)
    const raw = await fs.readFile(abs, 'utf8')
    return yaml.load(raw)
  } catch (err) {
    return null
  }
}

export async function loadDashboard(): Promise<{ panels: string[] } | null> {
  const data = await readYamlFile('dashboard.yml')
  if (!data) return null
  if (typeof data === 'object' && 'dashboard' in (data as any)) {
    const panels = (data as any).dashboard?.panels ?? []
    return { panels }
  }
  return null
}

export async function loadAgents(): Promise<any[] | null> {
  const data = await readYamlFile('AGENTS.yml')
  if (!data) return null
  if (typeof data === 'object' && 'agents' in (data as any)) {
    return (data as any).agents
  }
  return null
}

export async function loadDashboardAndAgents() {
  const [dashboard, agents] = await Promise.all([loadDashboard(), loadAgents()])
  return { dashboard, agents }
}
