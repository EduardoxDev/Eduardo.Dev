'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { PERSONAL } from '@/lib/data'
import { useLocale } from '@/lib/locale-context'

const FOCUS_AREAS = [
  { key: 'focus_distributed', label: 'Distributed Systems',   value: 'Consistency, consensus, partition tolerance' },
  { key: 'focus_backend',     label: 'Backend Engineering',   value: 'High-throughput APIs, microservices, event-driven' },
  { key: 'focus_arch',        label: 'Software Architecture', value: 'Domain-driven design, clean architecture' },
  { key: 'focus_infra',       label: 'Infrastructure',        value: 'Kubernetes, observability, chaos engineering' },
  { key: 'focus_perf',        label: 'Performance',           value: 'Profiling, optimization, capacity planning' },
]

function RichText({ text }: { text: string }) {
  const parts = text.split(/(<green>.*?<\/green>|<white>.*?<\/white>)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('<green>'))
          return <span key={i} className="text-accent-green">{part.replace(/<\/?green>/g, '')}</span>
        if (part.startsWith('<white>'))
          return <span key={i} className="text-white">{part.replace(/<\/?white>/g, '')}</span>
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

export function About() {
  const { t } = useLocale()

  return (
    <section id="about" className="relative z-10 py-24 px-6 lg:px-12 max-w-6xl mx-auto">
      <SectionHeader index="01" title={t('section_about')} subtitle={t('about_subtitle')} />
      <div className="grid md:grid-cols-[280px_1fr] gap-12 items-start mb-16">
        <Reveal direction="left">
          <div className="relative group">
            <div className="absolute -inset-px bg-gradient-to-br from-accent-green/30 via-transparent to-cyan-500/20 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-2 -left-2 w-5 h-5 border-t border-l border-accent-green/60 z-10" />
            <div className="absolute -top-2 -right-2 w-5 h-5 border-t border-r border-accent-green/60 z-10" />
            <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b border-l border-accent-green/60 z-10" />
            <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b border-r border-accent-green/60 z-10" />
            <div className="relative overflow-hidden border border-white/[0.06] aspect-[3/4]">
              <Image src="/phot.png" alt={PERSONAL.name} fill
                className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                sizes="(max-width: 768px) 100vw, 280px" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-bg/95 to-transparent">
                <p className="font-sans font-black text-white text-lg tracking-tight leading-tight">{PERSONAL.name}</p>
                <p className="font-mono text-[11px] text-accent-green">{t("personal_title")}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <span className="font-mono text-[11px] text-slate-600 uppercase tracking-widest">{PERSONAL.location}</span>
            </div>
          </div>
        </Reveal>

        <div className="space-y-5 pt-2">
          <Reveal delay={0.1}>
            <p className="font-mono text-sm text-slate-400 leading-loose">
              <RichText text={t('about_p1')} />
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="font-mono text-sm text-slate-400 leading-loose">
              <RichText text={t('about_p2')} />
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-mono text-sm text-slate-400 leading-loose">
              <RichText text={t('about_p3')} />
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="inline-flex items-center gap-3 border border-accent-green/30 px-4 py-3 bg-accent-green/5 open-to-work-badge">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-2 h-2 rounded-full bg-accent-green" style={{ boxShadow: '0 0 6px #60a5fa' }} />
                    <p className="font-mono text-xs text-accent-green font-bold uppercase tracking-widest">Open to Work</p>
                  </div>
                  <p className="font-mono text-[10px] text-slate-500">Disponível para contratação imediata</p>
                </div>
              </div>
              <a href="https://github.com/EduardoxDev" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-white/[0.07] hover:border-accent-green/30 px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                <div className="font-mono text-xl text-slate-600 group-hover:text-accent-green transition-colors">⬡</div>
                <div>
                  <p className="font-sans font-bold text-white text-sm group-hover:text-accent-green transition-colors">MIT Aspirant</p>
                  <p className="font-mono text-[10px] text-slate-600">Estudando para o MIT →</p>
                </div>
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.1}>
        <div className="border border-white/[0.06]">
          <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-600">{t('focus_title')}</span>
          </div>
          {FOCUS_AREAS.map((area) => (
            <motion.div key={area.key} whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-5 py-3.5 border-b border-white/[0.04] last:border-0 transition-colors">
              <span className="font-mono text-xs text-accent-green w-48 shrink-0">{area.label}</span>
              <span className="font-mono text-xs text-slate-600">{area.value}</span>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
