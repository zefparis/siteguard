import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home }      from './pages/Home'
import { Scan }      from './pages/Scan'
import { Enroll }    from './pages/Enroll'
import { Workers }   from './pages/Workers'
import { Blacklist } from './pages/Blacklist'
import { Events }    from './pages/Events'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/scan"      element={<Scan />} />
        <Route path="/enroll"    element={<Enroll />} />
        <Route path="/workers"   element={<Workers />} />
        <Route path="/blacklist" element={<Blacklist />} />
        <Route path="/events"    element={<Events />} />
      </Routes>
    </BrowserRouter>
  )
}
