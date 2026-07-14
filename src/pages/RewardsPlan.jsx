import { Link } from 'react-router-dom'
import {
  UserPlus, Layers, Users, Crown, ArrowRight, Sparkles, Repeat, ArrowDownCircle, Info,
} from 'lucide-react'
import Footer from '../components/Footer'
import IncomeCalculator from '../components/IncomeCalculator'
import { PLAN, REWARDS, phpFromUsdt } from '../config/content'

const ICONS = { UserPlus, Layers, Users, Crown }

export default function RewardsPlan() {
  return (
    <div className="pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="chip mx-auto mb-4"><Sparkles size={12} /> MoVi Rewards Plan</div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
            Earn with the <span className="movi-text">community</span>
          </h1>
          <p className="text-movi-muted mt-4 leading-relaxed">
            Registration is <strong className="text-white">{PLAN.registrationUsdt} USDT</strong>{' '}
            (₱{phpFromUsdt(PLAN.registrationUsdt).toLocaleString()}) and membership is{' '}
            <strong className="text-white">{PLAN.subscriptionUsdt} USDT</strong> every {PLAN.subscriptionDays} days.
            Every active subscription powers four rewards, paid out on BNB Smart Chain.
          </p>
        </div>

        {/* Reward detail cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {REWARDS.map((r) => {
            const I = ICONS[r.icon] ?? Sparkles
            const green = r.accent === 'green'
            return (
              <div key={r.key} className="card-glow p-6">
                <div className="relative flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${green ? 'bg-movi-green/10 text-movi-green' : 'bg-movi-purple/10 text-movi-purple-light'}`}>
                    <I size={22} />
                  </div>
                  <div>
                    <div className="font-display font-bold text-white text-lg">{r.title}</div>
                    <div className="text-movi-muted text-xs">{r.tagline}</div>
                  </div>
                  <div className={`ml-auto font-mono font-bold ${green ? 'text-movi-green' : 'text-movi-purple-light'}`}>{r.amount}</div>
                </div>
                <p className="relative text-movi-muted text-sm leading-relaxed">{r.body}</p>
              </div>
            )
          })}
        </div>

        {/* Auto-Compress explainer */}
        <div className="card-glow p-6 sm:p-8 mt-6">
          <div className="relative flex items-center gap-2 mb-4">
            <Layers size={18} className="text-movi-green" />
            <h2 className="font-display font-bold text-xl text-white">Unilevel Auto-Compress</h2>
          </div>
          <p className="relative text-movi-muted text-sm leading-relaxed mb-5">
            Each subscription forces a full <strong className="text-white">{PLAN.unilevelTotalUsdt} USDT</strong> payout —
            1 USDT to each active sponsor from level 1 upward. If a level's account is inactive, it is skipped and its
            share rolls to the next active level, so distribution can reach level 11+ until all{' '}
            {PLAN.unilevelTotalUsdt} shares are paid.
          </p>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-movi-border bg-movi-surface p-4">
              <div className="text-xs font-semibold text-movi-muted uppercase tracking-wider mb-2">Without compress</div>
              <div className="space-y-1.5 text-sm">
                {['L1 active +1', 'L2 inactive — lost', 'L3 active +1'].map((t, i) => (
                  <div key={i} className={`flex justify-between font-mono ${t.includes('inactive') ? 'text-movi-red/70 line-through' : 'text-white'}`}>
                    <span>{t.split(' ').slice(0, 2).join(' ')}</span><span>{t.includes('inactive') ? '✕' : '+1 USDT'}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-movi-green/30 bg-movi-green/5 p-4">
              <div className="text-xs font-semibold text-movi-green uppercase tracking-wider mb-2">With auto-compress ✓</div>
              <div className="space-y-1.5 text-sm">
                {['L1 active', 'L3 active (skips L2)', 'L4 active …'].map((t, i) => (
                  <div key={i} className="flex justify-between font-mono text-white">
                    <span>{t}</span><span className="text-movi-green">+1 USDT</span>
                  </div>
                ))}
                <div className="flex justify-between font-mono text-white pt-1.5 border-t border-movi-green/20">
                  <span className="text-movi-muted">Total forced</span><span className="text-movi-green">{PLAN.unilevelTotalUsdt} USDT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Power by-3 explainer */}
        <div className="card-glow p-6 sm:p-8 mt-6">
          <div className="relative flex items-center gap-2 mb-4">
            <Users size={18} className="text-movi-purple-light" />
            <h2 className="font-display font-bold text-xl text-white">Team Power — metered by 3</h2>
          </div>
          <p className="relative text-movi-muted text-sm leading-relaxed mb-5">
            For every <strong className="text-white">{PLAN.teamPowerPer} directs</strong>, earn{' '}
            <strong className="text-movi-purple-light">{PLAN.teamPowerUsdt} USDT</strong>. The counter meters every
            subscription in groups of {PLAN.teamPowerPer} — extras carry over toward your next reward.
          </p>
          <div className="relative flex flex-wrap gap-3">
            {[
              { n: 3, r: '1.5 USDT', carry: '0 carry' },
              { n: 4, r: '1.5 USDT', carry: '1 carry' },
              { n: 6, r: '3.0 USDT', carry: '0 carry' },
              { n: 7, r: '3.0 USDT', carry: '1 carry' },
            ].map((x) => (
              <div key={x.n} className="rounded-xl border border-movi-border bg-movi-surface px-4 py-3 text-center min-w-[92px]">
                <div className="font-display font-bold text-white">{x.n} directs</div>
                <div className="font-mono text-movi-purple-light text-sm">{x.r}</div>
                <div className="text-movi-muted text-[11px]">{x.carry}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Income calculator */}
        <div className="mt-6">
          <IncomeCalculator />
        </div>

        {/* Fees & rules */}
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3"><Repeat size={16} className="text-movi-green" /><h3 className="font-display font-bold text-white">Subscription & payouts</h3></div>
            <ul className="space-y-2 text-sm text-movi-muted">
              <li className="flex justify-between"><span>Membership</span><span className="text-white font-mono">{PLAN.subscriptionUsdt} USDT / {PLAN.subscriptionDays}d</span></li>
              <li className="flex justify-between"><span>Daily payout</span><span className="text-white">Direct referral rebate</span></li>
              <li className="flex justify-between"><span>Payout cooldown</span><span className="text-white font-mono">{PLAN.dailyPayoutCooldownDays} days</span></li>
              <li className="flex justify-between"><span>Leadership (Leader tag)</span><span className="text-white font-mono">{PLAN.leadershipUsdt} USDT / network</span></li>
            </ul>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3"><ArrowDownCircle size={16} className="text-movi-purple-light" /><h3 className="font-display font-bold text-white">Withdrawals</h3></div>
            <ul className="space-y-2 text-sm text-movi-muted">
              <li className="flex justify-between"><span>Cooldown</span><span className="text-white font-mono">{PLAN.withdrawCooldownHrs} hours</span></li>
              <li className="flex justify-between"><span>Processing fee</span><span className="text-white font-mono">{PLAN.withdrawFeePct}%</span></li>
              <li className="flex justify-between"><span>Conversion</span><span className="text-white font-mono">1 USDT : {PLAN.conversion} PHP</span></li>
              <li className="flex justify-between"><span>Collect first</span><span className="text-white">Unilevel + Team Power</span></li>
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-movi-purple/10 border border-movi-purple/20 text-movi-purple-light text-xs mt-6">
          <Info size={14} className="mt-0.5 flex-shrink-0" />
          <span>Figures reflect the MoVi plan. On-chain distribution activates when the MoVi contract is deployed.</span>
        </div>

        <div className="text-center mt-10">
          <Link to="/register" className="btn-movi px-8 py-3.5 rounded-xl inline-flex items-center gap-2">
            Join MoVi <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
