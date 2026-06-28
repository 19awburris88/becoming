import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Letters from './pages/Letters'
import WhenYoureReady from './pages/WhenYoureReady'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/letters" element={<Letters />} />
        <Route path="/when-youre-ready" element={<WhenYoureReady />} />
      </Routes>
    </BrowserRouter>
  )
}
