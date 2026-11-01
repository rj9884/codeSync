import { Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from './components/landing/LandingPage'
import { EditorPage } from './pages/Editor'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/editor/new" element={<EditorPage />} />
      <Route path="/editor/:roomId" element={<EditorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App