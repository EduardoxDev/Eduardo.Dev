'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Boxes,
  ShieldCheck,
  Layers,
  Code2,
  Activity,
  Library,
  X,
  ExternalLink,
} from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { PRINCIPLES } from '@/lib/data'
import { useLocale } from '@/lib/locale-context'
import { useState } from 'react'

const ICON_MAP = {
  systems: Boxes,
  availability: ShieldCheck,
  scalable: Layers,
  learn: Code2,
  ops: Activity,
  depth: Library,
} as const

type Principle = (typeof PRINCIPLES)[number]

function PrincipleGlyph({ id, className = '' }: { id: keyof typeof ICON_MAP; className?: string }) {
  const I = ICON_MAP[id]
  return (
    <span
      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent-green/30 bg-gradient-to-br from-sky-500/[0.12] to-accent-green/[0.08] text-sky-200 shadow-[0_0_28px_rgba(56,189,248,0.15)] ${className}`}
    >
      <I className="h-5 w-5" strokeWidth={1.5} />
    </span>
  )
}

interface PrinciplePanelProps {
  principle: Principle
  onClose: () => void
}

function PrinciplePanel({ principle, onClose }: PrinciplePanelProps) {
  const { t } = useLocale()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-lg w-full rounded-2xl border border-accent-green/25 bg-bg-2 p-6 shadow-2xl shadow-sky-950/30">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 transition-colors hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="mb-4 flex items-start gap-3">
          <PrincipleGlyph id={principle.iconId} className="mb-0" />
          <h3 className="font-sans text-xl font-bold leading-snug tracking-tight text-white pt-1">
            {t(principle.titleKey)}
          </h3>
        </div>

        <p className="mb-6 font-mono text-sm leading-relaxed text-slate-400">{t(principle.descKey)}</p>

        <div className="border-t border-white/[0.06] pt-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-600">Aplicação Prática</p>
          <div className="space-y-2">
            {principle.titleKey === 'princ_systems' && (
              <>
                <p className="font-mono text-xs text-slate-500">→ {t('princ_systems_app1')}</p>
                <p className="font-mono text-xs text-slate-500">→ {t('princ_systems_app2')}</p>
              </>
            )}
            {principle.titleKey === 'princ_availability' && (
              <>
                <p className="font-mono text-xs text-slate-500">→ {t('princ_availability_app1')}</p>
                <p className="font-mono text-xs text-slate-500">→ {t('princ_availability_app2')}</p>
              </>
            )}
            {principle.titleKey === 'princ_scalable' && (
              <>
                <p className="font-mono text-xs text-slate-500">→ {t('princ_scalable_app1')}</p>
                <p className="font-mono text-xs text-slate-500">→ {t('princ_scalable_app2')}</p>
              </>
            )}
            {principle.titleKey === 'princ_learn' && (
              <>
                <p className="font-mono text-xs text-slate-500">→ {t('princ_learn_app1')}</p>
                <p className="font-mono text-xs text-slate-500">→ {t('princ_learn_app2')}</p>
              </>
            )}
            {principle.titleKey === 'princ_ops' && (
              <>
                <p className="font-mono text-xs text-slate-500">→ {t('princ_ops_app1')}</p>
                <p className="font-mono text-xs text-slate-500">→ {t('princ_ops_app2')}</p>
              </>
            )}
            {principle.titleKey === 'princ_depth' && (
              <>
                <p className="font-mono text-xs text-slate-500">→ {t('princ_depth_app1')}</p>
                <p className="font-mono text-xs text-slate-500">→ {t('princ_depth_app2')}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function Principles() {
  const { t } = useLocale()
  const [selectedPrinciple, setSelectedPrinciple] = useState<Principle | null>(null)

  return (
    <>
      <section id="principles" className="relative z-10 mx-auto max-w-6xl px-6 py-24 lg:px-12">
        <SectionHeader index="05" title={t('section_principles')} subtitle={t('principles_subtitle')} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.titleKey} delay={0.06 * i}>
              <motion.button
                type="button"
                onClick={() => setSelectedPrinciple(p)}
                className="group relative h-full w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 text-left shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition hover:border-accent-green/25 hover:shadow-[0_24px_60px_rgba(56,189,248,0.1)]"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-500/10 blur-2xl transition group-hover:bg-accent-green/12" />
                <PrincipleGlyph id={p.iconId} className="mb-5" />
                <h3 className="mb-2 font-sans text-sm font-bold tracking-tight text-white">{t(p.titleKey)}</h3>
                <p className="line-clamp-2 font-mono text-xs leading-relaxed text-slate-600 transition group-hover:text-slate-500">
                  {t(p.descKey)}
                </p>
                <div className="mt-4 flex items-center gap-1 font-mono text-[10px] text-accent-green/80 opacity-0 transition group-hover:opacity-100">
                  <span>{t('princ_cta_more')}</span>
                  <ExternalLink size={10} />
                </div>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedPrinciple && (
          <PrinciplePanel principle={selectedPrinciple} onClose={() => setSelectedPrinciple(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
