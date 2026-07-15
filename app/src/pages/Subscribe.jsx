import { useState, useCallback } from 'react'
import { Repeat, Lock, Check, KeyRound, RefreshCw, AlertCircle } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import MaskedValue from '../components/MaskedValue'
import { PLAN } from '../config/content'
import { useSignedAuth } from '../hooks/useSignedAuth'
import { apiRequest } from '../config/api'

const fmtDate = (unix) =>
  unix ? new Date(unix * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

const badge = (status) =>
  status === 'assigned'
    ? 'bg-movi-green/10 text-movi-green border-movi-green/20'
    : status === 'expired'
      ? 'bg-movi-red/10 text-movi-red border-movi-red/20'
      : 'bg-movi-purple/10 text-movi-purple-light border-movi-purple/20'

export default function Subscribe() {
  const { getAuth } = useSignedAuth()
  const [codes, setCodes] = useState(null) // null = not loaded, [] = none
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const auth = await getAuth() // prompts a wallet signature
      const res = await apiRequest('POST', '/api/license/mine', auth)
      setCodes(res.licenses || [])
    } catch (e) {
      setError(e.message === 'WALLET_NOT_CONNECTED' ? 'Connect your wallet first.' : e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [getAuth])

  return (
    <AuthLayout title="Subscribe" subtitle={`Membership is ${PLAN.subscriptionUsdt} USDT every ${PLAN.subscriptionDays} days.`}>
      {(d) => (
        <div className="max-w-lg space-y-6">
          {/* ── Subscription panel ── */}
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

          {/* ── Subscription license code(s) ── */}
          <div className="card-glow p-6">
            <div className="relative flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <KeyRound size={18} className="text-movi-green" />
                <h3 className="font-display font-bold text-white">Your Subscription Code</h3>
              </div>
              <button
                onClick={load}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs text-movi-purple-light hover:text-white disabled:opacity-50"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> {codes === null ? 'Load' : 'Refresh'}
              </button>
            </div>

            {error && (
              <div className="relative flex items-start gap-2 p-3 rounded-lg bg-movi-red/10 border border-movi-red/20 text-movi-red text-xs mb-3">
                <AlertCircle size={13} className="mt-0.5 flex-shrink-0" /> {error}
              </div>
            )}

            {codes === null && !error && (
              <p className="relative text-movi-muted text-sm">Sign with your wallet to view your admin-issued license code (kept private to you).</p>
            )}

            {codes !== null && codes.length === 0 && (
              <p className="relative text-movi-muted text-sm">No code yet — your license key is issued by the admin once your subscription is processed.</p>
            )}

            {codes && codes.map((c) => (
              <div key={c.subscription_code} className="relative rounded-xl border border-movi-border bg-movi-surface p-4 mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${badge(c.status)}`}>{c.status}</span>
                  <span className="text-movi-muted text-xs">valid until {fmtDate(c.valid_until)}</span>
                </div>
                <MaskedValue value={c.subscription_code} />
              </div>
            ))}

            <p className="relative flex items-center gap-1.5 text-[11px] text-movi-muted mt-3">
              <Lock size={11} /> Private — fetched only with your wallet signature.
            </p>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
