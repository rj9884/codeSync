import { TextHoverEffect } from '../ui/text-hover-effect'
import FooterSection from './Footer'

export default function TextHoverEffectDemo() {
  return (
    <div className="flex flex-col items-center justify-center bg-zinc-950 relative">
      <div className="h-[28rem] sm:h-[36rem] w-full flex items-center justify-center relative">
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-60"></div>
        <div className="w-full max-w-5xl px-4 flex items-center justify-center">
          <TextHoverEffect text="CodeSync" />
        </div>
      </div>
      <FooterSection />
    </div>
  )
}
