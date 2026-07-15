import { useState } from 'react'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'

// Read-only masked display of a secret string (e.g. a license key) with reveal + copy.
export default function MaskedValue({ value = '', className = '' }) {
  const [shown, setShown] = useState(false)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* ignore */ }
  }

  return (
    <div className={`flex items-center bg-movi-black/40 border border-movi-border rounded-lg overflow-hidden ${className}`}>
      <input
        type={shown ? 'text' : 'password'}
        value={value}
        readOnly
        className="flex-1 px-3 py-2 bg-transparent text-white font-mono text-sm outline-none tracking-wider"
      />
      <button onClick={() => setShown((s) => !s)} className="px-2.5 py-2 text-movi-muted hover:text-movi-purple-light transition-colors" title={shown ? 'Hide' : 'Reveal'}>
        {shown ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
      <button onClick={copy} className="px-2.5 py-2 text-movi-muted hover:text-movi-green transition-colors border-l border-movi-border" title="Copy">
        {copied ? <Check size={15} className="text-movi-green" /> : <Copy size={15} />}
      </button>
    </div>
  )
}
