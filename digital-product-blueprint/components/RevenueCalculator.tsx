'use client'

import { useState, useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BOOKING_URL } from '@/lib/utils'

const LAUNCH_CONVERSION = 0.20
const LAUNCHES_PER_YEAR = 4

export default function RevenueCalculator() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [audienceSize, setAudienceSize] = useState(10000)
  const [engagementRate, setEngagementRate] = useState(5)
  const [productPrice, setProductPrice] = useState(94)

  const results = useMemo(() => {
    const engagedAudience = Math.round(audienceSize * (engagementRate / 100))
    const customers = Math.round(engagedAudience * LAUNCH_CONVERSION)
    const revenuePerLaunch = customers * productPrice
    const annualProjection = revenuePerLaunch * LAUNCHES_PER_YEAR
    return { engagedAudience, customers, revenuePerLaunch, annualProjection }
  }, [audienceSize, engagementRate, productPrice])

  const sliders = [
    {
      label: 'Audience Size',
      value: audienceSize,
      min: 1000,
      max: 1000000,
      step: 1000,
      onChange: setAudienceSize,
      format: (v: number) => v.toLocaleString('en-GB'),
      id: 'audience-size',
    },
    {
      label: 'Engagement Rate',
      value: engagementRate,
      min: 1,
      max: 30,
      step: 0.5,
      onChange: setEngagementRate,
      format: (v: number) => `${v}%`,
      id: 'engagement-rate',
    },
    {
      label: 'Product Price',
      value: productPrice,
      min: 10,
      max: 999,
      step: 1,
      onChange: setProductPrice,
      format: (v: number) => `£${v}`,
      id: 'product-price',
    },
  ]

  const formatCurrency = (v: number) =>
    '£' + v.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  return (
    <section
      id="calculator"
      className="relative py-24 md:py-32"
      aria-labelledby="calculator-title"
    >
      <div ref={ref} className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-3">
            Income Estimator
          </p>
          <h2
            id="calculator-title"
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Run The Numbers
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-white/80 mb-4">
            See what your{' '}
            <span className="gradient-text">audience can earn</span>
          </p>
          <p className="text-white/45 text-base max-w-lg mx-auto">
            Adjust the inputs below and watch your estimated digital product income update in real time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="glass-strong rounded-3xl p-8 md:p-12 glow-blue"
        >
          {/* Sliders */}
          <div className="space-y-10 mb-12">
            {sliders.map((slider) => (
              <div key={slider.id}>
                <div className="flex items-center justify-between mb-4">
                  <label htmlFor={slider.id} className="text-white/60 text-xs font-semibold tracking-widest uppercase">
                    {slider.label}
                  </label>
                  <span className="text-white font-bold text-xl tabular-nums">
                    {slider.format(slider.value)}
                  </span>
                </div>
                <input
                  id={slider.id}
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={slider.value}
                  onChange={(e) => slider.onChange(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                      ((slider.value - slider.min) / (slider.max - slider.min)) * 100
                    }%, rgba(255,255,255,0.08) ${
                      ((slider.value - slider.min) / (slider.max - slider.min)) * 100
                    }%, rgba(255,255,255,0.08) 100%)`,
                  }}
                  aria-valuenow={slider.value}
                  aria-valuemin={slider.min}
                  aria-valuemax={slider.max}
                />
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/6 mb-10" />

          {/* Result cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {/* Est. Revenue Per Launch */}
            <motion.div
              layout
              className="md:col-span-1 rounded-2xl p-6 bg-blue-600/15 border border-blue-500/30 text-center"
            >
              <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-3">
                Est. Revenue Per Launch
              </p>
              <motion.p
                key={results.revenuePerLaunch}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="text-4xl font-black text-white text-glow mb-2 tabular-nums"
              >
                {formatCurrency(results.revenuePerLaunch)}
              </motion.p>
              <p className="text-white/35 text-xs leading-relaxed">
                Based on {(LAUNCH_CONVERSION * 100).toFixed(0)}% launch conversion of your engaged audience
              </p>
            </motion.div>

            {/* Annual Projection */}
            <motion.div
              layout
              className="md:col-span-1 rounded-2xl p-6 bg-white/4 border border-white/8 text-center"
            >
              <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-3">
                Annual Projection ({LAUNCHES_PER_YEAR} Launches)
              </p>
              <motion.p
                key={results.annualProjection}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="text-4xl font-black text-white mb-2 tabular-nums"
              >
                {formatCurrency(results.annualProjection)}
              </motion.p>
              <p className="text-white/35 text-xs leading-relaxed">
                Scaling with consistent product releases
              </p>
            </motion.div>

            {/* Engaged Audience */}
            <motion.div
              layout
              className="md:col-span-1 rounded-2xl p-6 bg-white/4 border border-white/8 text-center"
            >
              <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-3">
                Engaged Audience
              </p>
              <motion.p
                key={results.engagedAudience}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="text-4xl font-black text-white mb-2 tabular-nums"
              >
                {results.engagedAudience.toLocaleString('en-GB')}
              </motion.p>
              <p className="text-white/35 text-xs leading-relaxed">
                People actively seeing and interacting with your content
              </p>
            </motion.div>
          </div>

          <p className="text-center text-white/25 text-xs mb-8 leading-relaxed">
            Estimates use industry-standard conversion benchmarks. Actual results depend on your niche, offer quality, and how you launch.
          </p>

          {/* CTA */}
          <div className="text-center">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1"
            >
              Turn This Into Reality
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 3px solid #050505;
          box-shadow: 0 0 0 2px #3B82F6, 0 0 16px rgba(59,130,246,0.5);
          transition: box-shadow 0.2s;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 2px #3B82F6, 0 0 24px rgba(59,130,246,0.7);
        }
        input[type='range']::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 3px solid #050505;
          box-shadow: 0 0 0 2px #3B82F6, 0 0 16px rgba(59,130,246,0.5);
        }
      `}</style>
    </section>
  )
}
