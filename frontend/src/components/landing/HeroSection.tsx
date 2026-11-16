import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { TextEffect } from '../ui/text-effect'
import { AnimatedGroup } from '../ui/animated-group'
import { HeroHeader } from './HeroHeader'
import { GoogleGeminiEffect } from '../ui/google-gemini-effect'

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      y: 12,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
        filter: { duration: 0.001 },
      },
    },
  },
}

export function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block pointer-events-none"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: 'spring',
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="absolute inset-0 -z-20 pointer-events-none"
            >
              <img
                src="https://res.cloudinary.com/dg4jhba5c/image/upload/v1741605538/night-background_ni3vqb.jpg"
                alt="background"
                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 block opacity-40 w-full object-cover"
                width="3276"
                height="4095"
              />
            </AnimatedGroup>
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,rgba(11,12,16,0.6)_75%)]"></div>
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    to="/collaborate"
                    className="hover:bg-zinc-900 bg-zinc-900/90 group mx-auto flex w-fit items-center gap-4 rounded-full border border-zinc-700/80 p-1 pl-4 shadow-lg transition-colors duration-300"
                  >
                    <span className="text-zinc-200 text-sm"> 🚀 Coming Soon: Animated Tooltip in The Editor</span>
                    <span className="block h-4 w-0.5 border-l border-zinc-700"></span>

                    <div className="bg-zinc-800 group-hover:bg-zinc-700 size-6 overflow-hidden rounded-full duration-500 flex items-center justify-center">
                      <ArrowRight className="size-3 text-zinc-300" />
                    </div>
                  </Link>
                </AnimatedGroup>
                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="text-gray-200 relative z-20 py-8 text-4xl font-bold sm:text-7xl"
                >
                  Code Together, Anywhere.
                </TextEffect>
                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h2"
                  className="text-gray-300 relative text-2xl sm:text-2xl font-normal"
                >
                  Collaborate in Realtime, Boost Productivity
                </TextEffect>
                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h2"
                  className="text-gray-300 relative text-2xl sm:text-2xl font-normal"
                >
                  & Streamline Your Development Workflow.
                </TextEffect>
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                >
                  <div className="flex justify-center mt-4">
                    <GoogleGeminiEffect autoAnimate={true} />
                  </div>
                </AnimatedGroup>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
