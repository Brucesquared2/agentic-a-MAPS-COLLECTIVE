import chokidar from 'chokidar'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

type Subscriber = (payload: { mermaid: string }) => void

const subscribers = new Set<Subscriber>()
let initialized = false

function loadYAML(fileName: string) {
  const cwd = process.cwd()
  const candidates = [
    path.resolve(cwd, fileName),
    path.resolve(cwd, '..', fileName),
    path.resolve(cwd, '..', '..', fileName),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) return yaml.load(fs.readFileSync(p, 'utf8'))
  }
  return null
}

function buildMermaid(): string {
  const dashboard = loadYAML('dashboard.yml') as any
  const agents = loadYAML('AGENTS.yml') as any
  const routing = loadYAML('signal_routing.yml') as any

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

  return diagram
}

function emitUpdate() {
  try {
    const mermaid = buildMermaid()
    const payload = { mermaid }
    for (const sub of subscribers) sub(payload)
  } catch (err) {
    console.error('⚠️ Failed to generate Mermaid:', err)
  }
}

export function subscribe(sub: Subscriber) {
  subscribers.add(sub)
  // send initial snapshot
  emitUpdate()
  return () => subscribers.delete(sub)
}

export function ensureWatcher() {
  if (initialized) return
  initialized = true

  const files = ['dashboard.yml', 'AGENTS.yml', 'signal_routing.yml']

  const watcher = chokidar.watch(files, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 250, pollInterval: 100 },
  })

  watcher.on('change', (filePath) => {
    console.log('🔄 Cockpit file changed:', filePath)
    emitUpdate()
  })

  watcher.on('error', (err) => {
    console.error('⚠️ Watcher error:', err)
  })
}
