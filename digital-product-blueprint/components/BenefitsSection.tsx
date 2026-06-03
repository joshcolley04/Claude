'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { X, Check } from 'lucide-react'

const challenges = [
  'No product idea to start with',
  'No time to build something',
  'No technical skills required',
  'No delivery or fulfilment systems',
  'No customer support infrastructure',
  'No launch strategy experience',
]

const solutions = [
  'Done for you product creation',
  'Premium digital products built for you',
  'Fully automated delivery pipeline',
  'Revenue partnership model',
  'Dedicated customer experience team',
  'Proven launch frameworks included',
]

export default function BenefitsSection() {
  const shouldReduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="benefits"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-labelledby="benefits-title"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)' }}
        />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
            The Difference
          </p>
          <h2
            id="benefits-title"
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            From Struggle to{' '}
            <span className="gradient-text">Scalable Revenue</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Challenges */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-2xl p-8 bg-gradient-to-b from-red-950/20 to-transparent border border-red-900/20"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                <X size={18} className="text-red-400" aria-hidden="true" />
              </div>
              <h3 className="text-white font-bold text-xl">Creator Challenges</h3>
            </div>
            <div className="space-y-4">
              {challenges.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-red-950/15 border border-red-900/15"
                >
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <X size={12} className="text-red-400" aria-hidden="true" />
                  </div>
                  <span className="text-white/60 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-2xl p-8 bg-gradient-to-b from-blue-950/30 to-transparent border border-blue-500/15 relative overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
              aria-hidden="true"
              style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
              }}
            />
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                <Check size={18} className="text-blue-400" aria-hidden="true" />
              </div>
              <h3 className="text-white font-bold text-xl">Our Solution</h3>
            </div>
            <div className="space-y-4">
              {solutions.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.07 }}
                  whileHover={shouldReduce ? {} : { x: 4, transition: { duration: 0.2 } }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/8 border border-blue-500/12 transition-colors duration-200 hover:border-blue-500/25"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500/25 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-blue-400" aria-hidden="true" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
