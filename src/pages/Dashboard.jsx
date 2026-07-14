import { Link } from 'react-router-dom'
import { Wallet, UserPlus, Layers, Users, Repeat, ArrowDownCircle, HandCoins, ArrowRight } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { PLAN } from '../config/content'

export default function Dashboard() {
  return (
    <AuthLayout title="Dashboard" subtitle="Your MoVi account at a glance.">
      {(d) => (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Wallet Balance', value: `${d.stats.walletBalance.toFixed(2)}`, unit: 'USDT', icon: Wallet, accent: 'purple' },
              { label: 'Direct Referrals', value: d.stats.directCount, unit: 'directs', icon: UserPlus, accent: 'green' },
              { label: 'Total Unilevel', value: `${d.stats.unilevelTotal.toFixed(2)}`, unit: 'USDT', icon: Layers, accent: 'purple' },
              { label: 'Team Power Bonus', value: `${d.stats.teamPowerTotal.toFixed(2)}`, unit: 'USDT', icon: Users, accent: 'green' },
            ].map((s) => (
              <div key={s.label} className="card-glow p-5">
                <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.accent === 'green' ? 'bg-movi-green/10 text-movi-green' : 'bg-movi-purple/10 text-movi-purple-light'}`}>
                  <s.icon size={18} />
                </div>
                <div className="relative font-mono font-bold text-2xl text-white leading-none">{s.value}</div>
                <div className={`relative text-[11px] font-semibold mt-1 ${s.accent === 'green' ? 'text-movi-green' : 'text-movi-purple-light'}`}>{s.unit}</div>
                <div className="relative text-movi-muted text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Subscription status + collectable */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-movi-muted text-xs uppercase tracking-wider mb-1"><Repeat size={13} /> Subscription</div>
                <div className="font-display font-bold text-lg text-white">{d.stats.isSubscribed ? 'Active' : 'Inactive'}</div>
                <div className="text-movi-muted text-xs">{PLAN.subscriptionUsdt} USDT / {PLAN.subscriptionDays} days</div>
              </div>
              <Link to="/subscribe" className="btn-movi px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5">
                {d.stats.isSubscribed ? 'Renew' : 'Subscribe'} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="card p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-movi-muted text-xs uppercase tracking-wider mb-1"><HandCoins size={13} /> Collectable</div>
                <div className="font-display font-bold text-lg text-movi-green">{d.stats.collectable.toFixed(2)} USDT</div>
                <div className="text-movi-muted text-xs">Unilevel + Team Power</div>
              </div>
              <Link to="/collect" className="btn-outline px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5">
                Collect <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { to: '/deposit', label: 'Deposit', icon: Wallet },
              { to: '/subscribe', label: 'Subscribe', icon: Repeat },
              { to: '/withdraw', label: 'Withdraw', icon: ArrowDownCircle },
              { to: '/collect', label: 'Collect', icon: HandCoins },
            ].map((a) => (
              <Link key={a.to} to={a.to} className="card p-4 flex flex-col items-center gap-2 hover:border-movi-purple/40 transition-colors">
                <a.icon size={20} className="text-movi-purple-light" />
                <span className="text-sm font-medium text-white">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
