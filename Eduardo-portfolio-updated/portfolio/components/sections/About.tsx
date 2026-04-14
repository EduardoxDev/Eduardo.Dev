'use client'

import Image from 'next/image'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { PERSONAL } from '@/lib/data'
import { useLocale } from '@/lib/locale-context'
import { MapPin, Briefcase } from 'lucide-react'

function RichText({ text }: { text: string }) {
  const parts = text.split(/(<green>.*?<\/green>|<white>.*?<\/white>)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('<green>'))
          return <span key={i} className="text-sky-400">{part.replace(/<\/?green>/g, '')}</span>
        if (part.startsWith('<white>'))
          return <span key={i} className="text-white font-semibold">{part.replace(/<\/?white>/g, '')}</span>
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
      
      <Reveal>
        <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden">
          <div className="grid md:grid-cols-[280px_1fr] gap-0">
            <div className="border-r border-white/[0.06]">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image 
                  src="/phot.png" 
                  alt={PERSONAL.name} 
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 280px" 
                  priority 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              </div>
              <div className="p-5 border-t border-white/[0.06]">
                <h3 className="font-sans font-bold text-lg text-white mb-1">{PERSONAL.name}</h3>
                <p className="font-mono text-sm text-sky-400 mb-4">{t("personal_title")}</p>
                
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={14} />
                    <span className="font-mono text-xs">{PERSONAL.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Briefcase size={14} />
                    <span className="font-mono text-xs">{PERSONAL.company}</span>
                  </div>
                </div>

                {!PERSONAL.available && (
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-xs text-emerald-400 font-semibold">Open to Work</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <p className="font-mono text-sm text-slate-400 leading-relaxed mb-4">
                  <RichText text={t('about_p1')} />
                </p>
                <p className="font-mono text-sm text-slate-400 leading-relaxed mb-4">
                  <RichText text={t('about_p2')} />
                </p>
                <p className="font-mono text-sm text-slate-400 leading-relaxed mb-6">
                  <RichText text={t('about_p3')} />
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/[0.06]">
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 text-center">
                  <p className="font-sans text-2xl font-black text-white mb-1">5+</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Years Coding</p>
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 text-center">
                  <p className="font-sans text-2xl font-black text-white mb-1">15+</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Projects</p>
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 text-center">
                  <p className="font-sans text-2xl font-black text-sky-400 mb-1">∞</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Learning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
