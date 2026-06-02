'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function CursorGlow() {
  const shouldReduce = useReducedMotion()
  const dotRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (shouldReduce || typeof window === 'undefined') return

    let raf: number
    let mouseX = 0, mouseY = 0
    let dotX = 0, dotY = 0
    let glowX = 0, glowY = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      setVisible(true)
    }
    const onLeave = () => setVisible(false)

    const animate = () => {
      dotX += (mouseX - dotX) * 0.9
      dotY += (mouseY - dotY) * 0.9
      glowX += (mouseX - glowX) * 0.08
      glowY += (mouseY - glowY) * 0.08

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`
      }
      raf = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [shouldReduce])

  if (shouldReduce) return null

  return (
    <>
      {/* Dot cursor */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-blue-400 z-[999] pointer-events-none mix-blend-screen"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}
        aria-hidden="true"
      />
      {/* Glow orb */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-[998]"
        style={{
          opacity: visible ? 1 : 0,
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          transition: 'opacity 0.5s',
        }}
        aria-hidden="true"
      />
    </>
  )
}
