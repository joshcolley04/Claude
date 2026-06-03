'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { BOOKING_URL } from '@/lib/utils'

export default function FinalCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const shouldReduce = useReducedMotion()

  return (
    <section
      className="relative py-28 md:py-36 overflow-hidden"
      aria-labelledby="final-cta-title"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute inset-0 animate-gradient"
          style={{
            background:
              'linear-gradient(135deg, #050505 0%, #0a1628 30%, #0d1f3c 50%, #0a1628 70%, #050505 100%)',
          }}
          animate={shouldReduce ? {} : { backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={shouldReduce ? {} : { scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-8"
        >
          <Sparkles size={12} aria-hidden="true" />
          Ready to Start?
        </motion.div>

        <motion.h2
          id="final-cta-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Ready To Monetise Your
          <br />
          <span className="gradient-text">Audience The Smarter Way?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/50 text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Book your free strategy call today and discover exactly how we can turn
          your audience into a revenue generating digital product business.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/45"
          >
            Book a Free Strategy Meeting
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </motion.a>
          <motion.a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl glass-strong border border-white/12 hover:border-blue-500/30 text-white font-bold text-lg transition-all duration-300"
          >
            Get Started
          </motion.a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-white/25 text-sm mt-8"
        >
          Free 30 minute session, No obligation, No credit card required
        </motion.p>
      </div>
    </section>
  )
}
