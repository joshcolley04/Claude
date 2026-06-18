'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { BookOpen, Layout, Palette, Cpu, Wrench, GraduationCap, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const products = [
  {
    slug: 'ebooks-guides',
    icon: BookOpen,
    tag: 'Ebooks & Guides',
    headline: 'Your Knowledge, Packaged and Sold',
    description:
      'Turn your expertise into a professional, sellable digital product, no camera, no tech skills, no faff. We handle structure, writing, design and delivery.',
    painPoints: [
      "You've been sharing free value for years with nothing to show for it",
      'Your audience keeps asking the same questions, you need a scalable answer',
    ],
    examples: ['Step-by-step strategy guides', 'Niche playbooks', 'Industry reports', 'How-to PDF guides'],
    color: 'from-blue-600/15 to-transparent',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    slug: 'digital-templates',
    icon: Layout,
    tag: 'Digital Templates',
    headline: "Done For Them Tools They'll Actually Use",
    description:
      'Templates are one of the highest converting digital products because the value is instant. Your audience buys once and gets results immediately.',
    painPoints: [
      "Your followers want results but don't know where to start",
      'You need a product that sells itself with minimal explanation',
    ],
    examples: ['Notion dashboards', 'Canva social media packs', 'Google Sheets trackers', 'Email swipe files'],
    color: 'from-indigo-600/15 to-transparent',
    border: 'border-indigo-500/20',
    iconBg: 'bg-indigo-500/15',
    iconColor: 'text-indigo-400',
    tagColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    slug: 'brand-kits',
    icon: Palette,
    tag: 'Brand Kits',
    headline: 'Help Your Audience Look the Part',
    description:
      'Every entrepreneur in your audience wants to look professional. Brand kits give them a complete visual identity in minutes, and they\'ll credit you every time.',
    painPoints: [
      'Your audience struggles to look polished and professional online',
      'Design costs are pricing your followers out of building their brand',
    ],
    examples: ['Logo suites', 'Social media brand packs', 'Colour palette & font guides', 'Creator starter kits'],
    color: 'from-violet-600/15 to-transparent',
    border: 'border-violet-500/20',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    tagColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  },
  {
    slug: 'interactive-apps',
    icon: Cpu,
    tag: 'Interactive Apps',
    headline: 'Tools That Keep Them Coming Back',
    description:
      'Interactive tools are the most shared and bookmarked products online. They drive word of mouth, position you as an authority and justify premium pricing.',
    painPoints: [
      'You want a product that feels premium and justifies a higher price',
      'Static PDFs aren\'t cutting it, your audience wants something interactive',
    ],
    examples: ['Revenue calculators', 'Habit & goal trackers', 'Audit tools', 'Quiz based assessments'],
    color: 'from-cyan-600/15 to-transparent',
    border: 'border-cyan-500/20',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    slug: 'custom-builds',
    icon: Wrench,
    tag: 'Custom Builds',
    headline: "A Product as Unique as Your Brand",
    description:
      'Have an idea that doesn\'t fit a template? We build it from scratch, engineered entirely around your audience. If you can describe it, we can build it.',
    painPoints: [
      'You have a product idea but no idea how to build it',
      'Off the shelf products don\'t reflect your brand or audience\'s needs',
    ],
    examples: ['Membership portals', 'Custom content hubs', 'Private community tools', 'Branded resource libraries'],
    color: 'from-orange-600/15 to-transparent',
    border: 'border-orange-500/20',
    iconBg: 'bg-orange-500/15',
    iconColor: 'text-orange-400',
    tagColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  },
  {
    slug: 'online-courses',
    icon: GraduationCap,
    tag: 'Online Courses',
    headline: 'Scale Your Expertise Into a Premium Learning Experience',
    description:
      'Online courses command the highest price points of any digital product. We handle curriculum, production, platform setup and launch, you just show up and teach.',
    painPoints: [
      'You know you could charge more but don\'t have the infrastructure',
      'Building a course feels overwhelming, you don\'t know where to start',
    ],
    examples: ['Video masterclasses', 'Self paced programmes', 'Cohort courses', 'Mini courses & workshops'],
    color: 'from-emerald-600/15 to-transparent',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    slug: 'one-to-one-mentorship',
    icon: Users,
    tag: '1:1 Mentorship',
    headline: 'The Highest Paid Product You Will Ever Sell',
    description:
      'Direct access to you is the most valuable thing your audience can buy. We build the entire premium framework around your mentorship so you can charge what you are actually worth.',
    painPoints: [
      'You know your time is valuable but have no structure around selling it',
      'You want to charge premium prices but lack the framework to justify them',
    ],
    examples: ['Private coaching programmes', 'VIP intensive days', 'Weekly mentorship retainers', 'High ticket transformation packages'],
    color: 'from-red-600/15 to-transparent',
    border: 'border-red-500/20',
    iconBg: 'bg-red-500/15',
    iconColor: 'text-red-400',
    tagColor: 'text-red-400 bg-red-500/10 border-red-500/20',
  },
]

export default function ProductTypesSection() {
  const shouldReduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
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
            Seven Types of Digital Products
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
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={shouldReduce ? {} : { y: -6, transition: { duration: 0.25 } }}
                className={`group relative rounded-2xl p-7 bg-gradient-to-b ${product.color} border ${product.border} flex flex-col transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/30`}
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

                <p className="text-white/50 text-sm leading-relaxed mb-5 flex-1">
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

                <Link
                  href={`/products/${product.slug}`}
                  className="group/btn flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 text-white/70 hover:text-white text-sm font-semibold transition-all duration-200"
                >
                  Find Out More
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
