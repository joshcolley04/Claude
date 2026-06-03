'use client'

import { motion } from 'framer-motion'
import { BookOpen, Layout, Palette, Cpu, Wrench, GraduationCap, Check, Clock, ArrowLeft, ArrowRight, Sparkles, Users, Tag } from 'lucide-react'
import Link from 'next/link'
import type { Product } from '@/lib/products'
import { BOOKING_URL } from '@/lib/utils'
import ScrollProgress from '@/components/ScrollProgress'

const iconMap: Record<string, React.ElementType> = {
  'ebooks-guides': BookOpen,
  'digital-templates': Layout,
  'brand-kits': Palette,
  'interactive-apps': Cpu,
  'custom-builds': Wrench,
  'online-courses': GraduationCap,
}

export default function ProductPage({ product }: { product: Product }) {
  const Icon = iconMap[product.slug] ?? BookOpen

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: 'easeOut' as const },
  })

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <ScrollProgress />

      {/* Nav bar */}
      <nav className="fixed top-2 left-4 right-4 z-50 glass-strong rounded-2xl px-5 py-4 flex items-center justify-between">
        <Link
          href="/#product-types"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </Link>
        <span className="text-sm font-semibold gradient-text-subtle hidden sm:block">
          The Digital Product Blueprint™
        </span>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
        >
          Book a Free Strategy Meeting
        </a>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${product.glowColor} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp(0)} className="flex justify-center mb-6">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border ${product.tagColor}`}>
              <Icon size={13} aria-hidden="true" />
              {product.tag}
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {product.headline}
          </motion.h1>

          <motion.p {...fadeUp(0.15)} className="text-xl text-white/55 max-w-2xl mx-auto leading-relaxed mb-10">
            {product.subheadline}
          </motion.p>

          {/* Quick stats */}
          <motion.div {...fadeUp(0.22)} className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 px-5 py-3 rounded-xl glass border border-white/8">
              <Tag size={15} className="text-blue-400" aria-hidden="true" />
              <span className="text-white/70 text-sm">Typical price: <span className="text-white font-semibold">{product.priceRange}</span></span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 rounded-xl glass border border-white/8">
              <Clock size={15} className="text-blue-400" aria-hidden="true" />
              <span className="text-white/70 text-sm">Launch in: <span className="text-white font-semibold">{product.timeToLaunch}</span></span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-20 px-6" aria-labelledby="whats-included-title">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-3">Everything Handled For You</p>
            <h2
              id="whats-included-title"
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              What's <span className="gradient-text">Included</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {product.whatsIncluded.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`glass rounded-2xl p-7 border ${product.border} hover:border-opacity-50 transition-all duration-300 group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg ${product.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Check size={15} className={product.iconColor} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-2">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-16 px-6 bg-[#111111]/40" aria-labelledby="pain-points-title">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <h2
              id="pain-points-title"
              className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Sound <span className="gradient-text">Familiar?</span>
            </h2>
            <p className="text-white/45 text-base">This product was built for creators exactly like you.</p>
          </motion.div>

          <div className="space-y-4">
            {product.painPoints.map((point, i) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-2xl glass border border-white/6"
              >
                <span className={`text-lg flex-shrink-0`}>💡</span>
                <p className="text-white/70 text-sm leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal for + Examples */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Users size={18} className="text-blue-400" aria-hidden="true" />
              <h3 className="text-white font-bold text-lg">Ideal For</h3>
            </div>
            <div className="space-y-3">
              {product.idealFor.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${product.iconColor.replace('text-', 'bg-')}`} />
                  <span className="text-white/60 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={18} className="text-blue-400" aria-hidden="true" />
              <h3 className="text-white font-bold text-lg">Examples We Build</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.examples.map((ex) => (
                <span
                  key={ex}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border ${product.tagColor}`}
                >
                  {ex}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 overflow-hidden" aria-labelledby="product-cta-title">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 100%, ${product.glowColor} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Ready to launch your {product.tag.toLowerCase()}?
          </motion.div>

          <h2
            id="product-cta-title"
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Your Audience Is Ready.
            <br />
            <span className="gradient-text">Are You?</span>
          </h2>

          <p className="text-white/55 text-lg leading-relaxed mb-4 max-w-xl mx-auto">
            Book a free 30 minute strategy call and let's map out exactly how we'd build your{' '}
            <span className="text-white font-medium">{product.tag.toLowerCase()}</span> and get it in front of your audience.
          </p>

          <p className="text-white/35 text-sm mb-10">
            No pitch. No pressure. Just a genuine conversation about what's possible for your brand.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/45 w-full sm:w-auto justify-center"
            >
              Let's Build This Together
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </motion.a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {['Free 30 min call', 'No obligation', 'Google Meet'].map((point) => (
              <div key={point} className="flex items-center gap-2 text-white/35 text-sm">
                <Check size={13} className="text-blue-400" aria-hidden="true" />
                {point}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/#product-types" className="text-white/30 hover:text-white/60 text-sm transition-colors">
            ← Back to The Digital Product Blueprint™
          </Link>
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} The Digital Product Blueprint™</p>
        </div>
      </footer>
    </div>
  )
}
