import { NavLink, Navigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import {
  LayoutDashboard, Wallet as WalletIcon, Repeat, ArrowDownCircle, HandCoins, Info,
} from 'lucide-react'
import { useMoviUser } from '../hooks/useMoviUser'
import ConnectPrompt from './ConnectPrompt'

const STEPS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/deposit', label: 'Deposit', icon: WalletIcon },
  { to: '/subscribe', label: 'Subscribe', icon: Repeat },
  { to: '/withdraw', label: 'Withdraw', icon: ArrowDownCircle },
  { to: '/collect', label: 'Collect', icon: HandCoins },
]

// Shell for the authenticated area: gates on connect + registration, renders the app
// subnav, and passes the useMoviUser() result to `children` (render-prop or node).
export default function AuthLayout({ title, subtitle, children }) {
  const { isConnected } = useAccount()
  const data = useMoviUser()

  if (!isConnected) return <div className="pt-16"><ConnectPrompt /></div>
  if (!data.isRegistered) return <Navigate to="/register" replace />

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">{title}</h1>
          {subtitle && <p className="text-movi-muted text-sm mt-1">{subtitle}</p>}
          <p className="text-movi-muted text-xs mt-2 font-mono">
            {data.address?.slice(0, 8)}…{data.address?.slice(-6)}
            <span className="ml-3 chip">✓ Registered</span>
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-6">
          {STEPS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-movi-purple/15 text-white border border-movi-purple/30'
                    : 'text-movi-muted hover:text-white bg-movi-surface border border-movi-border'
                }`}
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </div>

        {data.pendingContract && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-movi-purple/10 border border-movi-purple/20 text-movi-purple-light text-xs mb-6">
            <Info size={14} className="mt-0.5 flex-shrink-0" />
            <span>
              Preview mode — on-chain actions activate once the MoVi contract is deployed. Balances shown are placeholders.
            </span>
          </div>
        )}

        {typeof children === 'function' ? children(data) : children}
      </div>
    </div>
  )
}
