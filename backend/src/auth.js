'use strict'

// Wallet-signature auth. The client signs `authMessage(ts)`; we recover the signer,
// check it matches the claimed address and a fresh timestamp, then authorize:
//   admin → checkIsAdmin() on movi.sol (or ADMIN_ADDRESSES allowlist pre-deploy)
//   user  → signature alone proves wallet ownership
const { ethers } = require('ethers')
const chain = require('./chain')

const MAX_AGE = Number(process.env.AUTH_MAX_AGE_SEC || 300)
const ALLOWLIST = (process.env.ADMIN_ADDRESSES || '')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)

function httpErr(status, msg) {
  const e = new Error(msg)
  e.status = status
  return e
}

// The exact message the frontend must sign.
function authMessage(ts) {
  return `MoVi Community authentication.\nSign to prove wallet ownership.\nTimestamp: ${ts}`
}

// Verify { address, signature, ts } → checksummed recovered address, or throw.
function verify({ address, signature, ts }) {
  if (!address || !signature || ts == null) throw httpErr(400, 'MISSING_AUTH')
  const t = Number(ts)
  if (!Number.isFinite(t)) throw httpErr(400, 'BAD_TS')
  if (Math.abs(Math.floor(Date.now() / 1000) - t) > MAX_AGE) throw httpErr(401, 'AUTH_EXPIRED')

  let recovered
  try { recovered = ethers.verifyMessage(authMessage(t), signature) }
  catch { throw httpErr(401, 'BAD_SIGNATURE') }

  if (!ethers.isAddress(address) || ethers.getAddress(recovered) !== ethers.getAddress(address)) {
    throw httpErr(401, 'SIG_MISMATCH')
  }
  return ethers.getAddress(recovered)
}

function requireUser(auth) {
  return verify(auth || {})
}

async function requireAdmin(auth) {
  const addr = verify(auth || {})
  if (chain.hasContract()) {
    if (await chain.isAdminOnChain(addr)) return addr
    throw httpErr(403, 'NOT_ADMIN')
  }
  // Pre-deploy fallback: env allowlist.
  if (ALLOWLIST.includes(addr.toLowerCase())) return addr
  throw httpErr(403, 'NOT_ADMIN')
}

module.exports = { authMessage, verify, requireUser, requireAdmin, httpErr, ALLOWLIST }
