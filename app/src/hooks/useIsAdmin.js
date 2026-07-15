import { useAccount, useReadContract } from 'wagmi'
import { MOVI_ADDRESS, MOVI_ABI, isMoviDeployed } from '../config/contracts'

// Dev allowlist used until the contract is deployed (VITE_ADMIN_ADDRESSES).
const ALLOWLIST = (import.meta.env.VITE_ADMIN_ADDRESSES || '')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)

// Admin = movi.sol checkIsAdmin() once deployed, else the dev allowlist.
export function useIsAdmin() {
  const { address } = useAccount()
  const deployed = isMoviDeployed()
  const { data } = useReadContract({
    address: MOVI_ADDRESS,
    abi: MOVI_ABI,
    functionName: 'checkIsAdmin',
    args: [address],
    query: { enabled: deployed && !!address },
  })
  if (!address) return false
  return deployed ? Boolean(data) : ALLOWLIST.includes(address.toLowerCase())
}
