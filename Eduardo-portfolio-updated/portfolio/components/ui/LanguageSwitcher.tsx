'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { LOCALES } from '@/lib/i18n'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[1]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-accent-green transition-colors px-2 py-1.5 border border-transparent hover:border-accent-green/20"
        aria-label="Switch language"
      >
        <Globe size={12} />
        <span>{current.flag}</span>
        <span className="hidden sm:block uppercase tracking-widest">{current.code}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 bg-[#0d1117] border border-white/[0.08] shadow-2xl min-w-[160px]"
            >
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => { setLocale(loc.code); setOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 font-mono text-xs text-left transition-colors ${
                    locale === loc.code
                      ? 'text-accent-green bg-accent-green/5'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <span>{loc.flag}</span>
                  <span>{loc.label}</span>
                  {locale === loc.code && (
                    <span className="ml-auto w-1 h-1 rounded-full bg-accent-green" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
