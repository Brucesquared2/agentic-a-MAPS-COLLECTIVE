import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import chokidar from 'chokidar'

type Suggestion = {
  id: string
  timestamp: string
  agent: string
  action: 'recommendation'
  notes: string
}

type Subscriber = (s: Suggestion) => void

const subscribers = new Set<Subscriber>()
let initialized = false

function findFile(name: string) {
  const cwd = process.cwd()
  const candidates = [
    path.resolve(cwd, name),
    path.resolve(cwd, '..', name),
    path.resolve(cwd, '..', '..', name),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) return p
  }
  return null
}

function readLedger(): any[] {
  const p = findFile('logs/key_log.yml') || findFile('Sunshine_Digital/key_log.yml')
  if (!p) return []
  try {
    const raw = fs.readFileSync(p, 'utf8')
    const docs = yaml.loadAll(raw)
    return docs as any[]
  } catch (e) {
    return []
  }
}

function simpleHeuristic(ledger: any[]): Suggestion[] {
  // naive heuristic: if same agent has >3 entries in last 20 entries, suggest attention
  const last = ledger.slice(-50)
  const counts: Record<string, number> = {}
  for (const entry of last) {
    const agent = entry.agent || 'unknown'
    counts[agent] = (counts[agent] || 0) + 1
  }
  const suggestions: Suggestion[] = []
  for (const [agent, count] of Object.entries(counts)) {
    if (count >= 5) {
      suggestions.push({
        id: `suggestion/${agent}/${Date.now()}`,
        timestamp: new Date().toISOString(),
        agent,
        action: 'recommendation',
        notes: `Agent ${agent} has ${count} recent invocations — consider reviewing workflows or scaling resources.`,
      })
    }
  }
  return suggestions
}

function emitSuggestions() {
  try {
    const ledger = readLedger()
    const suggestions = simpleHeuristic(ledger)
    for (const s of suggestions) {
      for (const sub of subscribers) sub(s)
    }
  } catch (err) {
    console.error('⚠️ recommendation engine failed:', err)
  }
}

export function subscribeSuggestions(sub: Subscriber) {
  subscribers.add(sub)
  // send initial suggestions
  emitSuggestions()
  return () => subscribers.delete(sub)
}

export function ensureRecommendationWatcher() {
  if (initialized) return
  initialized = true
  const files = ['logs/key_log.yml', 'Sunshine_Digital/key_log.yml']
  const watcher = chokidar.watch(files, { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 100 } })
  watcher.on('change', () => {
    emitSuggestions()
  })
  watcher.on('error', (e) => console.error('recommendation watcher error', e))
}

export function appendSuggestionToLedger(s: Suggestion) {
  const p = findFile('logs/key_log.yml') || (() => {
    const dest = path.resolve(process.cwd(), 'logs/key_log.yml')
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    if (!fs.existsSync(dest)) fs.writeFileSync(dest, '')
    return dest
  })()

  const yamlDoc = yaml.dump(s)
  fs.appendFileSync(p, `\n---\n${yamlDoc}`)
}
