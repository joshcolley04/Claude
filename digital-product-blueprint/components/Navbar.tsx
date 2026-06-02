'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { BOOKING_URL } from '@/lib/utils'

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Revenue Potential', href: '#calculator' },
  { label: 'Why Creators Choose This', href: '#features' },
  { label: 'What We Build', href: '#product-types' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Book a Free Strategy Meeting', href: '#booking', isBooking: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = ['how-it-works', 'benefits', 'calculator', 'features', 'product-types', 'faq', 'booking']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.2, rootMargin: '-80px 0px 0px 0px' }
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (href: string, isBooking?: boolean) => {
    setMenuOpen(false)
    if (isBooking) {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      const id = href.replace('#', '')
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-2 left-4 right-4 z-50 rounded-2xl transition-all duration-500 ${
          scrolled ? 'glass-strong shadow-2xl shadow-black/50' : 'glass'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-sm font-semibold text-white tracking-tight hover:text-blue-400 transition-colors duration-200"
            aria-label="Go to top"
          >
            <span className="gradient-text-subtle font-bold">
              The Digital Product Blueprint™
            </span>
          </button>

          {/* Hamburger — shown on all screen sizes */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-all border border-white/8"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : (
              <div className="flex flex-col gap-1.5 w-5">
                <span className="block h-px bg-current rounded-full" />
                <span className="block h-px bg-current rounded-full" />
                <span className="block h-px bg-current rounded-full" />
              </div>
            )}
          </button>
        </div>
      </motion.nav>

      {/* Dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-20 left-4 right-4 z-50 rounded-2xl glass-strong border border-white/10 overflow-hidden"
            >
              <div className="p-3">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                  >
                    {link.isBooking ? (
                      <a
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMenuOpen(false)}
                        className="group flex items-center justify-between w-full px-4 py-3.5 mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200"
                      >
                        {link.label}
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </a>
                    ) : (
                      <button
                        onClick={() => handleNavClick(link.href, link.isBooking)}
                        className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          activeSection === link.href.replace('#', '')
                            ? 'text-blue-400 bg-blue-500/10'
                            : 'text-white/70 hover:text-white hover:bg-white/6'
                        }`}
                      >
                        {link.label}
                        {activeSection === link.href.replace('#', '') && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        )}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
