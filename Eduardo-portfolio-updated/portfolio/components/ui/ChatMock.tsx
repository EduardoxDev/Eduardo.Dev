'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/locale-context'

const BUBBLES: { key: string; side: 'left' | 'right' }[] = [
  { key: 'chat_1', side: 'left' },
  { key: 'chat_2', side: 'right' },
  { key: 'chat_3', side: 'left' },
  { key: 'chat_4', side: 'right' },
]

export function ChatMock() {
  const { t } = useLocale()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
      <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">{t('hero_chat_label')}</p>
      <div className="flex min-h-[200px] flex-col gap-2.5">
        {BUBBLES.map((b, i) => (
          <div key={b.key} className={`flex ${b.side === 'right' ? 'justify-end' : 'justify-start'}`}>
            {mounted ? (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.45, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug ${
                  b.side === 'left'
                    ? 'rounded-tl-sm border border-white/[0.06] bg-white/[0.06] text-slate-300'
                    : 'rounded-tr-sm border border-accent-green/25 bg-gradient-to-br from-sky-500/20 to-accent-green/15 text-slate-100'
                }`}
              >
                {t(b.key)}
              </motion.div>
            ) : (
              <div
                className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug opacity-40 ${
                  b.side === 'left'
                    ? 'rounded-tl-sm border border-white/[0.06] bg-white/[0.06] text-slate-300'
                    : 'rounded-tr-sm border border-accent-green/25 bg-gradient-to-br from-sky-500/20 to-accent-green/15 text-slate-100'
                }`}
              >
                {t(b.key)}
              </div>
            )}
          </div>
        ))}
      </div>
      {mounted ? (
        <motion.div
          className="mt-3 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
        >
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
          <span className="font-mono text-[10px] text-slate-600">online · typing simulated</span>
        </motion.div>
      ) : (
        <div className="mt-3 h-4" aria-hidden />
      )}
    </div>
  )
}
