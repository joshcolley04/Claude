'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BOOKING_URL } from '@/lib/utils'

export default function MobileFloatingCTA() {
  const [visible, setVisible] = useState(false)
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setPastHero(scrollY > window.innerHeight * 0.6)
      setVisible(scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && pastHero && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-4 right-4 z-50 md:hidden"
        >
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 w-full px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-2xl shadow-blue-500/30 transition-all duration-200 active:scale-95"
          >
            Book a Free Strategy Meeting
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
