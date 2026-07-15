'use strict'

// Read-only view into movi.sol for authorization + active-subscription checks.
const { ethers } = require('ethers')

const RPC = process.env.BSC_RPC_URL || 'https://bsc-dataseed1.binance.org'
const MOVI_ADDRESS = process.env.MOVI_ADDRESS || ''

const ABI = [
  'function checkIsAdmin(address) view returns (bool)',
  'function isActive(address) view returns (bool)',
  'function owner() view returns (address)',
]

let contract = null

function init() {
  if (!MOVI_ADDRESS) return
  const provider = new ethers.JsonRpcProvider(RPC)
  contract = new ethers.Contract(MOVI_ADDRESS, ABI, provider)
}

const hasContract = () => !!contract

async function isAdminOnChain(addr) {
  if (!contract) return false
  try { return await contract.checkIsAdmin(addr) } catch { return false }
}

async function isActiveOnChain(addr) {
  if (!contract) return false
  try { return await contract.isActive(addr) } catch { return false }
}

module.exports = { init, hasContract, isAdminOnChain, isActiveOnChain, MOVI_ADDRESS }
