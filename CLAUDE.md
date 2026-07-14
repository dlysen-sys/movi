# MoVi — Development Guide

**Status:** 🟡 In Development (kicked off 2026-07-14)
**Tech Stack:** React 19 + Vite + Tailwind v4 · wagmi v2 + viem · BSC mainnet (chain 56)
**Ship Target:** 2026-07-24 (10-day cadence)

## Overview
> **TODO (owner):** 2–3 sentence description of what MoVi is and does. Placeholder until confirmed —
> a Web3 dApp on BNB Smart Chain (React 19 + wagmi + viem), scaffolded from the workspace's
> composable templates.

## GitHub Repository Setup
- Create a dedicated GitHub repository for this project (not yet created).
- Link the repository to the local project folder (`projects/movi/`).
- Store the GitHub classic PAT in the project `.env` as `GITHUB_TOKEN` or `GH_TOKEN`.
- Token needs `repo`/`public_repo`, plus `workflow` if using Pages/Actions deploy.
- See `templates/github-setup-template.md`.

## Template Stack (apply in order)
1. `core-technology-template.md` — React 19 + Vite + Tailwind v4 (base app). **(prerequisite)**
2. `design-template.md` — theme + dark/light UI via CSS tokens. **(prerequisite)**
3. `web3-integration-template.md` — wagmi + viem + Reown AppKit (needs a Reown `projectId`).

Related skills: `/tailwind-ui`, `/wagmi`, `/blockchain-developer`.

## Conventions (inherited from the workspace)
- All contract config in `src/config/contracts.js` — never hardcode addresses/ABIs elsewhere.
- `src/config/wagmi.js` exports `BSC_CHAIN_ID`; import it for chain checks (not the literal 56).
- `npm run build` auto-produces a web-safe `dist.zip` via the shared `postbuild` hook
  (dirs 755 / files 644) for cPanel/LiteSpeed uploads from the SMB workspace.

## Phases
### Phase 1: Foundation
- [ ] Scaffold with `core-technology-template.md` (Vite + React 19 + Tailwind v4); clean `npm run build`
- [ ] Apply `design-template.md` (theme tokens + dark/light toggle)
- [ ] Define product scope + routes (fill in the Overview above)

### Phase 2: Web3 Integration
- [ ] wagmi + viem config (`src/config/wagmi.js`), Reown projectId, BSC connectors
- [ ] Wallet connect + network gating
- [ ] Contract config + read/write hooks (`src/config/contracts.js`; see `contract-integration-template.md`)

### Phase 3: Core Features
- [ ] (define once scope is confirmed)

### Phase 4: Ship
- [ ] Security review + testnet happy/failure paths
- [ ] GitHub repo + deploy (`github-setup-template.md`)

## Current State
Scaffold folder created; no code yet. Next: confirm the MoVi product scope, then apply
`core-technology-template.md`.

## Next Phase
Fill the Overview, then scaffold the base app (core + design templates).
