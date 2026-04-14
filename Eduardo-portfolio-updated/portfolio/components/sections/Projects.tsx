'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, ChevronRight, Code2 } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { PROJECTS } from '@/lib/data'
import type { Project } from '@/types'
import { useLocale } from '@/lib/locale-context'

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const { t } = useLocale()

  return (
    <Reveal delay={0.05 * index}>
      <motion.div
        className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden hover:border-white/[0.12] transition-colors"
      >
        <div 
          className="p-6 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="font-sans font-bold text-xl text-white tracking-tight">{project.title}</h3>
                {project.featured && (
                  <span className="font-mono text-[9px] uppercase tracking-wider text-sky-400 border border-sky-400/25 px-2 py-0.5 rounded">
                    {t('proj_featured')}
                  </span>
                )}
              </div>
              <p className="font-mono text-sm text-slate-500 leading-relaxed">
                {t(project.descriptionKey)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center text-slate-500 hover:text-white hover:border-white/[0.15] transition-colors"
              >
                <Github size={16} />
              </a>
              {project.demo && (
                <a 
                  href={project.demo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center text-slate-500 hover:text-white hover:border-white/[0.15] transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              )}
              <motion.div 
                animate={{ rotate: expanded ? 90 : 0 }} 
                transition={{ duration: 0.2 }} 
                className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center text-slate-500"
              >
                <ChevronRight size={16} />
              </motion.div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span 
                key={tech} 
                className="font-mono text-[11px] px-2.5 py-1 bg-white/[0.03] border border-white/[0.06] text-slate-500 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} 
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-white/[0.06]"
            >
              <div className="p-6 space-y-4">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600 mb-2">{t('proj_overview')}</p>
                  <p className="font-mono text-sm text-slate-400 leading-relaxed">{t(project.longDescriptionKey)}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600 mb-2">{t('proj_problem')}</p>
                    <p className="font-mono text-sm text-slate-400 leading-relaxed">{t(project.problemKey)}</p>
                  </div>
                  <div className="rounded-xl border border-sky-400/[0.15] bg-sky-400/[0.03] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-sky-400 mb-2">{t('proj_impact')}</p>
                    <p className="font-mono text-sm text-sky-300/80 leading-relaxed">{t(project.impactKey)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reveal>
  )
}

export function Projects() {
  const { t } = useLocale()
  return (
    <section id="projects" className="relative z-10 py-24 px-6 lg:px-12 max-w-6xl mx-auto">
      <SectionHeader index="03" title={t('section_projects')} subtitle={t('proj_subtitle')} />
      <div className="space-y-4">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
