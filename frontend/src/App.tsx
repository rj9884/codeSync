import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { LandingPage } from './components/landing/LandingPage'
import { CollaboratePage } from './pages/Collaborate'
import { EditorPage } from './pages/Editor'

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid #27272a',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/collaborate" element={<CollaboratePage />} />
        <Route path="/Collaborate" element={<CollaboratePage />} />
        <Route path="/editor" element={<CollaboratePage />} />
        <Route path="/Editor" element={<CollaboratePage />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
        <Route path="/Editor/:roomId" element={<EditorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
