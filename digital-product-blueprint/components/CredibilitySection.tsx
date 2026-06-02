'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Lightbulb, Hammer, Zap, Star, TrendingUp, Rocket } from 'lucide-react'

const cards = [
  {
    icon: Lightbulb,
    title: 'Product Strategy',
    description:
      'We analyse your audience, identify the highest-converting product formats and design a monetisation strategy built around your brand.',
  },
  {
    icon: Hammer,
    title: 'Product Creation',
    description:
      'From courses and templates to toolkits and memberships, we build professionally crafted digital products your audience will love.',
  },
  {
    icon: Zap,
    title: 'Delivery Systems',
    description:
      'Fully automated fulfilment pipelines ensure every customer receives their product instantly, without you lifting a finger.',
  },
  {
    icon: Star,
    title: 'Customer Experience',
    description:
      'Premium onboarding flows, support documentation and post-purchase sequences that turn buyers into loyal advocates.',
  },
  {
    icon: TrendingUp,
    title: 'Monetisation Frameworks',
    description:
      'Proven pricing models, upsell sequences and launch strategies engineered to maximise revenue from your existing audience.',
  },
  {
    icon: Rocket,
    title: 'Launch & Growth Support',
    description:
      'We don\'t hand you a product and disappear. We support every launch with strategy, assets and optimisation to keep revenue growing.',
  },
]

export default function CredibilitySection() {
  const shouldReduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" aria-labelledby="credibility-title">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Our Capabilities
          </p>
          <h2
            id="credibility-title"
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Built For The Next Generation
            <br />
            <span className="gradient-text">Of Creators</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            We handle every element of your digital product business so you can focus on what
            you do best, growing your audience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={
                  shouldReduce
                    ? {}
                    : {
                        y: -6,
                        borderColor: 'rgba(59,130,246,0.35)',
                        boxShadow: '0 0 40px rgba(59,130,246,0.1)',
                      }
                }
                className="glass rounded-2xl p-7 transition-colors duration-300 cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-blue-400" aria-hidden="true" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{card.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{card.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
