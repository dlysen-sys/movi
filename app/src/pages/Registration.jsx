import { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { isAddress } from 'viem'
import { UserPlus, ArrowRight, Info, Link2, CheckCircle2 } from 'lucide-react'
import ConnectPrompt from '../components/ConnectPrompt'
import Footer from '../components/Footer'
import { useMoviUser } from '../hooks/useMoviUser'
import { PLAN, phpFromUsdt } from '../config/content'

export default function Registration() {
  const { isConnected } = useAccount()
  const { isRegistered, register } = useMoviUser()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  const referrer = localStorage.getItem('movi_referrer')
  const hasRef = referrer && isAddress(referrer)

  if (!isConnected) return <div className="pt-16"><ConnectPrompt title="Connect to Register" subtitle="Connect a BSC-compatible wallet to join MoVi." /></div>
  if (isRegistered) return <Navigate to="/dashboard" replace />

  const handleRegister = () => {
    setBusy(true)
    // DEMO: marks the wallet registered locally. Replace with the on-chain register() call.
    setTimeout(() => { register(); navigate('/dashboard') }, 600)
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-movi-purple/10 border border-movi-purple/25 flex items-center justify-center mx-auto mb-5">
            <UserPlus size={28} className="text-movi-purple-light" />
          </div>
          <h1 className="font-display font-black text-3xl text-white">Join <span className="movi-text">MoVi</span></h1>
          <p className="text-movi-muted text-sm mt-2">One-time registration activates your account and places you in the network.</p>
        </div>

        <div className="card-glow p-6 space-y-5">
          <div className="relative flex items-center justify-between p-4 rounded-xl bg-movi-surface border border-movi-border">
            <span className="text-movi-muted text-sm">Registration fee</span>
            <span className="text-right">
              <span className="block font-mono font-bold text-xl text-white">{PLAN.registrationUsdt} USDT</span>
              <span className="block text-movi-green text-xs">≈ ₱{phpFromUsdt(PLAN.registrationUsdt).toLocaleString()}</span>
            </span>
          </div>

          <div className="relative">
            <div className="text-xs font-semibold text-movi-muted uppercase tracking-wider mb-2">Sponsor</div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-movi-surface border border-movi-border font-mono text-sm">
              <Link2 size={14} className="text-movi-purple-light flex-shrink-0" />
              {hasRef
                ? <span className="text-white truncate">{referrer.slice(0, 10)}…{referrer.slice(-8)}</span>
                : <span className="text-movi-muted">Direct (no referral link)</span>}
            </div>
            <p className="text-movi-muted text-[11px] mt-1.5 leading-relaxed">
              On registration you inherit your sponsor's <strong className="text-movi-purple-light">Origin Wallet</strong> address for Leadership rewards.
            </p>
          </div>

          <div className="relative flex items-start gap-2 p-3 rounded-lg bg-movi-purple/10 border border-movi-purple/20 text-movi-purple-light text-xs">
            <Info size={14} className="mt-0.5 flex-shrink-0" />
            <span>Preview: registration is stored locally until the MoVi contract is deployed. No USDT is charged yet.</span>
          </div>

          <button onClick={handleRegister} disabled={busy} className="relative btn-movi w-full py-4 rounded-xl flex items-center justify-center gap-2 text-lg">
            {busy ? <><CheckCircle2 size={18} /> Registering…</> : <>Register <ArrowRight size={16} /></>}
          </button>
          <p className="relative text-center text-xs text-movi-muted">
            New here? Read the <Link to="/rewards" className="text-movi-purple-light hover:underline">Rewards Plan</Link> first.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
