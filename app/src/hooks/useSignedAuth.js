import { useRef, useCallback } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { authMessage } from '../config/api'

// Produces a signed { address, ts, signature } for backend auth. Caches the
// signature for ~4 min so the user isn't prompted on every request (backend
// accepts a 5-min window).
export function useSignedAuth() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const cache = useRef({ address: null, ts: 0, signature: null })

  const getAuth = useCallback(async () => {
    if (!address) throw new Error('WALLET_NOT_CONNECTED')
    const now = Math.floor(Date.now() / 1000)
    const c = cache.current
    if (c.address === address && c.signature && now - c.ts < 240) {
      return { address, ts: c.ts, signature: c.signature }
    }
    const ts = now
    const signature = await signMessageAsync({ message: authMessage(ts) })
    cache.current = { address, ts, signature }
    return { address, ts, signature }
  }, [address, signMessageAsync])

  return { getAuth }
}
