import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { NextResponse } from 'next/server'

function findFile(name: string) {
  const cwd = process.cwd()
  const candidates = [
    path.resolve(cwd, name),
    path.resolve(cwd, '..', name),
    path.resolve(cwd, '..', '..', name),
    path.resolve(cwd, '..', '..', '..', name),
    path.resolve(cwd, '..', '..', '..', '..', name),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) return p
  }
  return null
}

function loadYAML(filePath: string) {
  const full = findFile(filePath)
  if (!full) throw new Error(`File not found: ${filePath}`)
  const raw = fs.readFileSync(full, 'utf8')
  return yaml.load(raw)
}

export async function GET() {
  try {
    const dashboard = loadYAML('dashboard.yml') as any
    const agents = loadYAML('AGENTS.yml') as any
    const routing = loadYAML('signal_routing.yml') as any

    // build mermaid
    let diagram = 'graph TD\n'

    diagram += '  subgraph Dashboard Panels\n'
    ;(dashboard?.dashboard?.panels || []).forEach((panel: string) => {
      const id = panel.replace(/\W+/g, '_')
      diagram += `    ${id}["${panel}"]\n`
    })
    diagram += '  end\n\n'

    diagram += '  subgraph Agents\n'
    ;(agents?.agents || []).forEach((a: any) => {
      const id = a.name.replace(/\W+/g, '_')
      const role = a.role ? `\\n(${a.role})` : ''
      diagram += `    ${id}["${a.name}${role}"]\n`
    })
    diagram += '  end\n\n'

    diagram += '  subgraph Devices\n'
    ;(routing?.devices || []).forEach((d: any) => {
      const id = d.name.replace(/\W+/g, '_')
      diagram += `    ${id}["${d.name}\\n(${d.type})"]\n`
    })
    diagram += '  end\n\n'

    ;(routing?.routes || []).forEach((r: any) => {
      const aid = r.agent.replace(/\W+/g, '_')
      const did = r.destination.name.replace(/\W+/g, '_')
      diagram += `  ${aid} --> ${did}\n`
    })

    return NextResponse.json({ mermaid: diagram })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
