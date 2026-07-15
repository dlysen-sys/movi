import { useState } from 'react'
import { ArrowDownCircle, Lock, Clock } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { PLAN } from '../config/content'

export default function Withdraw() {
  const [amount, setAmount] = useState('')
  const amt = Number(amount) || 0
  const fee = amt * (PLAN.withdrawFeePct / 100)
  const net = amt - fee

  return (
    <AuthLayout title="Withdraw" subtitle={`${PLAN.withdrawCooldownHrs}h cooldown · ${PLAN.withdrawFeePct}% processing fee.`}>
      {(d) => (
        <div className="max-w-lg">
          <div className="card-glow p-6 space-y-5">
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-movi-muted">Amount (USDT)</label>
                <button onClick={() => setAmount(String(d.stats.walletBalance))} className="text-xs text-movi-purple-light hover:underline">
                  Max: {d.stats.walletBalance.toFixed(2)}
                </button>
              </div>
              <div className="flex items-center bg-movi-surface border border-movi-border rounded-xl overflow-hidden focus-within:border-movi-purple/50">
                <input
                  type="number" min="0" value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 px-4 py-3 bg-transparent text-white font-mono outline-none"
                />
                <span className="px-4 text-movi-green font-bold border-l border-movi-border">USDT</span>
              </div>
            </div>

            <div className="relative rounded-xl bg-movi-surface border border-movi-border p-4 space-y-2 text-sm">
              <div className="flex justify-between text-movi-muted"><span>Processing fee ({PLAN.withdrawFeePct}%)</span><span className="font-mono text-movi-red">-{fee.toFixed(2)} USDT</span></div>
              <div className="flex justify-between border-t border-movi-border pt-2"><span className="text-movi-muted font-semibold">You receive</span><span className="font-mono font-bold text-movi-green">{net > 0 ? net.toFixed(2) : '0.00'} USDT</span></div>
            </div>

            <div className="relative flex items-center gap-2 p-3 rounded-lg bg-movi-surface border border-movi-border text-xs text-movi-muted">
              <Clock size={13} className="text-movi-purple-light flex-shrink-0" /> Withdrawals are subject to a {PLAN.withdrawCooldownHrs}-hour cooldown between requests.
            </div>

            <button disabled className="relative btn-movi w-full py-4 rounded-xl flex items-center justify-center gap-2">
              <ArrowDownCircle size={16} /> Withdraw
            </button>
            <p className="relative flex items-center justify-center gap-1.5 text-xs text-movi-muted">
              <Lock size={12} /> Withdrawals activate once the MoVi contract is deployed.
            </p>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
