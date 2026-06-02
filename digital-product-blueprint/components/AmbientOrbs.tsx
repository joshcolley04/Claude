'use client'

import { motion, useReducedMotion } from 'framer-motion'

export default function AmbientOrbs() {
  const shouldReduce = useReducedMotion()

  const orbs = [
    { size: 600, x: '10%', y: '15%', color: 'rgba(59,130,246,0.07)', duration: 18, delay: 0 },
    { size: 400, x: '75%', y: '30%', color: 'rgba(99,102,241,0.06)', duration: 22, delay: 3 },
    { size: 500, x: '50%', y: '60%', color: 'rgba(6,182,212,0.05)', duration: 26, delay: 6 },
    { size: 350, x: '85%', y: '75%', color: 'rgba(139,92,246,0.06)', duration: 20, delay: 9 },
    { size: 450, x: '20%', y: '80%', color: 'rgba(59,130,246,0.05)', duration: 24, delay: 4 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={shouldReduce ? {} : {
            x: [0, 40, -20, 30, 0],
            y: [0, -30, 20, -15, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
