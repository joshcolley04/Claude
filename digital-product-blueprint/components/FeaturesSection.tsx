'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Package, Truck, Zap, TrendingUp, Shield, Handshake } from 'lucide-react'

const features = [
  {
    icon: Package,
    title: 'No Inventory',
    description: 'Digital products require zero physical stock. No warehousing, no logistics, no overhead. Pure margin.',
  },
  {
    icon: Truck,
    title: 'No Fulfilment Headaches',
    description: 'Every product is delivered automatically the moment a customer completes their purchase. Zero manual work.',
  },
  {
    icon: Zap,
    title: 'Fast Launches',
    description: 'From strategy call to live product in weeks, not months. We move at the speed your audience demands.',
  },
  {
    icon: TrendingUp,
    title: 'Scalable Income',
    description: 'Sell to one person or ten thousand with the exact same effort. Digital products scale without scaling costs.',
  },
  {
    icon: Shield,
    title: 'Low Risk',
    description: 'No upfront investment in stock or infrastructure. Our partnership model means we\'re aligned on success.',
  },
  {
    icon: Handshake,
    title: 'Partnership Approach',
    description: 'We\'re not a vendor, we\'re a partner. Your success is our success. We build for the long term.',
  },
]

export default function FeaturesSection() {
  const shouldReduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="features"
      className="relative py-24 md:py-32"
      aria-labelledby="features-title"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.05) 0%, transparent 100%)',
        }}
      />

      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Why Creators Choose This Model
          </p>
          <h2
            id="features-title"
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Everything You Need.
            <br />
            <span className="gradient-text">Nothing You Don't.</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            The smartest way for creators to monetise, built around your strengths,
            not your weaknesses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={
                  shouldReduce
                    ? {}
                    : {
                        y: -6,
                        transition: { duration: 0.25 },
                      }
                }
                className="group glass rounded-2xl p-7 hover:border-blue-500/25 transition-all duration-300 cursor-default"
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition-colors duration-300"
                  whileHover={shouldReduce ? {} : { scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon
                    size={22}
                    className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300"
                    aria-hidden="true"
                  />
                </motion.div>

                <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-blue-100 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>

                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.05) 0%, transparent 60%)',
                  }}
                  aria-hidden="true"
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
