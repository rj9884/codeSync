import { GalleryVerticalEnd } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LoginForm } from '../components/landing/LoginForm'

export function CollaboratePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0b0c10] p-6 md:p-10 text-white">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-100"></div>

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 self-center font-bold text-xl text-gray-200 hover:text-white transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-black">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span>&lt;CodeSync/&gt;</span>
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}
