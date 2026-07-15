import { useState, useMemo } from 'react'
import { Calculator, UserPlus, Users, Layers, TrendingUp, ChevronDown, Info } from 'lucide-react'
import { PLAN, phpFromUsdt } from '../config/content'

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Number.isFinite(n) ? n : lo))
const fmt = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 2 })
const fmtInt = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 0 })

// Projected-income model (a theoretical potential, not a guarantee):
// - Direct Referral: 10 USDT per direct, each subscribing every month.
// - Team Power: 1.5 USDT per 3 direct subscriptions (metered by 3, carry across months).
// - Unilevel: a D-wide, 10-level matrix (each member duplicates with D directs),
//   1 USDT per account per subscription.
export default function IncomeCalculator() {
  const [directs, setDirects] = useState(3)
  const [months, setMonths] = useState(12)
  const [showLevels, setShowLevels] = useState(false)

  const r = useMemo(() => {
    const D = clamp(Math.round(directs), 0, 15)
    const M = clamp(Math.round(months), 1, 60)

    const direct = D * PLAN.directReferralUsdt * M
    const directSubs = D * M
    const teamGroups = Math.floor(directSubs / PLAN.teamPowerPer)
    const teamPower = teamGroups * PLAN.teamPowerUsdt

    const levels = Array.from({ length: PLAN.unilevelLevels }, (_, i) => {
      const lvl = i + 1
      const accounts = Math.pow(D, lvl)
      return { lvl, accounts, monthly: accounts * PLAN.unilevelUsdt }
    })
    const uniAccounts = levels.reduce((s, l) => s + l.accounts, 0)
    const unilevel = uniAccounts * PLAN.unilevelUsdt * M

    const total = direct + teamPower + unilevel
    return { D, M, direct, teamPower, teamGroups, unilevel, uniAccounts, levels, total }
  }, [directs, months])

  const rows = [
    { key: 'direct', label: 'Direct Referral', sub: `${PLAN.directReferralUsdt} USDT × ${r.D} directs × ${r.M} mo`, value: r.direct, icon: UserPlus, accent: 'purple' },
    { key: 'team', label: 'Team Power Bonus', sub: `${PLAN.teamPowerUsdt} USDT × ${r.teamGroups} groups of 3`, value: r.teamPower, icon: Users, accent: 'green' },
    { key: 'uni', label: 'Unilevel Bonus', sub: `1 USDT × ${fmtInt(r.uniAccounts)} accounts × ${r.M} mo`, value: r.unilevel, icon: Layers, accent: 'purple' },
  ]

  return (
    <div className="card-glow p-6 sm:p-8">
      <div className="relative flex items-center gap-2 mb-1">
        <Calculator size={18} className="text-movi-green" />
        <h2 className="font-display font-bold text-xl text-white">Income Calculator</h2>
      </div>
      <p className="relative text-movi-muted text-sm mb-6">
        Project your potential MoVi income. Enter your directs and how long the team stays subscribed.
      </p>

      {/* Inputs */}
      <div className="relative grid sm:grid-cols-2 gap-4 mb-6">
        <Field label="Direct referrals" value={directs} onChange={setDirects} min={0} max={15} presets={[3, 5, 10]} />
        <Field label="Months subscribed" value={months} onChange={setMonths} min={1} max={60} presets={[1, 6, 12]} suffix="mo" />
      </div>

      {/* Breakdown */}
      <div className="relative space-y-3">
        {rows.map((row) => {
          const green = row.accent === 'green'
          return (
            <div key={row.key} className="flex items-center gap-3 p-4 rounded-xl bg-movi-surface border border-movi-border">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${green ? 'bg-movi-green/10 text-movi-green' : 'bg-movi-purple/10 text-movi-purple-light'}`}>
                <row.icon size={18} />
              </div>
              <div className="min-w-0">
                <div className="font-display font-semibold text-white text-sm">{row.label}</div>
                <div className="text-movi-muted text-[11px] truncate">{row.sub}</div>
              </div>
              <div className="ml-auto text-right">
                <div className={`font-mono font-bold ${green ? 'text-movi-green' : 'text-movi-purple-light'}`}>{fmt(row.value)} <span className="text-xs text-movi-muted">USDT</span></div>
                <div className="text-movi-muted text-[11px]">₱{fmt(phpFromUsdt(row.value))}</div>
              </div>
            </div>
          )
        })}

        {/* Total */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-movi-gradient/10 border border-movi-purple/30 bg-purple-gradient/5">
          <div className="w-10 h-10 rounded-xl bg-movi-gradient flex items-center justify-center flex-shrink-0">
            <TrendingUp size={18} className="text-movi-black" />
          </div>
          <div>
            <div className="font-display font-bold text-white">Projected Total</div>
            <div className="text-movi-muted text-[11px]">{r.D} directs · {r.M} months</div>
          </div>
          <div className="ml-auto text-right">
            <div className="font-mono font-black text-xl movi-text">{fmt(r.total)} USDT</div>
            <div className="text-movi-muted text-xs">≈ ₱{fmt(phpFromUsdt(r.total))}</div>
          </div>
        </div>
      </div>

      {/* Unilevel per-level breakdown */}
      <button onClick={() => setShowLevels((s) => !s)} className="relative mt-4 flex items-center gap-1.5 text-xs text-movi-purple-light hover:underline">
        <ChevronDown size={14} className={`transition-transform ${showLevels ? 'rotate-180' : ''}`} />
        {showLevels ? 'Hide' : 'Show'} unilevel matrix (level 1–10)
      </button>
      {showLevels && (
        <div className="relative mt-3 overflow-x-auto rounded-xl border border-movi-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-movi-surface text-movi-muted text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-2 font-semibold">Level</th>
                <th className="text-right px-4 py-2 font-semibold">Accounts (Dˡ)</th>
                <th className="text-right px-4 py-2 font-semibold">USDT / month</th>
                <th className="text-right px-4 py-2 font-semibold">× {r.M} mo</th>
              </tr>
            </thead>
            <tbody>
              {r.levels.map((l) => (
                <tr key={l.lvl} className="border-t border-movi-border">
                  <td className="px-4 py-2 text-white font-mono">L{l.lvl}</td>
                  <td className="px-4 py-2 text-right font-mono text-movi-muted">{fmtInt(l.accounts)}</td>
                  <td className="px-4 py-2 text-right font-mono text-white">{fmt(l.monthly)}</td>
                  <td className="px-4 py-2 text-right font-mono text-movi-purple-light">{fmt(l.monthly * r.M)}</td>
                </tr>
              ))}
              <tr className="border-t border-movi-border bg-movi-surface">
                <td className="px-4 py-2 text-movi-muted font-semibold">Total</td>
                <td className="px-4 py-2 text-right font-mono text-white">{fmtInt(r.uniAccounts)}</td>
                <td className="px-4 py-2 text-right font-mono text-white">{fmt(r.uniAccounts * PLAN.unilevelUsdt)}</td>
                <td className="px-4 py-2 text-right font-mono text-movi-green font-bold">{fmt(r.unilevel)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="relative flex items-start gap-2 mt-5 text-[11px] text-movi-muted leading-relaxed">
        <Info size={13} className="mt-0.5 flex-shrink-0 text-movi-purple-light" />
        <span>
          Projection = maximum potential. It assumes every direct — and their full {r.D}-wide downline, 10 levels deep —
          subscribes each month and stays active. Real income depends on actual team activity. Team Power meters direct
          subscriptions in groups of {PLAN.teamPowerPer}; Unilevel auto-compress always distributes the full {PLAN.unilevelTotalUsdt} USDT.
        </span>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, min, max, presets, suffix }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-movi-muted uppercase tracking-wider mb-2">{label}</label>
      <div className="flex items-center bg-movi-surface border border-movi-border rounded-xl overflow-hidden focus-within:border-movi-purple/50">
        <button onClick={() => onChange(clamp(Number(value) - 1, min, max))} className="px-4 py-3 text-movi-muted hover:text-white text-lg font-mono">−</button>
        <input
          type="number" min={min} max={max} value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value), min, max))}
          className="flex-1 w-full text-center bg-transparent text-white font-mono font-bold text-lg outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && <span className="pr-2 text-movi-muted text-sm">{suffix}</span>}
        <button onClick={() => onChange(clamp(Number(value) + 1, min, max))} className="px-4 py-3 text-movi-muted hover:text-white text-lg font-mono">+</button>
      </div>
      <div className="flex gap-2 mt-2">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              Number(value) === p ? 'bg-movi-purple/20 text-movi-purple-light border border-movi-purple/30' : 'bg-movi-card text-movi-muted border border-movi-border hover:text-white'
            }`}
          >
            {p}{suffix ? suffix : ''}
          </button>
        ))}
      </div>
    </div>
  )
}
