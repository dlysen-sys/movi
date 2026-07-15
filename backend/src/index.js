'use strict'

// dotenv is optional — Docker injects env directly.
try { require('dotenv').config() } catch { /* noop */ }

const { createServer } = require('./api/server')
const store = require('./store')
const chain = require('./chain')

function main() {
  store.load()
  chain.init()

  const PORT = Number(process.env.PORT || 8090)
  const app = createServer()
  const server = app.listen(PORT, () => {
    const mode = chain.MOVI_ADDRESS ? `contract ${chain.MOVI_ADDRESS}` : 'allowlist (no MOVI_ADDRESS)'
    console.log(`[movi-license] listening on :${PORT} — admin auth: ${mode} — codes: ${store.all().length}`)
  })

  const shutdown = (sig) => {
    console.log(`[movi-license] ${sig} — shutting down`)
    server.close(() => process.exit(0))
  }
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

main()
