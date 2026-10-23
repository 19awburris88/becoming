import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Home from './pages/Home'
import Letters from './pages/Letters'
import WhenYoureReady from './pages/WhenYoureReady'
import './App.css'

export default function App() {
  return (
    // reducedMotion="user": with the phone's Reduce Motion on, slides become fades
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/letters" element={<Letters />} />
          <Route path="/when-youre-ready" element={<WhenYoureReady />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
