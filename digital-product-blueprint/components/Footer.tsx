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

          <div className="text-center">
            <p className="text-white/25 text-xs mb-1">For personal enquiries</p>
            <a
              href="mailto:Scale@JoshScalesInnovations.com"
              className="text-white/40 hover:text-blue-400 text-xs transition-colors duration-200"
            >
              Scale@JoshScalesInnovations.com
            </a>
          </div>

          <p className="text-white/20 text-xs">
            © {currentYear} The Digital Product Blueprint™. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
