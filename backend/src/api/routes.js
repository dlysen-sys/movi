'use strict'

const express = require('express')
const rateLimit = require('express-rate-limit')
const store = require('../store')
const auth = require('../auth')
const chain = require('../chain')
const { isAddr, checksum, parseCodes } = require('./validate')

const VALID_DAYS = Number(process.env.LICENSE_VALID_DAYS || 30)
const VALID_SECS = VALID_DAYS * 86400
const SELF_CLAIM = String(process.env.LICENSE_SELF_CLAIM || 'false') === 'true'
const nowSec = () => Math.floor(Date.now() / 1000)

function statusOf(r) {
  if (store.isAvailable(r)) return 'available'
  return nowSec() < Number(r.date_time) + VALID_SECS ? 'assigned' : 'expired'
}

function view(r) {
  return {
    subscription_code: r.subscription_code,
    wallet_address: r.wallet_address || '',
    date_time: r.date_time || '',
    valid_until: r.date_time ? Number(r.date_time) + VALID_SECS : null,
    status: statusOf(r),
  }
}

function fail(res, e) {
  res.status(e.status || 500).json({ ok: false, error: e.message || 'ERROR' })
}

module.exports = function routes() {
  const r = express.Router()
  const limiter = rateLimit({
    windowMs: 60_000,
    max: Number(process.env.RATE_LIMIT_PER_MIN || 20),
    standardHeaders: true,
    legacyHeaders: false,
  })

  // ── User: fetch my code(s) (private — signature required) ──────────────────
  r.post('/license/mine', (req, res) => {
    try {
      const addr = auth.requireUser(req.body)
      res.json({ ok: true, address: addr, validDays: VALID_DAYS, licenses: store.byWallet(addr).map(view) })
    } catch (e) { fail(res, e) }
  })

  // ── User: self-claim next available code (opt-in; needs active subscription) ─
  r.post('/license/claim', limiter, async (req, res) => {
    try {
      if (!SELF_CLAIM) throw auth.httpErr(403, 'SELF_CLAIM_DISABLED')
      const addr = auth.requireUser(req.body)
      if (chain.hasContract() && !(await chain.isActiveOnChain(addr))) {
        throw auth.httpErr(403, 'NO_ACTIVE_SUBSCRIPTION')
      }
      const live = store.byWallet(addr).find((x) => statusOf(x) === 'assigned')
      if (live) return res.json({ ok: true, claimed: false, license: view(live) })
      const rec = store.claimNext(addr)
      if (!rec) throw auth.httpErr(409, 'NO_AVAILABLE_CODES')
      res.json({ ok: true, claimed: true, license: view(rec) })
    } catch (e) { fail(res, e) }
  })

  // ── Admin: list inventory ──────────────────────────────────────────────────
  r.post('/admin/inventory', async (req, res) => {
    try {
      await auth.requireAdmin(req.body)
      const { filter, offset = 0, limit = 500 } = req.body || {}
      let rows = store.all().map(view)
      if (['available', 'assigned', 'expired'].includes(filter)) rows = rows.filter((x) => x.status === filter)
      const counts = store.all().reduce(
        (a, x) => { a[statusOf(x)]++; a.total++; return a },
        { available: 0, assigned: 0, expired: 0, total: 0 },
      )
      res.json({ ok: true, total: rows.length, counts, licenses: rows.slice(Number(offset), Number(offset) + Number(limit)) })
    } catch (e) { fail(res, e) }
  })

  // ── Admin: bulk add codes ──────────────────────────────────────────────────
  r.post('/admin/codes', limiter, async (req, res) => {
    try {
      await auth.requireAdmin(req.body)
      const codes = parseCodes(req.body?.codes)
      if (!codes.length) throw auth.httpErr(400, 'NO_CODES')
      const added = store.add(codes)
      res.json({ ok: true, added: added.length, skipped: codes.length - added.length })
    } catch (e) { fail(res, e) }
  })

  // ── Admin: assign / clear a code ───────────────────────────────────────────
  r.patch('/admin/codes', limiter, async (req, res) => {
    try {
      await auth.requireAdmin(req.body)
      const { code, action, wallet, date_time } = req.body || {}
      if (!code || !store.find(code)) throw auth.httpErr(404, 'CODE_NOT_FOUND')
      let rec
      if (action === 'assign') {
        if (!isAddr(wallet)) throw auth.httpErr(400, 'BAD_WALLET')
        rec = store.assign(code, checksum(wallet), date_time ? Number(date_time) : undefined)
      } else if (action === 'clear') {
        rec = store.clear(code)
      } else {
        throw auth.httpErr(400, 'BAD_ACTION')
      }
      res.json({ ok: true, license: view(rec) })
    } catch (e) { fail(res, e) }
  })

  // ── Admin: delete a code ───────────────────────────────────────────────────
  r.delete('/admin/codes', limiter, async (req, res) => {
    try {
      await auth.requireAdmin(req.body)
      if (!store.remove(req.body?.code)) throw auth.httpErr(404, 'CODE_NOT_FOUND')
      res.json({ ok: true })
    } catch (e) { fail(res, e) }
  })

  return r
}
