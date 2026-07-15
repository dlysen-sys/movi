import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { Shield, Plus, RefreshCw, AlertCircle, Trash2, X, Check, KeyRound } from 'lucide-react'
import ConnectPrompt from '../components/ConnectPrompt'
import Footer from '../components/Footer'
import { useSignedAuth } from '../hooks/useSignedAuth'
import { useIsAdmin } from '../hooks/useIsAdmin'
import { apiRequest } from '../config/api'

const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '—')
const fmtDate = (u) => (u ? new Date(u * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }) : '—')
const FILTERS = ['all', 'available', 'assigned', 'expired']

export default function Admin() {
  const { isConnected } = useAccount()
  const isAdmin = useIsAdmin()
  const { getAuth } = useSignedAuth()

  const [inv, setInv] = useState(null)
  const [counts, setCounts] = useState(null)
  const [filter, setFilter] = useState('all')
  const [newCodes, setNewCodes] = useState('')
  const [assignTo, setAssignTo] = useState({})
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const run = useCallback(async (fn) => {
    setBusy(true); setError(''); setMsg('')
    try { await fn() } catch (e) { setError(e.message || 'Error') } finally { setBusy(false) }
  }, [])

  const load = useCallback((f = filter) => run(async () => {
    const auth = await getAuth()
    const res = await apiRequest('POST', '/api/admin/inventory', { ...auth, filter: f === 'all' ? undefined : f })
    setInv(res.licenses); setCounts(res.counts); setFilter(f)
  }), [getAuth, filter, run])

  const addCodes = () => run(async () => {
    const auth = await getAuth()
    const res = await apiRequest('POST', '/api/admin/codes', { ...auth, codes: newCodes })
    setMsg(`Added ${res.added} code(s)${res.skipped ? `, ${res.skipped} skipped` : ''}.`)
    setNewCodes('')
    await load(filter)
  })

  const patch = (code, action, wallet) => run(async () => {
    const auth = await getAuth()
    await apiRequest('PATCH', '/api/admin/codes', { ...auth, code, action, wallet })
    await load(filter)
  })

  const del = (code) => run(async () => {
    const auth = await getAuth()
    await apiRequest('DELETE', '/api/admin/codes', { ...auth, code })
    await load(filter)
  })

  if (!isConnected) {
    return <div className="pt-16"><ConnectPrompt title="Admin Access" subtitle="Connect the owner/admin wallet to manage the license inventory." /></div>
  }
  if (!isAdmin) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <Shield size={40} className="text-movi-red mx-auto mb-4" />
          <h2 className="font-display font-bold text-xl text-white mb-2">Not authorized</h2>
          <p className="text-movi-muted text-sm">This wallet is not a MoVi admin. Admin access is granted on the MoVi contract (checkIsAdmin).</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={22} className="text-movi-green" />
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">License Inventory</h1>
        </div>
        <p className="text-movi-muted text-sm mb-6">Add subscription codes and assign them to wallets. Codes are valid 30 days from assignment.</p>

        {/* counts */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { k: 'total', label: 'Total', c: 'text-white' },
            { k: 'available', label: 'Available', c: 'text-movi-purple-light' },
            { k: 'assigned', label: 'Assigned', c: 'text-movi-green' },
            { k: 'expired', label: 'Expired', c: 'text-movi-red' },
          ].map((x) => (
            <div key={x.k} className="card p-4 text-center">
              <div className={`font-mono font-bold text-2xl ${x.c}`}>{counts?.[x.k] ?? '—'}</div>
              <div className="text-movi-muted text-xs">{x.label}</div>
            </div>
          ))}
        </div>

        {/* add codes */}
        <div className="card-glow p-5 mb-6">
          <div className="relative flex items-center gap-2 mb-3"><Plus size={16} className="text-movi-green" /><h3 className="font-display font-bold text-white">Add codes</h3></div>
          <textarea
            value={newCodes}
            onChange={(e) => setNewCodes(e.target.value)}
            placeholder="Paste codes — one per line or comma-separated&#10;MOVI-XXXX-1111&#10;MOVI-XXXX-2222"
            rows={3}
            className="relative w-full bg-movi-surface border border-movi-border rounded-xl px-4 py-3 text-white font-mono text-sm outline-none focus:border-movi-purple/50"
          />
          <div className="relative flex items-center justify-between mt-3">
            <span className="text-xs text-movi-green">{msg}</span>
            <button onClick={addCodes} disabled={busy || !newCodes.trim()} className="btn-movi px-5 py-2.5 rounded-xl text-sm flex items-center gap-1.5 disabled:opacity-50">
              <Plus size={15} /> Add
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-movi-red/10 border border-movi-red/20 text-movi-red text-xs mb-4">
            <AlertCircle size={13} className="mt-0.5 flex-shrink-0" /> {error}
          </div>
        )}

        {/* filter + refresh */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => load(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-movi-purple/20 text-movi-purple-light border border-movi-purple/30' : 'bg-movi-surface text-movi-muted border border-movi-border hover:text-white'}`}>{f}</button>
            ))}
          </div>
          <button onClick={() => load(filter)} disabled={busy} className="flex items-center gap-1.5 text-xs text-movi-muted hover:text-white disabled:opacity-50">
            <RefreshCw size={13} className={busy ? 'animate-spin' : ''} /> {inv === null ? 'Load' : 'Refresh'}
          </button>
        </div>

        {/* inventory table */}
        <div className="card overflow-hidden">
          {inv === null ? (
            <div className="p-8 text-center text-movi-muted text-sm">Click Load to fetch the inventory (signs with your wallet).</div>
          ) : inv.length === 0 ? (
            <div className="p-8 text-center text-movi-muted text-sm flex flex-col items-center gap-2"><KeyRound size={22} /> No codes for this filter.</div>
          ) : (
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-movi-surface text-movi-muted text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-2.5 font-semibold">Code</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Status</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Wallet</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Valid until</th>
                    <th className="text-right px-4 py-2.5 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inv.map((r) => (
                    <tr key={r.subscription_code} className="border-t border-movi-border">
                      <td className="px-4 py-2.5 font-mono text-white">{r.subscription_code}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                          r.status === 'assigned' ? 'bg-movi-green/10 text-movi-green' : r.status === 'expired' ? 'bg-movi-red/10 text-movi-red' : 'bg-movi-purple/10 text-movi-purple-light'
                        }`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-movi-muted">{r.wallet_address ? short(r.wallet_address) : '—'}</td>
                      <td className="px-4 py-2.5 text-movi-muted">{fmtDate(r.valid_until)}</td>
                      <td className="px-4 py-2.5">
                        {r.status === 'available' ? (
                          <div className="flex items-center gap-1.5 justify-end">
                            <input
                              value={assignTo[r.subscription_code] || ''}
                              onChange={(e) => setAssignTo((s) => ({ ...s, [r.subscription_code]: e.target.value }))}
                              placeholder="0x wallet"
                              className="w-28 bg-movi-surface border border-movi-border rounded-lg px-2 py-1 text-xs font-mono text-white outline-none focus:border-movi-purple/50"
                            />
                            <button onClick={() => patch(r.subscription_code, 'assign', assignTo[r.subscription_code])} disabled={busy} className="p-1.5 rounded-lg bg-movi-green/15 text-movi-green hover:bg-movi-green/25" title="Assign"><Check size={14} /></button>
                            <button onClick={() => del(r.subscription_code)} disabled={busy} className="p-1.5 rounded-lg bg-movi-red/10 text-movi-red hover:bg-movi-red/20" title="Delete"><Trash2 size={14} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 justify-end">
                            <button onClick={() => patch(r.subscription_code, 'clear')} disabled={busy} className="p-1.5 rounded-lg bg-movi-surface border border-movi-border text-movi-muted hover:text-white" title="Clear assignment"><X size={14} /></button>
                            <button onClick={() => del(r.subscription_code)} disabled={busy} className="p-1.5 rounded-lg bg-movi-red/10 text-movi-red hover:bg-movi-red/20" title="Delete"><Trash2 size={14} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
