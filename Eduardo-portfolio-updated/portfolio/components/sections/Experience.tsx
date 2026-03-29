'use client'

import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { EXPERIENCE } from '@/lib/data'
import { useLocale } from '@/lib/locale-context'

export function Experience() {
  const { t } = useLocale()
  return (
    <section id="experience" className="relative z-10 py-24 px-6 lg:px-12 max-w-6xl mx-auto">
      <SectionHeader index="04" title={t('section_experience')} subtitle={t('exp_subtitle')} />

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border hidden md:block" />

        <div className="space-y-12 md:pl-10">
          {EXPERIENCE.map((exp, i) => (
            <Reveal key={exp.company} delay={0.1 * i}>
              <div className="relative group">
                <div className="hidden md:block absolute -left-[41px] top-2 w-2 h-2 rounded-full bg-bg border border-accent-green/40 group-hover:bg-accent-green transition-colors" />

                <div className="border border-border hover:border-accent-green/20 transition-colors p-6 bg-bg hover:bg-bg-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-sans font-black text-white text-xl tracking-tight">
                        {exp.company}
                      </h3>
                      <p className="font-mono text-xs text-accent-green mt-0.5">
                        {exp.roleKey ? t(exp.roleKey) : exp.role}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-slate-500">{exp.period}</p>
                      <p className="font-mono text-[10px] text-slate-700">{exp.location}</p>
                    </div>
                  </div>

                  <p className="font-mono text-xs text-slate-500 leading-loose mb-4">
                    {t(exp.descriptionKey)}
                  </p>

                  <div className="space-y-2 mb-5">
                    {exp.impactKeys.map((key) => (
                      <div key={key} className="flex items-start gap-3">
                        <span className="text-accent-green mt-0.5 shrink-0 text-xs">→</span>
                        <span className="font-mono text-xs text-slate-400 leading-loose">{t(key)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.tech.map((tech) => (
                      <span key={tech} className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 bg-bg-3 text-slate-600 border border-border">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
