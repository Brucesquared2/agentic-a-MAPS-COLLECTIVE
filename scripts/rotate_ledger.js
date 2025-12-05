#!/usr/bin/env node
// Cross-platform rotation script for repository ledger
// Usage: node scripts/rotate_ledger.js --log ./logs/key_log.yml --archive ./logs/archive

const fs = require('fs')
const path = require('path')

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--log' && args[i + 1]) { out.log = args[++i] }
    else if (a === '--archive' && args[i + 1]) { out.archive = args[++i] }
  }
  return out
}

function rotateLedger(logFile, archiveDir) {
  try {
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true })
    }

    const timestamp = new Date().toISOString().slice(0, 7) // YYYY-MM
    const archiveFile = path.join(archiveDir, `key_log-${timestamp}.yml`)

    if (fs.existsSync(logFile)) {
      fs.renameSync(logFile, archiveFile)
      console.log(`📦 Archived ledger to ${archiveFile}`)
    } else {
      console.log(`No ledger found at ${logFile}; nothing to archive.`)
    }

    fs.writeFileSync(logFile, '')
    console.log('✅ New key_log.yml created for fresh entries')
  } catch (err) {
    console.error('⚠️ Ledger rotation failed:', err)
    process.exitCode = 2
  }
}

const args = parseArgs()
const repoRoot = process.cwd()
const defaultLog = path.resolve(repoRoot, 'logs', 'key_log.yml')
const defaultArchive = path.resolve(repoRoot, 'logs', 'archive')

const logFile = args.log ? path.resolve(args.log) : defaultLog
const archiveDir = args.archive ? path.resolve(args.archive) : defaultArchive

rotateLedger(logFile, archiveDir)
