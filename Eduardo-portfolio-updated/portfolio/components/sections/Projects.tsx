'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, ChevronRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { PROJECTS } from '@/lib/data'
import type { Project } from '@/types'
import { useLocale } from '@/lib/locale-context'

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { t } = useLocale()

  return (
    <Reveal delay={0.05 * index}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative border-b border-white/[0.05] last:border-b-0"
      >
        <motion.div className="absolute inset-0 bg-accent-green/[0.02] pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

        <div className="relative flex items-center gap-4 px-6 py-5 cursor-pointer"
          onClick={() => setExpanded(!expanded)}>
          <span className="font-mono text-[11px] text-slate-700 w-6 shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h3 className="font-sans font-black text-white text-lg tracking-tight">{project.title}</h3>
              {project.featured && (
                <span className="font-mono text-[9px] uppercase tracking-widest text-accent-green border border-accent-green/25 px-2 py-0.5 shrink-0">
                  {t('proj_featured')}
                </span>
              )}
            </div>
            <p className="font-mono text-[12px] text-slate-500 leading-relaxed truncate">
              {t(project.descriptionKey)}
            </p>
          </div>
          <div className="hidden lg:flex flex-wrap gap-1.5 max-w-xs justify-end">
            {project.tech.slice(0, 3).map((tech) => (
              <span key={tech} className="font-mono text-[10px] px-2 py-0.5 bg-white/[0.03] border border-white/[0.05] text-slate-600 uppercase tracking-wider">
                {tech}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="font-mono text-[10px] px-2 py-0.5 text-slate-700">+{project.tech.length - 3}</span>
            )}
          </div>
          <span className="font-mono text-[11px] text-slate-700 shrink-0 hidden sm:block">{project.year}</span>
          <div className="flex items-center gap-2 shrink-0">
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-slate-700 hover:text-accent-green transition-colors p-1">
              <Github size={14} />
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-slate-700 hover:text-accent-green transition-colors p-1">
                <ExternalLink size={14} />
              </a>
            )}
            <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }} className="text-slate-700">
              <ChevronRight size={14} />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden">
              <div className="px-6 pb-6 pt-0 border-t border-white/[0.04]">
                <div className="grid sm:grid-cols-3 gap-4 mt-4">
                  <div className="sm:col-span-3 lg:col-span-1">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600 mb-2">{t('proj_overview')}</p>
                    <p className="font-mono text-[12px] text-slate-500 leading-loose">{t(project.longDescriptionKey)}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.tech.map((tech) => (
                        <span key={tech} className="font-mono text-[10px] px-2 py-0.5 bg-white/[0.03] border border-white/[0.05] text-slate-600 uppercase tracking-wider">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.04] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600 mb-2">{t('proj_problem')}</p>
                    <p className="font-mono text-[12px] text-slate-500 leading-loose">{t(project.problemKey)}</p>
                  </div>
                  <div className="bg-accent-green/[0.03] border border-accent-green/[0.08] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-accent-green/60 mb-2">{t('proj_impact')}</p>
                    <p className="font-mono text-[12px] text-accent-green/80 leading-loose">{t(project.impactKey)}</p>
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 font-mono text-[11px] text-slate-600 hover:text-accent-green transition-colors">
                      <Github size={11} /> {t('proj_view_github')}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="absolute left-0 top-0 bottom-0 w-px bg-accent-green"
          animate={{ scaleY: hovered || expanded ? 1 : 0, opacity: hovered || expanded ? 1 : 0 }}
          transition={{ duration: 0.25 }} style={{ originY: 0 }} />
      </motion.div>
    </Reveal>
  )
}

export function Projects() {
  const { t } = useLocale()
  return (
    <section id="projects" className="relative z-10 py-24 px-6 lg:px-12 max-w-6xl mx-auto">
      <SectionHeader index="03" title={t('section_projects')} subtitle={t('proj_subtitle')} />
      <div className="border border-white/[0.06] bg-[#090d11]">
        <div className="flex items-center gap-4 px-6 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="font-mono text-[10px] text-slate-700 w-6 shrink-0">#</span>
          <span className="font-mono text-[10px] text-slate-700 uppercase tracking-widest flex-1">{t('proj_col_project')}</span>
          <span className="font-mono text-[10px] text-slate-700 uppercase tracking-widest hidden lg:block w-64 text-right">{t('proj_col_stack')}</span>
          <span className="font-mono text-[10px] text-slate-700 uppercase tracking-widest hidden sm:block w-10 text-center">{t('proj_col_year')}</span>
          <span className="font-mono text-[10px] text-slate-700 uppercase tracking-widest w-16 text-right">{t('proj_col_links')}</span>
        </div>
        {PROJECTS.map((project, i) => (
          <ProjectRow key={project.slug} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
