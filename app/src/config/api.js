// MoVi license backend client. VITE_API_BASE points at the backend (e.g.
// http://localhost:8090 in dev, or the cloudflared https URL in prod). Empty =
// same-origin '/api'.
export const API_BASE = import.meta.env.VITE_API_BASE || ''

// Must match the backend's auth.js message exactly.
export function authMessage(ts) {
  return `MoVi Community authentication.\nSign to prove wallet ownership.\nTimestamp: ${ts}`
}

export async function apiRequest(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.ok === false) {
    const err = new Error(data.error || `HTTP ${res.status}`)
    err.status = res.status
    throw err
  }
  return data
}
