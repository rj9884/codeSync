import { TextHoverEffect } from '../ui/text-hover-effect'
import FooterSection from './Footer'

export default function TextHoverEffectDemo() {
  return (
    <div className="flex flex-col items-center justify-center bg-black relative">
      <div className="h-[28rem] sm:h-[36rem] w-full flex items-center justify-center relative">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
        <div className="w-full max-w-5xl px-4 flex items-center justify-center">
          <TextHoverEffect text="CodeSync" />
        </div>
      </div>
      <FooterSection />
    </div>
  )
}
