'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { CalendarCheck, Lightbulb, Hammer, Rocket } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: CalendarCheck,
    title: 'Discovery Call',
    tagline: 'We listen before we build',
    description:
      'We start with a free 30-minute strategy session to understand your audience, your brand, and your goals. No templates, no assumptions, just a focused conversation about where you are and where you want to go. By the end, you\'ll have clarity on which digital product fits your audience best and a realistic picture of your revenue potential.',
    details: ['Audience analysis', 'Monetisation opportunity mapping', 'Product fit assessment', 'Revenue projection walkthrough'],
    color: 'from-blue-600/20 to-blue-500/5',
    border: 'border-blue-500/25',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    numberColor: 'text-blue-500/30',
  },
  {
    number: '02',
    icon: Lightbulb,
    title: 'Strategy & Concept',
    tagline: 'The blueprint for your product',
    description:
      'Once we\'re aligned on the opportunity, we build a complete monetisation strategy around your brand. This covers product format, pricing architecture, positioning, and the sales funnel, all mapped out before a single file is created. You sign off on the concept before we move into production.',
    details: ['Product format selection', 'Pricing & packaging strategy', 'Brand alignment review', 'Sales funnel architecture'],
    color: 'from-indigo-600/20 to-indigo-500/5',
    border: 'border-indigo-500/25',
    iconBg: 'bg-indigo-500/15',
    iconColor: 'text-indigo-400',
    numberColor: 'text-indigo-500/30',
  },
  {
    number: '03',
    icon: Hammer,
    title: 'Design & Build',
    tagline: 'Premium products, built for you',
    description:
      'Our team handles the entire production process, covering writing, design, development, and quality assurance. Whether it\'s a course, a template pack, a brand kit, or a custom app, every deliverable is crafted to a professional standard that reflects your brand and converts your audience. You stay in the loop without lifting a finger.',
    details: ['Full content creation', 'Professional design & branding', 'Automated delivery setup', 'Quality assurance & testing'],
    color: 'from-violet-600/20 to-violet-500/5',
    border: 'border-violet-500/25',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    numberColor: 'text-violet-500/30',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Deliver & Launch',
    tagline: 'From zero to revenue-generating',
    description:
      'We don\'t hand you a product and disappear. We deploy the full delivery system, provide launch assets, and support your go-live with strategy and optimisation. Your product goes live with everything in place including payment processing, automated fulfilment, and post-purchase sequences, so revenue starts from day one.',
    details: ['Full deployment & go-live support', 'Launch content & assets', 'Post-purchase automation', 'Ongoing optimisation support'],
    color: 'from-cyan-600/20 to-cyan-500/5',
    border: 'border-cyan-500/25',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    numberColor: 'text-cyan-500/30',
  },
]

function StepCard({ step, index, inView, shouldReduce }: {
  step: typeof steps[0]
  index: number
  inView: boolean
  shouldReduce: boolean | null
}) {
  const Icon = step.icon
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.15 + index * 0.15, ease: 'easeOut' }}
      className="relative grid md:grid-cols-2 gap-8 md:gap-16 items-center"
    >
      {/* Step number — large background text */}
      <div
        className={`absolute -top-6 ${isEven ? 'left-0' : 'right-0 text-right'} text-[120px] md:text-[160px] font-black leading-none select-none pointer-events-none ${step.numberColor} hidden md:block`}
        aria-hidden="true"
      >
        {step.number}
      </div>

      {/* Card — alternates sides on desktop */}
      <div className={`${isEven ? 'md:col-start-1' : 'md:col-start-2'} relative`}>
        <motion.div
          whileHover={shouldReduce ? {} : { y: -4, borderColor: 'rgba(59,130,246,0.3)' }}
          transition={{ duration: 0.25 }}
          className={`relative glass rounded-2xl p-8 border ${step.border} overflow-hidden`}
        >
          {/* Gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${step.color} pointer-events-none`}
            aria-hidden="true"
          />

          <div className="relative z-10">
            {/* Icon + step number */}
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-12 h-12 rounded-xl ${step.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={22} className={step.iconColor} aria-hidden="true" />
              </div>
              <span className={`text-sm font-bold tracking-widest uppercase ${step.iconColor} opacity-70`}>
                Step {step.number}
              </span>
            </div>

            <h3
              className="text-2xl font-extrabold text-white mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {step.title}
            </h3>
            <p className={`text-sm font-medium mb-4 ${step.iconColor}`}>{step.tagline}</p>
            <p className="text-white/55 text-sm leading-relaxed mb-6">{step.description}</p>

            {/* Detail chips */}
            <div className="flex flex-wrap gap-2">
              {step.details.map((d) => (
                <span
                  key={d}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full ${step.iconBg} ${step.iconColor} border ${step.border}`}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Connector visual — opposite side */}
      <div className={`${isEven ? 'md:col-start-2' : 'md:col-start-1 md:row-start-1'} hidden md:flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: 'easeOut' }}
          className="relative flex items-center justify-center"
        >
          {/* Outer ring */}
          <div className={`w-28 h-28 rounded-full border ${step.border} flex items-center justify-center`}
            style={{ background: `radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)` }}
          >
            {/* Inner circle */}
            <div className={`w-16 h-16 rounded-full ${step.iconBg} border ${step.border} flex items-center justify-center`}>
              <Icon size={28} className={step.iconColor} aria-hidden="true" />
            </div>
          </div>

          {/* Orbiting dot — rotates a wrapper div, dot offset to sit just outside the ring */}
          {!shouldReduce && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 6 + index, repeat: Infinity, ease: 'linear' }}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${step.iconBg} border ${step.border}`}
                style={{ transform: 'translateY(-68px)' }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function ProcessSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduce = useReducedMotion()

  return (
    <section
      id="process"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-labelledby="process-title"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.2) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div ref={ref} className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
            How We Work Together
          </p>
          <h2
            id="process-title"
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            From First Call to
            <br />
            <span className="gradient-text">First Sale</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            A clear, proven process so you always know what's happening, what's next, and
            exactly when your product will be ready to sell.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative space-y-20 md:space-y-28">
          {/* Vertical connector line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            aria-hidden="true"
          >
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
              className="h-full origin-top"
              style={{
                background: 'linear-gradient(to bottom, rgba(59,130,246,0.4), rgba(99,102,241,0.3), rgba(6,182,212,0.2), transparent)',
              }}
            />
          </div>

          {steps.map((step, i) => (
            <StepCard
              key={step.number}
              step={step}
              index={i}
              inView={inView}
              shouldReduce={shouldReduce}
            />
          ))}
        </div>

        {/* Bottom CTA nudge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
          className="text-center mt-20"
        >
          <p className="text-white/35 text-sm">
            The entire process typically takes{' '}
            <span className="text-white/60 font-semibold">1 to 2 weeks</span>
            {' '}from discovery call to live product.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
