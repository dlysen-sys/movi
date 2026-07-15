import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { isAddress } from 'viem'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import RewardsPlan from './pages/RewardsPlan'
import Registration from './pages/Registration'
import Dashboard from './pages/Dashboard'
import Deposit from './pages/Deposit'
import Subscribe from './pages/Subscribe'
import Withdraw from './pages/Withdraw'
import Collect from './pages/Collect'
import Admin from './pages/Admin'

const REFERRER_KEY = 'movi_referrer'

// Capture ?ref=0x... from any URL into localStorage so registration can inherit the sponsor.
function ReferralCapture() {
  const location = useLocation()
  useEffect(() => {
    const ref = new URLSearchParams(location.search).get('ref')
    if (ref && isAddress(ref)) localStorage.setItem(REFERRER_KEY, ref)
  }, [location.search])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen bg-movi-black font-body">
      <ReferralCapture />
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/rewards" element={<RewardsPlan />} />
        <Route path="/register" element={<Registration />} />
        {/* Auth (gated in AuthLayout) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/collect" element={<Collect />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
