'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLocale } from '@/lib/locale-context'

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#'

function GlitchText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text)
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true)
      let iter = 0
      const inner = setInterval(() => {
        setDisplay(
          text
            .split('')
            .map((char, i) => {
              if (i < iter) return text[i]
              return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            })
            .join('')
        )
        iter += 1 / 3
        if (iter >= text.length) {
          clearInterval(inner)
          setDisplay(text)
          setGlitching(false)
        }
      }, 30)
    }, 3000)
    return () => clearInterval(interval)
  }, [text])

  return (
    <span className={glitching ? 'text-[#f87171]' : 'text-white'} style={{ transition: 'color 0.1s' }}>
      {display}
    </span>
  )
}

const SCAN_LINES = Array.from({ length: 12 }, (_, i) => i)

export default function NotFound() {
  const { t } = useLocale()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((n) => n + 1), 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 overflow-hidden relative font-mono">
      <div className="absolute inset-0 pointer-events-none">
        {SCAN_LINES.map((i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-px bg-accent-green/[0.03]"
            style={{ top: `${(i / 12) * 100}%` }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#f87171]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent-green/[0.04] rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="border border-[#f87171]/20 bg-[#090d11]">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-[11px] text-slate-600 tracking-wider flex-1 text-center">
              kernel — bash
            </span>
          </div>

          <div className="p-6 md:p-10">
            <div className="mb-6">
              <span className="text-[#f87171] text-[10px] uppercase tracking-[0.2em]">
                {t('err_404_label')}
              </span>
            </div>

            <div
              className="font-sans font-black leading-none tracking-tighter select-none mb-8"
              style={{ fontSize: 'clamp(80px, 18vw, 180px)' }}
            >
              <span className="text-[#f87171]/20">4</span>
              <GlitchText text="0" />
              <span className="text-[#f87171]/20">4</span>
            </div>

            <div className="space-y-2 mb-8 border-l-2 border-[#f87171]/30 pl-4">
              <p className="text-[12px] text-slate-500">
                <span className="text-[#f87171]">SIGSEGV</span> — {t('err_404_title')}
              </p>
              <p className="text-[12px] text-slate-600 leading-relaxed max-w-md">
                {t('err_404_desc')}
              </p>
            </div>

            <div className="font-mono text-[12px] space-y-1 mb-10 text-slate-700">
              <p><span className="text-accent-green">→</span> addr: <span className="text-[#f87171]">0x00000000</span></p>
              <p><span className="text-accent-green">→</span> pid: <span className="text-slate-500">404</span></p>
              <p><span className="text-accent-green">→</span> status: <span className="text-[#f87171]">PAGE_NOT_FOUND{tick % 2 === 0 ? '█' : ' '}</span></p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-3 px-6 py-3 border border-accent-green/40 text-accent-green text-[11px] uppercase tracking-[0.15em] hover:bg-accent-green hover:text-bg transition-all duration-200 group"
            >
              <span className="text-accent-green/50 group-hover:text-bg transition-colors">~/</span>
              {t('err_404_btn')}
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-slate-800 uppercase tracking-widest">
          core dumped
        </p>
      </motion.div>
    </div>
  )
}
