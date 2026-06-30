import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Relationships from './pages/Relationships'
import RelationshipDetail from './pages/RelationshipDetail'
import MemoryVault from './pages/MemoryVault'
import GiftTracker from './pages/GiftTracker'
import Settings from './pages/Settings'
import AppLayout from './components/AppLayout'

function ProtectedLayout() {
  return (
    <>
      <SignedIn>
        <AppLayout />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<ProtectedLayout />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="relationships" element={<Relationships />} />
        <Route path="relationships/:id" element={<RelationshipDetail />} />
        <Route path="memories" element={<MemoryVault />} />
        <Route path="gifts" element={<GiftTracker />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
