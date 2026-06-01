'use client'

import { useState, useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { formatNumber } from '@/lib/utils'

const PRODUCT_PRICE = 97
const LEAD_RATE = 0.05
const CONVERSION_RATE = 0.03

export default function RevenueCalculator() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [audienceSize, setAudienceSize] = useState(10000)
  const [engagementRate, setEngagementRate] = useState(3)

  const results = useMemo(() => {
    const engaged = audienceSize * (engagementRate / 100)
    const leads = Math.round(engaged * LEAD_RATE)
    const customers = Math.round(leads * CONVERSION_RATE + leads * 0.04)
    const revenue = customers * PRODUCT_PRICE
    return { leads, customers, revenue }
  }, [audienceSize, engagementRate])

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
      min: 0.5,
      max: 15,
      step: 0.5,
      onChange: setEngagementRate,
      format: (v: number) => `${v}%`,
      id: 'engagement-rate',
    },
  ]

  const resultCards = [
    { label: 'Estimated Leads', value: results.leads.toLocaleString('en-GB'), sublabel: 'per launch' },
    { label: 'Estimated Customers', value: results.customers.toLocaleString('en-GB'), sublabel: 'conversions' },
    { label: 'Revenue Potential', value: formatNumber(results.revenue), sublabel: `based on £${PRODUCT_PRICE} product`, highlight: true },
  ]

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
          <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Revenue Potential
          </p>
          <h2
            id="calculator-title"
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            What Could Your Audience
            <br />
            <span className="gradient-text">Be Worth?</span>
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            Adjust the sliders to estimate your revenue potential. These are illustrative figures based on typical creator launch benchmarks.
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
                  <label
                    htmlFor={slider.id}
                    className="text-white font-medium text-sm"
                  >
                    {slider.label}
                  </label>
                  <span className="text-blue-400 font-bold text-lg tabular-nums">
                    {slider.format(slider.value)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    id={slider.id}
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={slider.value}
                    onChange={(e) => slider.onChange(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                        ((slider.value - slider.min) / (slider.max - slider.min)) * 100
                      }%, rgba(255,255,255,0.1) ${
                        ((slider.value - slider.min) / (slider.max - slider.min)) * 100
                      }%, rgba(255,255,255,0.1) 100%)`,
                    }}
                    aria-valuenow={slider.value}
                    aria-valuemin={slider.min}
                    aria-valuemax={slider.max}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-white/30 text-xs">{slider.format(slider.min)}</span>
                  <span className="text-white/30 text-xs">{slider.format(slider.max)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {resultCards.map((card, i) => (
              <motion.div
                key={card.label}
                layout
                className={`rounded-2xl p-6 text-center ${
                  card.highlight
                    ? 'bg-blue-600/15 border border-blue-500/30'
                    : 'bg-white/4 border border-white/8'
                }`}
              >
                <motion.p
                  key={card.value}
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`text-3xl font-black mb-1 tabular-nums ${
                    card.highlight ? 'text-blue-300 text-glow' : 'text-white'
                  }`}
                >
                  {card.value}
                </motion.p>
                <p className="text-white/60 text-sm font-medium mb-1">{card.label}</p>
                <p className="text-white/30 text-xs">{card.sublabel}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-white/25 text-xs mt-6 leading-relaxed">
            Estimates are illustrative only. Actual results vary based on audience quality, product type, pricing and launch execution.
            Assumes a £{PRODUCT_PRICE} product price, {(LEAD_RATE * 100).toFixed(0)}% lead rate on engaged followers and ~{(CONVERSION_RATE * 100).toFixed(0)}–7% conversion.
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid rgba(59,130,246,0.5);
          box-shadow: 0 0 12px rgba(59,130,246,0.4);
          transition: box-shadow 0.2s;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          box-shadow: 0 0 20px rgba(59,130,246,0.6);
        }
        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid rgba(59,130,246,0.5);
          box-shadow: 0 0 12px rgba(59,130,246,0.4);
        }
      `}</style>
    </section>
  )
}
