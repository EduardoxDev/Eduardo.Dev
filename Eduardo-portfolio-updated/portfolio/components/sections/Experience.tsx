'use client'

import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { EXPERIENCE } from '@/lib/data'
import { useLocale } from '@/lib/locale-context'
import { MapPin, Calendar } from 'lucide-react'

export function Experience() {
  const { t } = useLocale()
  return (
    <section id="experience" className="relative z-10 py-24 px-6 lg:px-12 max-w-6xl mx-auto">
      <SectionHeader index="04" title={t('section_experience')} subtitle={t('exp_subtitle')} />

      <div className="space-y-4">
        {EXPERIENCE.map((exp, i) => (
          <Reveal key={exp.company} delay={0.05 * i}>
            <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden hover:border-white/[0.12] transition-colors">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="font-sans font-bold text-xl text-white tracking-tight mb-1">
                      {exp.company}
                    </h3>
                    <p className="font-mono text-sm text-sky-400 mb-2">
                      {exp.roleKey ? t(exp.roleKey) : exp.role}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span className="font-mono text-xs">{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        <span className="font-mono text-xs">{exp.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="font-mono text-sm text-slate-400 leading-relaxed mb-4">
                  {t(exp.descriptionKey)}
                </p>

                <div className="space-y-2 mb-5">
                  {exp.impactKeys.map((key) => (
                    <div key={key} className="flex items-start gap-3">
                      <span className="text-sky-400 mt-1 shrink-0">•</span>
                      <span className="font-mono text-sm text-slate-400 leading-relaxed">{t(key)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((tech) => (
                    <span 
                      key={tech} 
                      className="font-mono text-[11px] px-2.5 py-1 bg-white/[0.03] border border-white/[0.06] text-slate-500 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
