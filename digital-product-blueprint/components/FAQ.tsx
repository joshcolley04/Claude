'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Plus, Minus, CheckCircle2, XCircle } from 'lucide-react'

const faqs = [
  {
    question: 'Do I need a product already?',
    answer:
      'Not at all. That\'s precisely why we exist. You bring your audience and your personal brand, we handle ideation, creation, and everything in between. Our strategy sessions start by understanding your audience deeply so we can identify the highest converting product opportunity for your specific niche.',
  },
  {
    question: 'What types of products can you create?',
    answer:
      'We build a wide range of premium digital products, including online courses, masterclasses, digital templates, resource toolkits, swipe files, membership communities, coaching frameworks and digital playbooks. We recommend the right format based on your audience size, niche and monetisation goals.',
  },
  {
    question: 'How does revenue sharing work?',
    answer:
      'We operate on a partnership model where we share in the revenue generated from products we build together. The exact structure is discussed during your strategy call and tailored to your situation. There are no large upfront fees, our incentives are aligned with your success.',
  },
  {
    question: 'How long does it take?',
    answer:
      'From your initial strategy call to a live, sellable product, the typical timeline is four to eight weeks depending on the product complexity. We move quickly without compromising on quality. You\'ll be kept updated throughout the entire build process.',
  },
  {
    question: 'Who is this for?',
    answer:
      'This is for creators, influencers, coaches, consultants and personal brands who have an engaged audience but haven\'t yet monetised through digital products, or who have tried but found the process overwhelming. If you have followers who trust your recommendations, this model is designed for you.',
  },
]

function FAQItem({ faq, isOpen, onToggle }: {
  faq: typeof faqs[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden transition-colors duration-200 hover:border-blue-500/20">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-7 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-white font-semibold text-base md:text-lg leading-snug">
          {faq.question}
        </span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
          isOpen ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40'
        }`}>
          {isOpen ? <Minus size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-7 pb-7 pt-0">
              <div className="h-px bg-white/5 mb-5" />
              <p className="text-white/60 text-sm md:text-base leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="faq"
      className="relative py-24 md:py-32"
      aria-labelledby="faq-title"
    >
      <div ref={ref} className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
            FAQs
          </p>
          <h2
            id="faq-title"
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Common <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-white/50 text-base">
            Everything you need to know before booking your call.
          </p>
        </motion.div>

        {/* Is this right for me? */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-14"
        >
          <h3
            className="text-2xl md:text-3xl font-extrabold text-center mb-8"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Is this <span className="gradient-text">right for me?</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {/* For you */}
            <div className="glass rounded-2xl p-6 border border-green-500/15">
              <p className="text-green-400 text-xs font-semibold tracking-widest uppercase mb-5 flex items-center gap-2">
                <CheckCircle2 size={14} aria-hidden="true" />
                This is for you if…
              </p>
              <ul className="space-y-3">
                {[
                  'You have an engaged audience but no digital product yet',
                  'You\'ve thought about launching something but don\'t know where to start',
                  'You want passive income without the months of building it yourself',
                  'You\'re a creator, influencer, coach or personal brand',
                  'You\'d rather promote than produce',
                  'You want a professional product that reflects your brand\'s quality',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/65 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Not for you */}
            <div className="glass rounded-2xl p-6 border border-red-500/12">
              <p className="text-red-400 text-xs font-semibold tracking-widest uppercase mb-5 flex items-center gap-2">
                <XCircle size={14} aria-hidden="true" />
                This isn't for you if…
              </p>
              <ul className="space-y-3">
                {[
                  'You have fewer than 1,000 engaged followers',
                  'You want full creative control over every single detail',
                  'You\'re looking for a get rich quick scheme with no effort',
                  'You\'re not willing to promote the product to your audience',
                  'You already have a team building products in house',
                  'You\'re not ready to have a conversation about your goals',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/65 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <FAQItem
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
