import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { Wallet, ChevronDown, Menu, X, AlertTriangle } from 'lucide-react'
import { ACTIVE_CHAIN_ID } from '../config/wagmi'
import { useMoviUser } from '../hooks/useMoviUser'
import { useIsAdmin } from '../hooks/useIsAdmin'
import Logo from './Logo'

const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '')

const PUBLIC_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/rewards', label: 'Rewards Plan' },
]
const APP_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/subscribe', label: 'Subscribe' },
  { to: '/withdraw', label: 'Withdraw' },
  { to: '/collect', label: 'Collect' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { isRegistered } = useMoviUser()
  const isAdmin = useIsAdmin()
  const [menuOpen, setMenuOpen] = useState(false)
  const [walletOpen, setWalletOpen] = useState(false)

  const wrongNetwork = isConnected && chain?.id !== ACTIVE_CHAIN_ID
  const links = [
    ...PUBLIC_LINKS,
    ...(isConnected && isRegistered ? APP_LINKS : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ]

  useEffect(() => {
    setMenuOpen(false)
    setWalletOpen(false)
  }, [pathname])

  const linkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'text-white bg-movi-purple/15 border border-movi-purple/30'
        : 'text-movi-muted hover:text-white hover:bg-white/5'
    }`

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-movi-border bg-movi-black/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="group">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
                {label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {wrongNetwork && (
              <button
                onClick={() => switchChain({ chainId: ACTIVE_CHAIN_ID })}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-movi-red/10 border border-movi-red/30 text-movi-red text-sm font-semibold hover:bg-movi-red/20 transition-all"
              >
                <AlertTriangle size={12} /> Switch Network
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setWalletOpen((o) => !o)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-movi-border bg-movi-surface hover:border-movi-purple/40 hover:bg-movi-card transition-all"
                title={isConnected ? short(address) : 'Connect Wallet'}
              >
                <Wallet size={16} className="text-movi-purple-light" />
                <span className="hidden sm:inline text-sm font-medium text-white">
                  {isConnected ? short(address) : 'Connect'}
                </span>
                <ChevronDown size={14} className={`text-movi-muted transition-transform ${walletOpen ? 'rotate-180' : ''}`} />
              </button>
              {walletOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 card overflow-hidden">
                  {!isConnected ? (
                    <>
                      <div className="px-4 py-3 border-b border-movi-border text-xs font-semibold text-movi-muted uppercase tracking-wider">
                        Connect Wallet
                      </div>
                      {connectors.map((c) => (
                        <button
                          key={c.uid}
                          onClick={() => { connect({ connector: c }); setWalletOpen(false) }}
                          className="w-full px-4 py-3 text-left text-sm text-movi-muted hover:text-white hover:bg-movi-purple/10 transition-colors border-b border-movi-border last:border-0"
                        >
                          {c.name}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b border-movi-border flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-movi-green animate-pulse" />
                        <span className="font-mono text-sm text-white truncate">{short(address)}</span>
                      </div>
                      <button
                        onClick={() => { disconnect(); setWalletOpen(false) }}
                        className="w-full px-4 py-3 text-left text-sm text-movi-muted hover:text-movi-red hover:bg-movi-red/10 transition-colors"
                      >
                        Disconnect
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <button className="md:hidden p-2 text-movi-muted hover:text-white" onClick={() => setMenuOpen((o) => !o)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-movi-border bg-movi-surface px-4 py-3 space-y-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive ? 'bg-movi-purple/15 text-white' : 'text-movi-muted hover:text-white'
                }`}
            >
              {label}
            </NavLink>
          ))}
          {wrongNetwork && (
            <button
              onClick={() => { switchChain({ chainId: ACTIVE_CHAIN_ID }); setMenuOpen(false) }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-base font-semibold text-movi-red bg-movi-red/10"
            >
              <AlertTriangle size={14} /> Switch Network
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
