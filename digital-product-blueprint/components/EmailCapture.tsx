'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export default function EmailCapture() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section
      className="relative py-20 md:py-28"
      aria-labelledby="email-capture-title"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(59,130,246,0.04) 0%, transparent 100%)',
        }}
      />

      <div ref={ref} className="max-w-xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="glass-strong rounded-3xl p-8 md:p-12 border border-white/8"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <CheckCircle2 size={48} className="text-blue-400 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-white font-bold text-2xl mb-2">You're on the list!</h3>
              <p className="text-white/50 text-sm">
                We'll send you creator monetisation insights straight to your inbox.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-3">
                  Free Insights
                </p>
                <h2
                  id="email-capture-title"
                  className="text-3xl font-extrabold tracking-tight mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Get Creator Monetisation Insights
                </h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  Strategies, frameworks and case studies to help you monetise your audience effectively.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="capture-name" className="sr-only">Your name</label>
                  <input
                    id="capture-name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="given-name"
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="capture-email" className="sr-only">Email address</label>
                  <input
                    id="capture-email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Get Free Insights
                      <ArrowRight size={15} aria-hidden="true" />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="text-center text-white/25 text-xs mt-4">
                No spam. Unsubscribe any time. UK privacy compliant.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
