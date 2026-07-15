import { useState } from 'react'
import { useConnect } from 'wagmi'
import { Wallet, ChevronDown } from 'lucide-react'

// Wallet-connect card used to gate the authenticated area.
export default function ConnectPrompt({
  title = 'Connect Your Wallet',
  subtitle = 'Connect a BSC-compatible wallet to access your MoVi dashboard.',
}) {
  const { connect, connectors } = useConnect()
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-movi-purple/10 border border-movi-purple/25 flex items-center justify-center mx-auto mb-6 animate-pulse-purple">
          <Wallet size={32} className="text-movi-purple-light" />
        </div>
        <h2 className="font-display font-bold text-2xl text-white mb-3">{title}</h2>
        <p className="text-movi-muted text-sm mb-8 leading-relaxed">{subtitle}</p>
        <div className="relative inline-block">
          <button
            onClick={() => setOpen((o) => !o)}
            className="btn-movi px-8 py-3.5 rounded-xl flex items-center gap-2 mx-auto"
          >
            <Wallet size={16} /> Connect Wallet
            <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div className="absolute top-full mt-2 left-0 right-0 card overflow-hidden z-10">
              {connectors.map((c) => (
                <button
                  key={c.uid}
                  onClick={() => { connect({ connector: c }); setOpen(false) }}
                  className="w-full px-4 py-3 text-sm text-movi-muted hover:text-white hover:bg-movi-purple/10 transition-colors text-left border-b border-movi-border last:border-0"
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
