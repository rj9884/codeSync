import { HeroSection } from './HeroSection'
import { Features } from './Features'
import TextHoverEffectDemo from './TextHoverEffectDemo'

export function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-zinc-800 selection:text-white">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
      <main className="relative z-10">
        <HeroSection />
      </main>
      <div className="relative z-10">
        <Features />
        <TextHoverEffectDemo />
      </div>
    </div>
  )
}
