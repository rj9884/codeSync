import { Code } from 'lucide-react'
import type { ReactNode } from 'react'

export function Features() {
  return (
    <section className="relative h-full w-full bg-zinc-950 py-16 md:py-32 text-white">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-60"></div>
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-gray-200 text-balance text-4xl font-bold lg:text-5xl">
            Make Coding Together an Enjoyable Experience
          </h2>
          <p className="mt-4 text-gray-400">
            Seamless Collaboration, Fully Customizable, and Intuitive Design for an enhanced development experience.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-sm gap-6 md:mt-16 md:max-w-none md:grid-cols-3 text-center">
          <div className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-white transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-850 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/20 backdrop-blur-sm">
            <CardDecorator>
              <Code className="size-6 text-zinc-300" aria-hidden />
            </CardDecorator>
            <h3 className="mt-6 font-medium text-gray-200 text-lg">Collaborate</h3>
            <p className="mt-3 text-sm text-gray-400">
              Empower teams to code together seamlessly with real-time collaboration tools, enhancing productivity and teamwork.
            </p>
          </div>

          <div className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-white transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-850 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/20 backdrop-blur-sm">
            <CardDecorator>
              <Code className="size-6 text-zinc-300" aria-hidden />
            </CardDecorator>
            <h3 className="mt-6 font-medium text-gray-200 text-lg">Control</h3>
            <p className="mt-3 text-sm text-gray-400">
              Tailor the platform to your needs with extensive customization options, ensuring a personalized and efficient coding experience.
            </p>
          </div>

          <div className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-white transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-850 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/20 backdrop-blur-sm">
            <CardDecorator>
              <Code className="size-6 text-zinc-300" aria-hidden />
            </CardDecorator>
            <h3 className="mt-6 font-medium text-gray-200 text-lg">Continuous Workflow</h3>
            <p className="mt-3 text-sm text-gray-400">
              Simplify your development process with tools designed to enhance collaboration and efficiency.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-white,#fff)15%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-white,#fff)30%,transparent)]">
    <div className="absolute inset-0 bg-grid-pattern opacity-40" />
    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#18181b_75%)]" />
    <div className="bg-zinc-900 absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t border-zinc-700 group-hover:border-zinc-600 transition-colors duration-300 rounded shadow-sm">
      {children}
    </div>
  </div>
)
