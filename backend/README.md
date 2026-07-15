# movi-license — subscription license inventory API

Off-chain inventory of subscription codes for MoVi (GitHub Pages is static, so codes live here,
not on-chain). Admins add/assign codes; each subscriber fetches their own code (masked in the UI).
A code is valid **30 days from assignment**. Node 18+ / Express 4, flat-JSON store, wallet-signature
auth against `movi.sol`. Pattern mirrors the paymongo backend.

## Model
`data/licenses.json` — array of `{ subscription_code, wallet_address, date_time, created_at }`
- **available** ⇔ `wallet_address === "" && date_time === ""`
- **assigned** ⇔ wallet set + `date_time` (unix); valid until `date_time + LICENSE_VALID_DAYS`

## Auth
Client signs `MoVi Community authentication…\nTimestamp: <ts>` (wagmi `signMessage`) and sends
`{ address, signature, ts }`. Backend recovers the signer, checks freshness, then:
- **admin** → `movi.sol checkIsAdmin(signer)` (or `ADMIN_ADDRESSES` allowlist while `MOVI_ADDRESS` unset)
- **user** → signature proves wallet ownership (can only read its own codes)

## API
- `GET  /health`
- `POST /api/license/mine`  `{address,signature,ts}` → this wallet's codes + validity
- `POST /api/license/claim` (opt-in `LICENSE_SELF_CLAIM=true`) → claim next available if subscription active
- `POST /api/admin/inventory` `{...auth, filter?, offset?, limit?}` → list + counts
- `POST /api/admin/codes` `{...auth, codes}` → bulk add (array or newline/comma string)
- `PATCH /api/admin/codes` `{...auth, code, action:'assign'|'clear', wallet?, date_time?}`
- `DELETE /api/admin/codes` `{...auth, code}`

## Run
```bash
cp .env.example .env       # set CORS_ORIGIN, ADMIN_ADDRESSES (pre-deploy) or MOVI_ADDRESS
npm install && npm start   # → http://localhost:8090/health
```

## Docker (NAS, like dbsync)
```bash
docker compose up -d       # NAS: sudo docker compose up -d
docker compose logs -f
```
`data/licenses.json` persists on the host bind-mount. For public HTTPS (so the GitHub Pages
frontend can reach it), enable the `cloudflared` sidecar in `docker-compose.yml` and set
`TUNNEL_TOKEN`, then point the frontend `VITE_API_BASE` at that hostname and set
`CORS_ORIGIN=https://movicommunity.com`.

## Env
`PORT`, `CORS_ORIGIN`, `BSC_RPC_URL`, `MOVI_ADDRESS`, `ADMIN_ADDRESSES`, `LICENSE_VALID_DAYS`,
`LICENSE_SELF_CLAIM`, `RATE_LIMIT_PER_MIN`, `AUTH_MAX_AGE_SEC`, `DATA_FILE`, `TUNNEL_TOKEN`.

docker run cloudflare/cloudflared:latest tunnel --no-autoupdate run --token eyJhIjoiMzMxNjBiNTQ2NDczNDNiZTA3YTY2OWY5ZDhiNmY3YzUiLCJ0IjoiMWUyZGQyZjAtMWMwZi00MzkxLWIwYmQtNDNkNTE5YTM1ZWQ4IiwicyI6Ik5ETmxNVFpqWVRndFltWTVPQzAwTnpNekxUbGtaV1F0WldKa016ZGpOR0k1TkRBdyJ9