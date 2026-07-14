import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import {
  Play, ArrowRight, UserPlus, Layers, Users, Crown, ChevronDown,
  Mail, Send, Sparkles, ShieldCheck, Clock,
} from 'lucide-react'
import Logo from '../components/Logo'
import Footer from '../components/Footer'
import { PLAN, REWARDS, FAQ, MOVIES, phpFromUsdt } from '../config/content'

const ICONS = { UserPlus, Layers, Users, Crown }

function RewardIcon({ name, className }) {
  const I = ICONS[name] ?? Sparkles
  return <I className={className} />
}

export default function Landing() {
  const { isConnected } = useAccount()
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="pt-16">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-glow" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="flex justify-center mb-8">
            <div className="animate-float">
              <Logo size={96} withWord={false} />
            </div>
          </div>
          <div className="chip mx-auto mb-5">
            <Sparkles size={12} /> Community-powered movie rewards
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl leading-tight text-white">
            Mo<span className="movi-text">Vi</span> Community
          </h1>
          <p className="mt-4 font-display font-semibold text-xl sm:text-2xl purple-text">
            Let's Mov'It Together
          </p>
          <p className="mt-5 text-movi-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Watch, refer, and earn together. Join MoVi on BNB Smart Chain — direct referral rebates,
            a 10-level unilevel bonus, and team power rewards, all settled on-chain.
          </p>
          <div className="mt-9 flex flex-col xs:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn-movi px-8 py-3.5 rounded-xl flex items-center gap-2 w-full xs:w-auto justify-center">
              {isConnected ? 'Register Now' : 'Get Started'} <ArrowRight size={16} />
            </Link>
            <Link to="/rewards" className="btn-outline px-8 py-3.5 rounded-xl flex items-center gap-2 w-full xs:w-auto justify-center">
              View Rewards Plan
            </Link>
          </div>

          {/* quick facts */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { label: 'Registration', value: `${PLAN.registrationUsdt} USDT`, sub: `₱${phpFromUsdt(PLAN.registrationUsdt).toLocaleString()}` },
              { label: 'Subscription', value: `${PLAN.subscriptionUsdt} USDT`, sub: `every ${PLAN.subscriptionDays} days` },
              { label: 'Direct Referral', value: `${PLAN.directReferralUsdt} USDT`, sub: 'per direct' },
              { label: 'Unilevel', value: `${PLAN.unilevelTotalUsdt} USDT`, sub: '10 levels' },
            ].map((s) => (
              <div key={s.label} className="card-glow p-4">
                <div className="relative font-mono font-bold text-lg text-white">{s.value}</div>
                <div className="relative text-movi-green text-[11px] font-semibold">{s.sub}</div>
                <div className="relative text-movi-muted text-[11px] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Movies ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Now on MoVi</h2>
            <p className="text-movi-muted text-sm mt-1">A taste of the community library.</p>
          </div>
          <span className="hidden sm:inline chip"><Play size={11} /> Gallery</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {MOVIES.map((m, i) => (
            <div key={m.title} className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-movi-border bg-movi-card cursor-pointer">
              <div className={`absolute inset-0 ${i % 2 ? 'bg-green-gradient' : 'bg-purple-gradient'} opacity-25 group-hover:opacity-40 transition-opacity`} />
              <div className="absolute inset-0 grid-bg opacity-30" />
              <span className="absolute top-3 left-3 chip !bg-movi-black/60 !text-white">{m.tag}</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-movi-black/50 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-movi-purple/40 transition-all">
                  <Play size={22} className="text-white ml-0.5" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-movi-black to-transparent">
                <div className="font-display font-bold text-white leading-tight">{m.title}</div>
                <div className="text-movi-muted text-xs">{m.genre}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rewards teaser ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Four ways to earn</h2>
          <p className="text-movi-muted text-sm mt-2">
            Every active subscription powers the community rewards. Here's how members earn.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REWARDS.map((r) => (
            <div key={r.key} className="card-glow p-5 flex flex-col">
              <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                r.accent === 'green' ? 'bg-movi-green/10 text-movi-green' : 'bg-movi-purple/10 text-movi-purple-light'
              }`}>
                <RewardIcon name={r.icon} className="w-5 h-5" />
              </div>
              <div className="relative font-display font-bold text-white">{r.title}</div>
              <div className={`relative font-mono font-bold text-lg ${r.accent === 'green' ? 'text-movi-green' : 'text-movi-purple-light'}`}>{r.amount}</div>
              <div className="relative text-movi-muted text-xs mt-0.5">{r.tagline}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/rewards" className="btn-outline px-6 py-3 rounded-xl inline-flex items-center gap-2">
            See the full Rewards Plan <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-white text-center mb-8">Frequently asked</h2>
        <div className="space-y-3">
          {FAQ.map((f, i) => {
            const open = openFaq === i
            return (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(open ? -1 : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="font-display font-semibold text-white text-sm sm:text-base">{f.q}</span>
                  <ChevronDown size={18} className={`text-movi-purple-light flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && <div className="px-5 pb-4 text-movi-muted text-sm leading-relaxed">{f.a}</div>}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section id="contact" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card-glow p-8 sm:p-10 text-center">
          <h2 className="relative font-display font-bold text-2xl sm:text-3xl text-white">Get in touch</h2>
          <p className="relative text-movi-muted text-sm mt-2 max-w-xl mx-auto">
            Questions about MoVi or the rewards plan? Reach the community team.
          </p>
          <div className="relative mt-7 flex flex-col xs:flex-row items-center justify-center gap-3">
            <a href="mailto:hello@movi.community" className="btn-movi px-6 py-3 rounded-xl inline-flex items-center gap-2 w-full xs:w-auto justify-center">
              <Mail size={16} /> hello@movi.community
            </a>
            <a href="#" className="btn-outline px-6 py-3 rounded-xl inline-flex items-center gap-2 w-full xs:w-auto justify-center">
              <Send size={16} /> Telegram
            </a>
          </div>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-movi-muted">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} className="text-movi-green" /> On-chain & transparent</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={13} className="text-movi-purple-light" /> {PLAN.withdrawCooldownHrs}h withdrawals</span>
            <span className="inline-flex items-center gap-1.5"><Users size={13} className="text-movi-green" /> Community-first</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
