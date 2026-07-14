# MoVi — Milestones

**Project Status:** 🟢 Website built (all routes) — brand theme + comp-plan pages live; contract pending
**Last Updated:** 2026-07-15
**Next Session Focus:** Write the MoVi contract (chain/src/movi/) + wire on-chain reads/writes
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
- [x] Public: Landing one-pager (hero, movies gallery, rewards teaser, FAQ, contact), Rewards Plan, Registration
- [x] Auth: Dashboard, Deposit, Subscribe, Withdraw, Collect (functional UI, placeholder data)
- [x] Comp plan encoded in `src/config/content.js` (registration/subscription, direct/unilevel/team-power/leadership, auto-compress + by-3 explainers)
- [ ] **MoVi smart contract** (chain/src/movi/) — register, subscribe, unilevel auto-compress, team-power-by-3, leadership, withdraw
- [ ] Wire real reads/writes (replace useMoviUser placeholders + demo localStorage registration)

### ⏳ Phase 4: Ship
**Status:** NOT STARTED
- [ ] Security review + local/testnet dogfood
- [ ] GitHub repo + deploy (movi.community)

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
