# MoVi — Milestones

**Project Status:** 🟢 LIVE at movicommunity.com (frontend) · movi.sol written · on-chain wiring pending
**Last Updated:** 2026-07-15
**Repo:** github.com/dlysen-sys/movi · **Live:** https://movicommunity.com
**Next Session Focus:** Deploy MoVi contract + wire on-chain; register MoVi Reown ID + allowlist domain
**Ship Target:** 2026-07-24 (10-day cadence)
**Stack:** React 19 + Vite + Tailwind v4 · wagmi v2 + viem · BNB Smart Chain

---

## Phase Breakdown

### ✅ Phase 1: Foundation
**Status:** COMPLETE
- [x] Project kickoff — folder structure, CLAUDE.md, MILESTONES, decision logged
- [x] Base app scaffolded (Vite + React 19 + Tailwind); clean `npm run build` (6,781 modules)
- [x] MoVi brand theme — neon purple #8B2FE0 + lime green #7ED321 on black, from the logo
- [x] Product scope defined (compensation plan + routes in content.js)

### ✅ Phase 2: Web3 Integration
**Status:** COMPLETE (wallet layer; contract calls pending deploy)
- [x] wagmi + viem config; connectors (injected / WalletConnect / Coinbase)
- [x] Networks: bsc / bscTestnet / local (shared NAS anvil 192.168.100.79:8545) — currently on `local`
- [x] Wallet connect + network gating (Navbar) + auth gating (AuthLayout: connect + registered)

### 🟡 Phase 3: Core Features
**Status:** UI COMPLETE — on-chain wiring pending contract
- [x] License inventory: **`backend/`** service (Express 4, JSON store, wallet-signature auth vs
      `movi.sol` checkIsAdmin + `ADMIN_ADDRESSES` fallback) — add/assign/mine/claim, Docker like paymongo.
      Smoke-tested end-to-end (add→assign→mine; non-admin→403, spoofed sig→401).
- [x] Frontend: Subscribe page shows the user's admin-issued code **masked** (reveal/copy, 30-day validity);
      `/admin` panel manages the inventory (admin-gated); backend enforces auth.
- [x] Public: Landing one-pager (hero, movies gallery, rewards teaser, FAQ, contact), Rewards Plan, Registration
- [x] Auth: Dashboard, Deposit, Subscribe, Withdraw, Collect (functional UI, placeholder data)
- [x] Comp plan encoded in `src/config/content.js` (registration/subscription, direct/unilevel/team-power/leadership, auto-compress + by-3 explainers)
- [ ] **MoVi smart contract** (chain/src/movi/) — register, subscribe, unilevel auto-compress, team-power-by-3, leadership, withdraw
- [ ] Wire real reads/writes (replace useMoviUser placeholders + demo localStorage registration)

### 🟡 Phase 4: Ship
**Status:** IN PROGRESS — frontend LIVE
- [x] GitHub repo created: **github.com/dlysen-sys/movi** (public) + `main` pushed
- [x] Deployed to GitHub Pages (gh-pages branch, `movicommunity.com` CNAME) — **LIVE at
      https://movicommunity.com**, HTTPS enforced, DNS already pointed to GitHub Pages IPs
- [x] SPA 404.html fallback for client-side routing on Pages
- [ ] ⚠️ Register MoVi's own Reown project ID + allowlist `movicommunity.com` (console 403:
      shared placeholder projectId rejects the origin — wallet-connect works but "unverified")
- [ ] Deploy MoVi contract + wire on-chain (auth pages still placeholder)
- [ ] Security review + local/testnet dogfood

---

## Key Accomplishments This Session (2026-07-14)
- ✅ Kicked off MoVi: `projects/movi/{sessions,src,docs}`, project CLAUDE.md, MILESTONES,
  first session file; kickoff decision logged in `decisions/log.md`.

## Known Limitations
1. **Product scope undefined** — CLAUDE.md Overview is a placeholder; MoVi's purpose/features
   need confirming before Phase 1 UI work.
2. GitHub repo not created; no Reown projectId assigned yet.

## Known Limitations
1. **On-chain logic not built** — auth pages show placeholder (0) data; registration is a localStorage
   demo (`useMoviUser`). Needs the MoVi contract + real reads/writes.
2. Real logo PNG not embedded — site uses an SVG "M1" monogram (`Logo.jsx` + favicon) matching the
   brand. Drop the uploaded PNG at `public/logo.png` to use it in the hero.
3. Reown project ID is a shared placeholder (`wagmi.js`) — register MoVi's own.
4. `contracts.js` has `MOVI_ADDRESS = 0x0` + empty ABI (TODO after deploy).

## Next Session Checklist
- [ ] Write the MoVi contract in `chain/src/movi/` (register, subscribe, unilevel auto-compress,
      team-power-by-3, leadership, withdraw 10%/24h) + Foundry tests
- [ ] Deploy to the shared node (`http://192.168.100.79:8545`); set `MOVI_ADDRESS` + `MOVI_ABI`
- [ ] Replace `useMoviUser` placeholders with contract reads; wire register/subscribe/withdraw/collect
- [ ] (Owner) drop real logo at `public/logo.png`; register MoVi Reown project ID; create GitHub repo

---

**Last Session:** 2026-07-15
**Project Owner:** Dangal Macatangay
**Status:** ✅ On Track
