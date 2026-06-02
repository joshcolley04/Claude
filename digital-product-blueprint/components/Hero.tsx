'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { BOOKING_URL } from '@/lib/utils'

const PARTICLE_COUNT = 60

function Particles({ shouldReduce }: { shouldReduce: boolean | null }) {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 0.5,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 15,
    opacity: Math.random() * 0.5 + 0.1,
  }))

  if (shouldReduce) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0
              ? 'rgba(59,130,246,0.8)'
              : p.id % 3 === 1
              ? 'rgba(99,102,241,0.6)'
              : 'rgba(255,255,255,0.4)',
          }}
          animate={{
            y: [0, -(Math.random() * 80 + 40), 0],
            x: [0, (Math.random() - 0.5) * 30, 0],
            opacity: [0, p.opacity, 0],
            scale: [0, 1, 0],
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

function OrbitingDot({ radius, duration, delay, color }: { radius: number; duration: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 pointer-events-none"
      style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
      animate={{ rotate: 360 }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
      aria-hidden="true"
    >
      <div
        className="absolute rounded-full"
        style={{
          width: 6,
          height: 6,
          top: 0,
          left: '50%',
          marginLeft: -3,
          background: color,
          boxShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
        }}
      />
    </motion.div>
  )
}

export default function Hero() {
  const shouldReduce = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -150])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  useEffect(() => {
    if (shouldReduce) return
    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 50,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 50,
      })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [shouldReduce])

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.15, ease: 'easeOut' as const },
    }),
  }

  return (
    <motion.section
      ref={containerRef}
      style={shouldReduce ? {} : { y, opacity }}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16"
      aria-label="Hero section"
    >
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Primary orb - follows mouse */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={shouldReduce ? {} : {
            x: mousePos.x * 0.6,
            y: mousePos.y * 0.6,
            scale: [1, 1.08, 1],
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20, scale: { duration: 6, repeat: Infinity } }}
        />
        {/* Secondary orb */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={shouldReduce ? {} : {
            x: mousePos.x * -0.4,
            y: mousePos.y * -0.4,
            scale: [1, 1.1, 1],
          }}
          transition={{ type: 'spring', stiffness: 30, damping: 20, scale: { duration: 8, repeat: Infinity, delay: 2 } }}
        />
        {/* Third accent orb */}
        <motion.div
          className="absolute top-3/4 left-1/2 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={shouldReduce ? {} : { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, delay: 4 }}
        />
      </div>

      <Particles shouldReduce={shouldReduce} />

      {/* Orbiting rings */}
      {!shouldReduce && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="relative w-[600px] h-[600px] opacity-20">
            <motion.div
              className="absolute inset-0 rounded-full border border-blue-500/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{ borderStyle: 'dashed' }}
            />
            <motion.div
              className="absolute inset-8 rounded-full border border-indigo-500/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <OrbitingDot radius={300} duration={30} delay={0} color="rgba(59,130,246,0.9)" />
            <OrbitingDot radius={284} duration={20} delay={5} color="rgba(99,102,241,0.9)" />
            <OrbitingDot radius={300} duration={30} delay={15} color="rgba(6,182,212,0.9)" />
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-10 neon-border"
        >
          <motion.span
            animate={shouldReduce ? {} : { rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles size={12} />
          </motion.span>
          Creator Monetisation Partnership
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
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
          <br className="hidden sm:block" />
          <span className="shimmer-text">Without Creating</span>
          <br className="hidden sm:block" />
          the Product Yourself
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
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
          <motion.a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-9 py-5 rounded-2xl bg-blue-600 text-white font-bold text-base overflow-hidden"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Shimmer sweep on hover */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              whileHover={{ x: '200%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative">Book a Free Strategy Meeting</span>
            <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform" />
          </motion.a>

          <motion.button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="group inline-flex items-center gap-3 px-8 py-5 rounded-2xl glass neon-border text-white/70 hover:text-white font-semibold text-base transition-all duration-300"
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Play size={13} className="translate-x-0.5 text-blue-400" />
            </span>
            Learn More
          </motion.button>
        </motion.div>

        {/* Flow diagram */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-24 flex items-center justify-center gap-4 md:gap-8 flex-wrap"
          aria-label="How it works flow"
        >
          {['Creator', 'Digital Product', 'Customer'].map((label, i) => (
            <div key={label} className="flex items-center gap-4 md:gap-8">
              <motion.div
                className="shimmer-card px-7 py-5 text-center"
                whileHover={shouldReduce ? {} : { scale: 1.08, y: -6 }}
                transition={{ duration: 0.25 }}
                style={{ animationDelay: `${i}s` }}
              >
                <motion.div
                  className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-3"
                  animate={shouldReduce ? {} : { boxShadow: ['0 0 0 0 rgba(59,130,246,0.3)', '0 0 0 8px rgba(59,130,246,0)', '0 0 0 0 rgba(59,130,246,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                >
                  <span className="text-blue-400 font-black text-sm">{i + 1}</span>
                </motion.div>
                <p className="text-white font-semibold text-sm">{label}</p>
              </motion.div>
              {i < 2 && (
                <motion.div
                  animate={shouldReduce ? {} : { x: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
                  className="text-blue-400 text-xl"
                  aria-hidden="true"
                >
                  →
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-16 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="text-white/25 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-blue-500/50 to-transparent"
            animate={shouldReduce ? {} : { scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(transparent, #050505)' }}
        aria-hidden="true"
      />
    </motion.section>
  )
}
