import { Repeat, Lock, Check } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { PLAN } from '../config/content'

export default function Subscribe() {
  return (
    <AuthLayout title="Subscribe" subtitle={`Membership is ${PLAN.subscriptionUsdt} USDT every ${PLAN.subscriptionDays} days.`}>
      {(d) => (
        <div className="max-w-lg">
          <div className="card-glow p-6 space-y-5">
            <div className="relative flex items-center justify-between p-4 rounded-xl bg-movi-surface border border-movi-border">
              <div>
                <div className="text-movi-muted text-xs uppercase tracking-wider">MoVi Membership</div>
                <div className="font-display font-bold text-2xl text-white">{PLAN.subscriptionUsdt} <span className="text-base text-movi-muted font-normal">USDT</span></div>
              </div>
              <span className="chip">every {PLAN.subscriptionDays} days</span>
            </div>

            <ul className="relative space-y-2.5 text-sm">
              {[
                'Unlocks Unilevel bonus eligibility (levels 1–10)',
                'Powers Team Power rewards for your sponsor line',
                'Keeps your account active in the network',
                'Daily direct-referral cash rebate',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-movi-muted">
                  <Check size={16} className="text-movi-green flex-shrink-0 mt-0.5" /> {t}
                </li>
              ))}
            </ul>

            <div className="relative flex items-center justify-between p-3 rounded-xl bg-movi-surface border border-movi-border text-sm">
              <span className="text-movi-muted">Status</span>
              <span className={d.stats.isSubscribed ? 'text-movi-green font-semibold' : 'text-movi-muted'}>
                {d.stats.isSubscribed ? 'Active' : 'Not subscribed'}
              </span>
            </div>

            <button disabled className="relative btn-movi w-full py-4 rounded-xl flex items-center justify-center gap-2 text-lg">
              <Repeat size={18} /> Subscribe — {PLAN.subscriptionUsdt} USDT
            </button>
            <p className="relative flex items-center justify-center gap-1.5 text-xs text-movi-muted">
              <Lock size={12} /> Subscriptions activate once the MoVi contract is deployed.
            </p>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
