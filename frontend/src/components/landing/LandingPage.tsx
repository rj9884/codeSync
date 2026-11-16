import { HeroSection } from './HeroSection'
import { Features } from './Features'
import TextHoverEffectDemo from './TextHoverEffectDemo'

export function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#0b0c10] text-white selection:bg-zinc-800 selection:text-white">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-100" />
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
