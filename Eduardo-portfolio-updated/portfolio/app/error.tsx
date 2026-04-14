'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/locale-context'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

function ProgressBar() {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(100), 100)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="w-full h-px bg-white/[0.06] mb-6">
      <motion.div
        className="h-full bg-[#f87171]"
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />
    </div>
  )
}

const TRACE_LINES = [
  '  at kernel.panic (/proc/sys/kernel:1)',
  '  at process.crash (/lib/runtime/error.go:42)',
  '  at async Handler.execute (/app/server.ts:187)',
  '  at async Router.handle (/app/router.ts:64)',
]

export default function Error({ error, reset }: ErrorProps) {
  const { t } = useLocale()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    console.error(error)
  }, [error])

  useEffect(() => {
    const interval = setInterval(() => setTick((n) => n + 1), 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 overflow-hidden relative font-mono">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#f87171]/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-accent-green/[0.03] rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="border border-[#f87171]/20 bg-[#090d11]">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#f87171]/10 bg-[#f87171]/[0.02]">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-[11px] text-[#f87171]/40 tracking-wider flex-1 text-center">
              KERNEL PANIC — NOT SYNCING
            </span>
          </div>

          <div className="p-6 md:p-10">
            <ProgressBar />

            <div className="mb-4">
              <span className="text-[#f87171] text-[10px] uppercase tracking-[0.2em]">
                {t('err_500_label')}
              </span>
            </div>

            <div
              className="font-sans font-black leading-none tracking-tighter select-none mb-8"
              style={{ fontSize: 'clamp(80px, 18vw, 180px)' }}
            >
              <span className="text-[#f87171]">5</span>
              <span className="text-[#f87171]/40">0</span>
              <span className="text-[#f87171]">0</span>
            </div>

            <div className="space-y-2 mb-6 border-l-2 border-[#f87171]/30 pl-4">
              <p className="text-[12px] text-slate-500">
                <span className="text-[#f87171]">PANIC</span> — {t('err_500_title')}
              </p>
              <p className="text-[12px] text-slate-600 leading-relaxed max-w-md">
                {t('err_500_desc')}
              </p>
            </div>

            <div className="bg-black/40 border border-white/[0.04] p-4 mb-8 text-[11px]">
              <p className="text-[#f87171] mb-2">Stack trace:</p>
              {TRACE_LINES.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                  className="text-slate-700 leading-relaxed"
                >
                  {line}
                </motion.p>
              ))}
              <p className="text-slate-800 mt-1">
                status: <span className="text-[#f87171]">ERR_UNHANDLED{tick % 2 === 0 ? '█' : ' '}</span>
              </p>
            </div>

            <button
              onClick={reset}
              className="inline-flex items-center gap-3 px-6 py-3 border border-accent-green/40 text-accent-green text-[11px] uppercase tracking-[0.15em] hover:bg-accent-green hover:text-bg transition-all duration-200 group"
            >
              <span className="text-accent-green/50 group-hover:text-bg transition-colors">↺</span>
              {t('err_500_btn')}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-slate-800 uppercase tracking-widest">
          system halted
        </p>
      </motion.div>
    </div>
  )
}
