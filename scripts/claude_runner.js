// === Claude Capsule Task Runner ===
// Reads docs/CLAUDE_TASKS.md, invokes Claude API for each task,
// logs results into Sunshine_Digital/key_log.yml

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const fetch = require('node-fetch')

const tasksPath = path.join(process.cwd(), 'docs', 'CLAUDE_TASKS.md')
const ledgerPath = path.join(process.cwd(), 'Sunshine_Digital', 'key_log.yml')

// Detect dry-run flag
const dryRun = process.argv.includes('--dry-run') || process.argv.includes('-d')

// Append invocation to ledger
function logInvocation(agent, task, response) {
  const entry = {
    timestamp: new Date().toISOString(),
    agent,
    task,
    response,
  }
  if (dryRun) {
    console.log('[DRY-RUN] Would log entry:', entry)
    return
  }

  let ledger = []
  if (fs.existsSync(ledgerPath)) {
    try {
      const raw = fs.readFileSync(ledgerPath, 'utf8')
      ledger = yaml.load(raw) || []
    } catch (e) {
      console.error('Failed to read existing ledger, starting fresh:', e)
      ledger = []
    }
  }

  ledger.push(entry)
  try {
    fs.mkdirSync(path.dirname(ledgerPath), { recursive: true })
    fs.writeFileSync(ledgerPath, yaml.dump(ledger), 'utf8')
    console.log(`✅ Logged ${agent} task: ${task}`)
  } catch (e) {
    console.error('Failed to write ledger:', e)
  }
}

// Minimal Claude API call wrapper
async function invokeClaude(task) {
  if (dryRun) {
    console.log(`[DRY-RUN] Would invoke Claude for task: ${task}`)
    logInvocation('Claude Capsule', task, 'Simulated response')
    return 'Simulated response'
  }

  if (!process.env.CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY not set in environment')
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CLAUDE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 512,
      messages: [{ role: 'user', content: task }],
    }),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Claude API error: ${res.status} ${txt}`)
  }

  const data = await res.json()
  const response = (data?.content?.[0]?.text) || (data?.completion) || JSON.stringify(data)
  logInvocation('Claude Capsule', task, response)
  return response
}

// Parse docs/CLAUDE_TASKS.md headings like "### 1. Pull MDPS Brain Files"
function parseTasks() {
  if (!fs.existsSync(tasksPath)) {
    console.error('Tasks file not found at', tasksPath)
    return []
  }
  const content = fs.readFileSync(tasksPath, 'utf8')
  const regex = /^###\s+\d+\.\s+(.+)$/gm
  const matches = []
  let m
  while ((m = regex.exec(content)) !== null) {
    matches.push(m[1].trim())
  }
  return matches
}

// Run all tasks sequentially
;(async () => {
  try {
    const tasks = parseTasks()
    if (!tasks.length) {
      console.log('No tasks found in', tasksPath)
      process.exit(0)
    }

    for (const t of tasks) {
      console.log(`Invoking Claude for task: ${t}`)
      try {
        await invokeClaude(t)
      } catch (err) {
        console.error('Claude invocation failed for task:', t, err.message)
        logInvocation('Claude Capsule (error)', t, `Error: ${err.message}`)
      }
    }

    console.log('All tasks processed.')
  } catch (err) {
    console.error('Runner failed:', err)
    process.exitCode = 1
  }
})()
