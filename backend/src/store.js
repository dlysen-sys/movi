'use strict'

// License inventory — flat JSON with an in-memory cache and atomic tmp→rename
// persist (paymongo orders.js pattern). Single-process, so claims are atomic.
// Record: { subscription_code, wallet_address, date_time, created_at }
//   available  ⇔  wallet_address === '' && date_time === ''
//   assigned   ⇔  wallet_address set + date_time (unix seconds); valid 30d from date_time

const fs = require('fs')
const path = require('path')

const DATA_FILE = process.env.DATA_FILE
  ? path.resolve(process.env.DATA_FILE)
  : path.join(__dirname, '..', 'data', 'licenses.json')

const nowSec = () => Math.floor(Date.now() / 1000)
const norm = (a) => (a || '').toLowerCase()

let licenses = []

function load() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
    licenses = Array.isArray(parsed) ? parsed : []
  } catch {
    licenses = []
  }
  return licenses
}

function persist() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
  const tmp = DATA_FILE + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(licenses, null, 2))
  fs.renameSync(tmp, DATA_FILE) // atomic replace — never a half-written file
}

const isAvailable = (r) => !r.wallet_address && !r.date_time
const all = () => licenses
const find = (code) => licenses.find((r) => r.subscription_code === code)
const byWallet = (addr) => licenses.filter((r) => norm(r.wallet_address) === norm(addr))

function add(codes) {
  const added = []
  for (const raw of codes) {
    const code = String(raw).trim()
    if (!code || find(code)) continue
    const rec = { subscription_code: code, wallet_address: '', date_time: '', created_at: nowSec() }
    licenses.push(rec)
    added.push(rec)
  }
  if (added.length) persist()
  return added
}

function assign(code, wallet, dateTime) {
  const r = find(code)
  if (!r) return null
  r.wallet_address = wallet
  r.date_time = dateTime != null ? Number(dateTime) : nowSec()
  persist()
  return r
}

function clear(code) {
  const r = find(code)
  if (!r) return null
  r.wallet_address = ''
  r.date_time = ''
  persist()
  return r
}

function remove(code) {
  const i = licenses.findIndex((r) => r.subscription_code === code)
  if (i < 0) return false
  licenses.splice(i, 1)
  persist()
  return true
}

// Claim the next available code for a wallet (self-service).
function claimNext(wallet, dateTime) {
  const r = licenses.find(isAvailable)
  if (!r) return null
  r.wallet_address = wallet
  r.date_time = dateTime != null ? Number(dateTime) : nowSec()
  persist()
  return r
}

module.exports = {
  load, persist, all, find, byWallet, add, assign, clear, remove, claimNext, isAvailable, DATA_FILE,
}
