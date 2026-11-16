import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/moving-border'
import { cn } from '../../utils/cn'

export const HeroHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header>
      <nav className="fixed z-20 w-full px-2">
        <div
          className={cn(
            'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
            isScrolled && 'bg-black/50 max-w-4xl rounded-2xl border border-zinc-800 backdrop-blur-lg lg:px-5'
          )}
        >
          <div className="relative flex items-center justify-between py-3 lg:py-4">
            <Link to="/" aria-label="home" className="flex items-center space-x-2">
              <h1 className="text-gray-300 text-xl font-bold sm:text-2xl">
                <span>&lt;CodeSync/&gt;</span>
              </h1>
            </Link>

            <div className="flex items-center">
              <Link to="/collaborate">
                <Button
                  duration={3500}
                  className="font-bold bg-slate-900 text-white border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span>Get Started</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
