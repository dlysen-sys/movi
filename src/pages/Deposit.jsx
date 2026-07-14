import { useState } from 'react'
import { Wallet, Lock } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'

export default function Deposit() {
  const [amount, setAmount] = useState('')
  return (
    <AuthLayout title="Deposit" subtitle="Fund your MoVi wallet with USDT on BNB Smart Chain.">
      {(d) => (
        <div className="max-w-lg">
          <div className="card-glow p-6 space-y-5">
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-movi-muted">Amount (USDT)</label>
                <span className="text-xs text-movi-muted">Balance: {d.stats.walletBalance.toFixed(2)} USDT</span>
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
            <button disabled className="relative btn-movi w-full py-4 rounded-xl flex items-center justify-center gap-2">
              <Wallet size={16} /> Deposit USDT
            </button>
            <p className="relative flex items-center justify-center gap-1.5 text-xs text-movi-muted">
              <Lock size={12} /> Deposits activate once the MoVi contract is deployed.
            </p>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
