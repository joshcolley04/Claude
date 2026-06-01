'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Gift } from 'lucide-react'
import { BOOKING_URL } from '@/lib/utils'

export default function ExitIntentModal() {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let triggered = false

    const handleMouseLeave = (e: MouseEvent) => {
      if (triggered || dismissed) return
      if (e.clientY <= 20) {
        triggered = true
        setOpen(true)
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 8000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [dismissed])

  const handleClose = () => {
    setOpen(false)
    setDismissed(true)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-modal-title"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-md mx-4"
          >
            <div className="glass-strong rounded-3xl p-8 border border-blue-500/20 glow-blue text-center">
              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-blue-500/15 flex items-center justify-center mx-auto mb-6">
                <Gift size={24} className="text-blue-400" aria-hidden="true" />
              </div>

              <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-3">
                Before You Go
              </p>

              <h3
                id="exit-modal-title"
                className="text-3xl font-extrabold tracking-tight mb-4"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Free Creator{' '}
                <span className="gradient-text">Monetisation</span>
                <br />
                Strategy Session
              </h3>

              <p className="text-white/55 text-sm leading-relaxed mb-8">
                Don't leave without booking your free 30-minute strategy call. Discover exactly
                how your audience could generate recurring digital product revenue — built entirely for you.
              </p>

              <div className="space-y-3">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="group flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/20"
                >
                  Book My Free Strategy Call
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </a>
                <button
                  onClick={handleClose}
                  className="w-full px-6 py-3 rounded-xl text-white/35 hover:text-white/60 text-sm transition-colors"
                >
                  No thanks, I'll figure it out myself
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
