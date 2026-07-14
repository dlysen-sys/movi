// MoVi mark — M1 monogram (matches the favicon) + optional wordmark.
export default function Logo({ size = 34, withWord = true, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="flex-shrink-0">
        <defs>
          <linearGradient id="moviLogoG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8B2FE0" />
            <stop offset="1" stopColor="#7ED321" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="#07060C" />
        <circle cx="32" cy="32" r="27" fill="none" stroke="url(#moviLogoG)" strokeWidth="2.5" />
        <path d="M15 47 V21 l10 13 10-13 V47" fill="none" stroke="#8B2FE0" strokeWidth="5"
          strokeLinejoin="round" strokeLinecap="round" />
        <path d="M40 26 l7-5 V47" fill="none" stroke="#7ED321" strokeWidth="5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {withWord && (
        <span className="font-display font-extrabold text-xl tracking-tight leading-none">
          <span className="text-white">Mo</span>
          <span className="movi-text">Vi</span>
        </span>
      )}
    </span>
  )
}
