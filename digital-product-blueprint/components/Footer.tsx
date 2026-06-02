import { BOOKING_URL } from '@/lib/utils'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 py-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white/60 text-sm font-semibold">
              The Digital Product Blueprint™
            </p>
            <p className="text-white/25 text-xs mt-1">
              Helping creators monetise their audience through premium digital products.
            </p>
          </div>

          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            {[
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'FAQ', href: '#faq' },
              { label: 'Book a Free Strategy Meeting', href: BOOKING_URL, external: true },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-white/35 hover:text-white text-sm transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className="text-white/20 text-xs">
            © {currentYear} The Digital Product Blueprint™. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
