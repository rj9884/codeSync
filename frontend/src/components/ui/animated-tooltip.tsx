import { useState } from 'react'
import { motion, useTransform, AnimatePresence, useMotionValue, useSpring } from 'motion/react'

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number
    name: string
    image?: string
  }[]
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const springConfig = { stiffness: 100, damping: 5 }
  const x = useMotionValue(0)
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig)
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig)

  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2
    x.set(event.nativeEvent.offsetX - halfWidth)
  }

  return (
    <div className="flex flex-row items-center justify-center">
      {items.map((item) => (
        <div
          className="group relative -mr-3"
          key={item.id + '-' + item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: 'nowrap',
                }}
                className="absolute -top-10 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl border border-zinc-800"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-sm font-bold text-white">{item.name}</div>
              </motion.div>
            )}
          </AnimatePresence>
          {item.image ? (
            <img
              onMouseMove={handleMouseMove}
              src={item.image}
              alt={item.name}
              className="relative !m-0 h-10 w-10 rounded-full border-2 border-white dark:border-zinc-700 object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105"
            />
          ) : (
            <div
              onMouseMove={handleMouseMove}
              className="relative !m-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white dark:border-zinc-700 bg-zinc-800 text-sm font-semibold text-white transition duration-500 group-hover:z-30 group-hover:scale-105"
            >
              {item.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
