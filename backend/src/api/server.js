'use strict'

const express = require('express')
const path = require('path')
const cors = require('cors')
const routes = require('./routes')

function createServer() {
  const app = express()

  const origin = process.env.CORS_ORIGIN || '*'
  app.use(cors({ origin: origin === '*' ? true : origin.split(',').map((s) => s.trim()) }))
  app.use(express.json({ limit: '32kb' }))

  app.get('/health', (_req, res) =>
    res.json({ ok: true, service: 'movi-license', ts: Math.floor(Date.now() / 1000) }),
  )
  app.use('/api', routes())

  // Optionally serve the built SPA (WEB_DIST = path to app/dist) from this same origin, so
  // one host serves both the app (/) and the API (/api) — no subdomain, no CORS. Mirrors
  // paymongo. Run `cd app && npm run build` to (re)generate the dist mounted at WEB_DIST.
  const webDist = process.env.WEB_DIST
  if (webDist) {
    app.use(express.static(webDist))
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path === '/health') return next()
      // SPA is built with base '/', but normalize trailing slashes so relative assets resolve.
      if (req.path !== '/' && req.path.endsWith('/')) {
        const qs = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : ''
        return res.redirect(301, req.path.replace(/\/+$/, '') + qs)
      }
      res.sendFile(path.join(webDist, 'index.html'))
    })
    console.log(`[movi-license] serving web app from ${webDist}`)
  }

  return app
}

module.exports = { createServer }
