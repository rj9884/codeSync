import { Code, GalleryVerticalEnd } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LoginForm } from '../components/landing/LoginForm'

export function CollaboratePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black p-6 md:p-10 text-white">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

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
