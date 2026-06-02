'use client'

import { motion, useReducedMotion } from 'framer-motion'

export default function BeamEffect() {
  const shouldReduce = useReducedMotion()

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Top beam */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: 2,
          height: '40vh',
          background: 'linear-gradient(to bottom, rgba(59,130,246,0.6), transparent)',
          filter: 'blur(1px)',
        }}
        animate={shouldReduce ? {} : {
          opacity: [0.4, 0.9, 0.4],
          scaleX: [1, 1.5, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Horizontal sweep */}
      <motion.div
        className="absolute top-0 left-0 right-0"
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.3) 30%, rgba(99,102,241,0.4) 50%, rgba(59,130,246,0.3) 70%, transparent 100%)',
        }}
        animate={shouldReduce ? {} : {
          y: ['0vh', '100vh'],
          opacity: [0, 0.6, 0.6, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 6,
        }}
      />
      {/* Corner beams */}
      {[
        { left: 0, top: 0, rotate: 45 },
        { right: 0, top: 0, rotate: -45 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            ...pos,
            width: 1,
            height: '30vh',
            background: 'linear-gradient(to bottom, rgba(99,102,241,0.4), transparent)',
            transformOrigin: 'top center',
            rotate: pos.rotate,
          }}
          animate={shouldReduce ? {} : {
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5,
            delay: i * 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
