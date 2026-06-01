'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Users, Wrench, Megaphone, Rocket } from 'lucide-react'

const steps = [
  {
    icon: Users,
    number: '01',
    title: 'You Bring The Audience',
    description:
      'You have the followers, community and trust. That\'s the most valuable asset. We start by understanding your audience deeply — their goals, pain points and what they\'re willing to invest in.',
    color: 'from-blue-600/20 to-blue-400/5',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
  },
  {
    icon: Wrench,
    number: '02',
    title: 'We Build The Product',
    description:
      'Our team designs and builds a premium digital product tailored to your audience. Courses, templates, toolkits, memberships — fully produced, branded and ready to sell.',
    color: 'from-indigo-600/20 to-indigo-400/5',
    border: 'border-indigo-500/20',
    iconBg: 'bg-indigo-500/15',
    iconColor: 'text-indigo-400',
  },
  {
    icon: Megaphone,
    number: '03',
    title: 'You Promote',
    description:
      'You share the product with your audience the way only you can — authentically. We provide you with all the creative assets, copy and launch strategy to make it seamless.',
    color: 'from-violet-600/20 to-violet-400/5',
    border: 'border-violet-500/20',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
  },
  {
    icon: Rocket,
    number: '04',
    title: 'We Scale Together',
    description:
      'Once the product is live, we optimise, iterate and scale. Automated fulfilment, customer support, and revenue tracking — all handled. You focus on your next milestone.',
    color: 'from-blue-600/20 to-cyan-400/5',
    border: 'border-cyan-500/20',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
  },
]

export default function HowItWorks() {
  const shouldReduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-32"
      aria-labelledby="how-it-works-title"
    >
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
            The Process
          </p>
          <h2
            id="how-it-works-title"
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            A simple, proven four-step model designed to generate revenue from your audience
            with minimal effort on your part.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line - desktop */}
          <div
            className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(59,130,246,0.3) 20%, rgba(99,102,241,0.3) 50%, rgba(6,182,212,0.3) 80%, transparent)',
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.65,
                    delay: i * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={shouldReduce ? {} : { y: -8, transition: { duration: 0.25 } }}
                  className={`relative rounded-2xl p-7 bg-gradient-to-b ${step.color} border ${step.border} transition-shadow duration-300 hover:shadow-2xl hover:shadow-blue-900/20`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl ${step.iconBg} flex items-center justify-center`}>
                      <Icon size={22} className={step.iconColor} aria-hidden="true" />
                    </div>
                    <span className="text-3xl font-black text-white/8 select-none">{step.number}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3 leading-snug">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>

                  {/* Mobile connector */}
                  {i < steps.length - 1 && (
                    <motion.div
                      className="lg:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 text-blue-500/30 text-xl"
                      animate={shouldReduce ? {} : { y: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      aria-hidden="true"
                    >
                      ↓
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
