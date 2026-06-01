'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { BOOKING_URL } from '@/lib/utils'

const PARTICLE_COUNT = 40

function Particles({ shouldReduce }: { shouldReduce: boolean | null }) {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
  }))

  if (shouldReduce) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  const shouldReduce = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (shouldReduce) return
    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 30,
      })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [shouldReduce])

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: i * 0.12, ease: 'easeOut' as const },
    }),
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16"
      aria-label="Hero section"
    >
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={shouldReduce ? {} : {
            x: mousePos.x * 0.4,
            y: mousePos.y * 0.4,
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 0.8, scale: { duration: 6, repeat: Infinity } }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={shouldReduce ? {} : {
            x: mousePos.x * -0.3,
            y: mousePos.y * -0.3,
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 1, scale: { duration: 8, repeat: Infinity, delay: 2 } }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <Particles shouldReduce={shouldReduce} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Creator Monetisation Partnership
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Turn Your Audience{' '}
          <br className="hidden sm:block" />
          Into Revenue{' '}
          <span className="gradient-text">Without Creating</span>
          <br className="hidden sm:block" />
          the Product Yourself
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We build premium digital products for creators and influencers.
          You promote. We handle everything else.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1"
          >
            Book a Free Strategy Call
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl glass hover:bg-white/8 text-white/70 hover:text-white font-semibold text-base transition-all duration-300 hover:-translate-y-1"
          >
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
              <Play size={12} className="translate-x-0.5" />
            </span>
            Learn More
          </button>
        </motion.div>

        {/* Flow diagram */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-20 flex items-center justify-center gap-3 md:gap-6 flex-wrap"
          aria-label="How it works flow: Creator to Product to Customer"
        >
          {['Creator', 'Digital Product', 'Customer'].map((label, i) => (
            <div key={label} className="flex items-center gap-3 md:gap-6">
              <motion.div
                className="glass rounded-2xl px-6 py-4 text-center"
                whileHover={shouldReduce ? {} : { scale: 1.05, borderColor: 'rgba(59,130,246,0.4)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-400 font-bold text-sm">{i + 1}</span>
                </div>
                <p className="text-white/80 text-sm font-medium">{label}</p>
              </motion.div>
              {i < 2 && (
                <motion.div
                  animate={shouldReduce ? {} : { x: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-blue-500/40"
                  aria-hidden="true"
                >
                  →
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(transparent, #050505)' }}
        aria-hidden="true"
      />
    </section>
  )
}
