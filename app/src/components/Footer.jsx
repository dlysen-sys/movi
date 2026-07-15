import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-movi-border bg-movi-black/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Logo />
            <p className="text-movi-muted text-sm mt-3 max-w-xs">
              Let's Mov'It Together. Watch, refer, and earn with the MoVi community on BNB Smart Chain.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <Link to="/" className="text-movi-muted hover:text-white transition-colors">Home</Link>
            <Link to="/rewards" className="text-movi-muted hover:text-white transition-colors">Rewards Plan</Link>
            <Link to="/register" className="text-movi-muted hover:text-white transition-colors">Register</Link>
            <a href="#contact" className="text-movi-muted hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-movi-border flex flex-col sm:flex-row justify-between gap-2 text-xs text-movi-muted">
          <span>© {new Date().getFullYear()} MoVi Community. All rights reserved.</span>
          <span>Built on BNB Smart Chain</span>
        </div>
      </div>
    </footer>
  )
}
