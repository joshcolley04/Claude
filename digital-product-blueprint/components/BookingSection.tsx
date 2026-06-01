'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Clock, Video, Heart, Search } from 'lucide-react'
import { BOOKING_URL } from '@/lib/utils'

const trustPoints = [
  { icon: Clock, text: '30 Minute Strategy Session' },
  { icon: Video, text: 'Google Meet Included' },
  { icon: Heart, text: 'No Obligation' },
  { icon: Search, text: 'Personalised Monetisation Review' },
]

export default function BookingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="booking"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-labelledby="booking-title"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div ref={ref} className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-strong rounded-3xl p-10 md:p-14 text-center glow-blue-strong border border-blue-500/15"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Limited Spots Available
          </motion.div>

          <h2
            id="booking-title"
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Book Your Free
            <br />
            <span className="gradient-text">Strategy Call</span>
          </h2>

          <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Discover how your audience could become a scalable revenue stream through
            professionally built digital products — without creating them yourself.
          </p>

          {/* Trust points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {trustPoints.map((point, i) => {
              const Icon = point.icon
              return (
                <motion.div
                  key={point.text}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white/4 border border-white/8"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-blue-400" aria-hidden="true" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">{point.text}</span>
                </motion.div>
              )
            })}
          </div>

          <motion.a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.55 }}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all duration-300 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40"
          >
            Book Your Free Strategy Call
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </motion.a>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-white/35 text-sm mt-8 leading-relaxed max-w-md mx-auto"
          >
            We'll discuss your audience, monetisation opportunities and whether our partnership
            model is the right fit for your goals.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
