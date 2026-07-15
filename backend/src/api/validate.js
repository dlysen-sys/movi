'use strict'

const { ethers } = require('ethers')

const isAddr = (a) => { try { return ethers.isAddress(a) } catch { return false } }
const checksum = (a) => ethers.getAddress(a)

// Accept an array of codes or a newline/comma-separated string; trim, dedupe.
function parseCodes(input) {
  const arr = Array.isArray(input) ? input : String(input || '').split(/[\n,]+/)
  return [...new Set(arr.map((s) => String(s).trim()).filter(Boolean))]
}

module.exports = { isAddr, checksum, parseCodes }
