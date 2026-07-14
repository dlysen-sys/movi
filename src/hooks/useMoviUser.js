import { useAccount } from 'wagmi'
import { useState, useEffect, useCallback } from 'react'

// Placeholder MoVi account state. Registration + balances are DEMO values (localStorage)
// so the full flow is navigable now; replace with contract reads once MoVi is deployed
// (see src/config/contracts.js). pendingContract=true drives the "coming soon" notices.
const regKey = (addr) => `movi_reg_${(addr || '').toLowerCase()}`

export function useMoviUser() {
  const { address, isConnected } = useAccount()
  const [isRegistered, setRegistered] = useState(false)

  useEffect(() => {
    if (!address) return setRegistered(false)
    setRegistered(localStorage.getItem(regKey(address)) === '1')
  }, [address])

  const register = useCallback(() => {
    if (!address) return
    localStorage.setItem(regKey(address), '1')
    setRegistered(true)
  }, [address])

  const reset = useCallback(() => {
    if (!address) return
    localStorage.removeItem(regKey(address))
    setRegistered(false)
  }, [address])

  // Demo placeholders — all zero until on-chain reads are wired.
  const stats = {
    walletBalance: 0,
    directCount: 0,
    unilevelTotal: 0,
    teamPowerTotal: 0,
    collectable: 0,
    isSubscribed: false,
    subscriptionEndsAt: null,
  }

  return { address, isConnected, isRegistered, register, reset, stats, pendingContract: true }
}
