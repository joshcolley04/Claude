'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement
      const scrollTop = window.scrollY
      const scrollHeight = doc.scrollHeight - doc.clientHeight
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-white/5"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 origin-left"
        style={{ scaleX: progress / 100 }}
        transition={shouldReduce ? { duration: 0 } : { duration: 0.1 }}
      />
    </div>
  )
}
