'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'
import { BookOpen, Layout, Palette, Cpu, Wrench, GraduationCap, ArrowRight, X } from 'lucide-react'
import { BOOKING_URL } from '@/lib/utils'

const products = [
  {
    icon: BookOpen,
    tag: 'Ebooks & Guides',
    headline: 'Your Knowledge, Packaged and Sold',
    description:
      'You already know things your audience desperately wants to learn. Ebooks and guides turn that expertise into a tangible, sellable asset — no camera, no course platform, no filming required.',
    painPoints: [
      "You've been sharing free value for years with nothing to show for it",
      'Your audience keeps asking the same questions — you need a scalable answer',
      'You want to monetise without being on camera or recording content',
    ],
    examples: ['Step-by-step strategy guides', 'Niche playbooks', 'Industry reports', 'How-to PDF guides'],
    color: 'from-blue-600/15 to-transparent',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: Layout,
    tag: 'Digital Templates',
    headline: 'Done-For-Them Tools They\'ll Actually Use',
    description:
      'Templates are one of the highest-converting digital products because they solve an immediate, specific problem. Your audience buys once and gets instant value — making refunds rare and reviews glowing.',
    painPoints: [
      "Your followers want results but don't know where to start",
      'You need a product that sells itself with minimal explanation',
      'You want something that works across multiple niches and audiences',
    ],
    examples: ['Notion dashboards', 'Canva social media packs', 'Excel/Google Sheets trackers', 'Email swipe files'],
    color: 'from-indigo-600/15 to-transparent',
    border: 'border-indigo-500/20',
    iconBg: 'bg-indigo-500/15',
    iconColor: 'text-indigo-400',
    tagColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    icon: Palette,
    tag: 'Brand Kits',
    headline: 'Help Your Audience Look the Part',
    description:
      'Every creator, small business owner and entrepreneur in your audience wants to look professional. Brand kits give them a complete visual identity in minutes — and they\'ll credit you every time they use it.',
    painPoints: [
      'Your audience struggles to look polished and professional online',
      'Design costs are pricing your followers out of building their brand',
      'You want a premium product that justifies a higher price point',
    ],
    examples: ['Logo suites', 'Social media brand packs', 'Colour palette & font guides', 'Content creator starter kits'],
    color: 'from-violet-600/15 to-transparent',
    border: 'border-violet-500/20',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    tagColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  },
  {
    icon: Cpu,
    tag: 'Interactive Apps',
    headline: 'Tools That Keep Them Coming Back',
    description:
      'Interactive digital tools and calculators are among the most shared and bookmarked products online. They provide ongoing value, drive word-of-mouth referrals, and position you as an authority in your space.',
    painPoints: [
      'You want a product that feels premium and justifies a higher price',
      "Static PDFs aren't cutting it — your audience wants something they can use",
      'You need something shareable that brings new leads to your brand',
    ],
    examples: ['Revenue calculators', 'Habit & goal trackers', 'Audit tools', 'Quiz-based assessments'],
    color: 'from-cyan-600/15 to-transparent',
    border: 'border-cyan-500/20',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    icon: Wrench,
    tag: 'Custom Builds',
    headline: 'A Product as Unique as Your Brand',
    description:
      'Not every creator fits a template. If you have a specific idea, a unique community need, or a product concept that doesn\'t exist yet — we\'ll build it from scratch, engineered entirely around your audience.',
    painPoints: [
      "You have a product idea but no idea how to build it",
      'Off-the-shelf products don\'t reflect your brand or your audience\'s needs',
      'You want something proprietary that competitors can\'t easily copy',
    ],
    examples: ['Bespoke membership portals', 'Custom content hubs', 'Private community tools', 'Branded resource libraries'],
    color: 'from-orange-600/15 to-transparent',
    border: 'border-orange-500/20',
    iconBg: 'bg-orange-500/15',
    iconColor: 'text-orange-400',
    tagColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  },
  {
    icon: GraduationCap,
    tag: 'Online Courses',
    headline: 'The Highest-Ticket Product in Your Arsenal',
    description:
      'Online courses command the highest price points of any digital product — and for good reason. They transform your audience\'s results. We handle curriculum design, production, platform setup and delivery so you just show up and teach.',
    painPoints: [
      'You know you could charge more but don\'t have the infrastructure to deliver it',
      "Building a course feels overwhelming — you don't know where to start",
      'You want recurring, predictable revenue from a single product launch',
    ],
    examples: ['Video-based masterclasses', 'Self-paced learning programmes', 'Cohort courses with community', 'Mini-courses and workshops'],
    color: 'from-emerald-600/15 to-transparent',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
]

function ProductModal({ product, onClose }: { product: typeof products[0]; onClose: () => void }) {
  const Icon = product.icon

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={product.tag}
        className={`relative w-full max-w-lg glass-strong rounded-3xl p-8 border bg-gradient-to-b ${product.color} ${product.border} max-h-[90vh] overflow-y-auto`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className={`w-12 h-12 rounded-xl ${product.iconBg} flex items-center justify-center mb-5`}>
          <Icon size={22} className={product.iconColor} aria-hidden="true" />
        </div>

        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${product.tagColor}`}>
          {product.tag}
        </span>

        <h3 className="text-white font-extrabold text-2xl mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {product.headline}
        </h3>
        <p className="text-white/55 text-sm leading-relaxed mb-6">{product.description}</p>

        <div className="mb-6">
          <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-3">Common Pain Points</p>
          <div className="space-y-2">
            {product.painPoints.map((point) => (
              <div key={point} className="flex items-start gap-3">
                <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${product.iconColor.replace('text-', 'bg-')}`} />
                <p className="text-white/60 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-3">Examples</p>
          <div className="flex flex-wrap gap-2">
            {product.examples.map((ex) => (
              <span key={ex} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-white/60 text-xs">
                {ex}
              </span>
            ))}
          </div>
        </div>

        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35"
        >
          Book a Free Strategy Call
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </a>
      </motion.div>
    </motion.div>
  )
}

export default function ProductTypesSection() {
  const shouldReduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)

  return (
    <>
      <section
        id="product-types"
        className="relative py-24 md:py-32"
        aria-labelledby="product-types-title"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(59,130,246,0.04) 0%, transparent 100%)',
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
              What We Build
            </p>
            <h2
              id="product-types-title"
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Six Types of Digital Products
              <br />
              <span className="gradient-text">Built Around Your Audience</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
              Every creator's audience is different. We match the right product format to your niche,
              your followers, and your revenue goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product, i) => {
              const Icon = product.icon
              return (
                <motion.div
                  key={product.tag}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={shouldReduce ? {} : { y: -6, transition: { duration: 0.25 } }}
                  className={`group relative rounded-2xl p-7 bg-gradient-to-b ${product.color} border ${product.border} flex flex-col cursor-default transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/30`}
                >
                  <div className={`w-12 h-12 rounded-xl ${product.iconBg} flex items-center justify-center mb-5`}>
                    <Icon size={22} className={product.iconColor} aria-hidden="true" />
                  </div>

                  <span className={`inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${product.tagColor}`}>
                    {product.tag}
                  </span>

                  <h3 className="text-white font-bold text-lg mb-3 leading-snug">
                    {product.headline}
                  </h3>

                  <p className="text-white/50 text-sm leading-relaxed mb-6 flex-1">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.examples.slice(0, 2).map((ex) => (
                      <span key={ex} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-white/50 text-xs">
                        {ex}
                      </span>
                    ))}
                    {product.examples.length > 2 && (
                      <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-white/30 text-xs">
                        +{product.examples.length - 2} more
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="group/btn flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 text-white/70 hover:text-white text-sm font-semibold transition-all duration-200"
                  >
                    Find Out More
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
