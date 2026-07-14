import { Layers, Users, Lock, HandCoins } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'

export default function Collect() {
  return (
    <AuthLayout title="Collect" subtitle="Claim your Unilevel and Team Power bonuses.">
      {(d) => (
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { key: 'uni', title: 'Unilevel Bonus', sub: '1 USDT per active sponsor · levels 1–10', amount: d.stats.unilevelTotal, icon: Layers, accent: 'purple' },
            { key: 'tp', title: 'Team Power Bonus', sub: '1.5 USDT per 3 directs', amount: d.stats.teamPowerTotal, icon: Users, accent: 'green' },
          ].map((c) => {
            const green = c.accent === 'green'
            return (
              <div key={c.key} className="card-glow p-6 flex flex-col">
                <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${green ? 'bg-movi-green/10 text-movi-green' : 'bg-movi-purple/10 text-movi-purple-light'}`}>
                  <c.icon size={20} />
                </div>
                <div className="relative font-display font-bold text-white">{c.title}</div>
                <div className="relative text-movi-muted text-xs mb-4">{c.sub}</div>
                <div className="relative rounded-xl bg-movi-surface border border-movi-border p-4 mb-4">
                  <div className="text-xs text-movi-muted">Claimable</div>
                  <div className={`font-mono font-bold text-2xl ${green ? 'text-movi-green' : 'text-movi-purple-light'}`}>{c.amount.toFixed(2)} <span className="text-sm text-movi-muted font-normal">USDT</span></div>
                </div>
                <button disabled className={`relative mt-auto w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-display font-bold ${green ? 'bg-green-gradient text-movi-black' : 'bg-purple-gradient text-white'} opacity-50 cursor-not-allowed`}>
                  <HandCoins size={16} /> Collect
                </button>
              </div>
            )
          })}
          <div className="sm:col-span-2 flex items-center justify-center gap-1.5 text-xs text-movi-muted">
            <Lock size={12} /> Collection activates once the MoVi contract is deployed.
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
