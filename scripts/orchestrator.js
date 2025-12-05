// === Cockpit Orchestrator ===
// Capsule: Claude (transient)
// Companion: Copilot (persistent)
// Ledger: Sunshine_Digital/key_log.yml

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const fetch = require('node-fetch')

// Ledger path
const ledgerPath = path.join(process.cwd(), 'Sunshine_Digital', 'key_log.yml')

// Helper to append invocation to ledger
function logInvocation(agent, prompt, response) {
  const entry = {
    timestamp: new Date().toISOString(),
    agent,
    prompt,
    response,
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
    console.log(`✅ Logged ${agent} invocation to ledger.`)
  } catch (e) {
    console.error('Failed to write ledger:', e)
  }
}

// Claude capsule invocation
async function invokeClaude(prompt) {
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
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Claude API error: ${res.status} ${txt}`)
  }

  const data = await res.json()
  // Anthropic responses may vary; adapt if your integration returns a different shape
  const response = (data?.content?.[0]?.text) || (data?.completion) || JSON.stringify(data)
  logInvocation('Claude Capsule', prompt, response)
  return response
}

// Copilot companion invocation (placeholder)
async function invokeCopilot(prompt) {
  // In cockpit, Copilot is persistent — here we simulate a companion response
  const response = `Copilot response to: ${prompt}`
  logInvocation('Copilot Companion', prompt, response)
  return response
}

// Example orchestrator run
;(async () => {
  try {
    const prompt = 'Summarize cockpit lineage rituals.'
    console.log('Invoking Claude...')
    let claudeResponse = ''
    try {
      claudeResponse = await invokeClaude(prompt)
    } catch (err) {
      console.error('Claude invocation failed:', err.message)
      claudeResponse = `Error: ${err.message}`
      // still log the failed invocation
      logInvocation('Claude Capsule (error)', prompt, claudeResponse)
    }

    console.log('Invoking Copilot...')
    const copilotResponse = await invokeCopilot(prompt)

    console.log('\n--- Responses ---')
    console.log('Claude Capsule:', claudeResponse)
    console.log('Copilot Companion:', copilotResponse)
  } catch (err) {
    console.error('Orchestrator failed:', err)
    process.exitCode = 1
  }
})()
