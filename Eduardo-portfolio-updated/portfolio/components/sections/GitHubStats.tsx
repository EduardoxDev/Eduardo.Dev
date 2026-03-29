'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Star, Users, BookOpen, GitFork, ArrowUpRight, Calendar } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { PERSONAL } from '@/lib/data'
import { useLocale } from '@/lib/locale-context'

interface GitHubData {
  username: string; name: string; publicRepos: number
  followers: number; following: number; stars: number
  topLangs: [string, number][]
}

const LANG_COLORS: Record<string, string> = {
  Go: '#00ADD8', Java: '#ED8B00', 'C++': '#F34B7D',
  TypeScript: '#3178C6', Python: '#3572A5', JavaScript: '#F7DF1E',
  Rust: '#DEA584', C: '#555555', HTML: '#E34F26', CSS: '#1572B6',
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0; const step = Math.ceil(value / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(start)
    }, 25)
    return () => clearInterval(timer)
  }, [value])
  return <>{display.toLocaleString()}</>
}

function ContribGrid() {
  const weeks = 26; const days = 7
  const grid = Array.from({ length: weeks }, () =>
    Array.from({ length: days }, () => Math.floor(Math.random() * 5)))
  const colors = ['#0d1117', '#0e4429', '#006d32', '#26a641', '#39d353']
  return (
    <div className="flex gap-[3px]">
      {grid.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((level, di) => (
            <motion.div key={di}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (wi * 7 + di) * 0.003, duration: 0.2 }}
              className="w-[10px] h-[10px] rounded-[2px]"
              style={{ background: colors[level] }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function GitHubStats() {
  const [data, setData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useLocale()

  useEffect(() => {
    fetch('/api/github')
      .then(r => r.json()).then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const totalLangRepos = data?.topLangs.reduce((a, [, n]) => a + n, 0) || 1
  const stats = data ? [
    { icon: BookOpen, labelKey: 'gh_repos',     value: data.publicRepos, color: '#60a5fa' },
    { icon: Star,     labelKey: 'gh_stars',     value: data.stars,       color: '#fbbf24' },
    { icon: Users,    labelKey: 'gh_followers', value: data.followers,   color: '#22d3ee' },
    { icon: GitFork,  labelKey: 'gh_following', value: data.following,   color: '#a78bfa' },
  ] : []

  return (
    <section className="relative z-10 py-24 px-6 lg:px-12 max-w-6xl mx-auto">
      <SectionHeader index="07" title={t('section_github')} subtitle={t('github_subtitle')} />

      {loading ? (
        <div className="flex items-center gap-3 font-mono text-sm text-slate-600">
          <motion.div className="w-2 h-2 rounded-full bg-accent-green"
            animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
          {t('gh_fetching')}
        </div>
      ) : !data ? (
        <p className="font-mono text-sm text-slate-600">{t('gh_error')}</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          <Reveal>
            <div className="bg-bg border border-border rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-accent-green/10 to-transparent p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg-2 flex items-center justify-center border border-accent-green/30">
                      <Github size={18} className="text-accent-green" />
                    </div>
                    <div>
                      <a href={PERSONAL.github} target="_blank" rel="noopener noreferrer"
                        className="font-sans font-bold text-white hover:text-accent-green transition-colors flex items-center gap-2">
                        @{data.username}
                        <ArrowUpRight size={12} className="text-slate-600" />
                      </a>
                      <p className="font-mono text-[11px] text-slate-500">{data.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-green/10 border border-accent-green/20 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                    <span className="font-mono text-[10px] text-accent-green uppercase tracking-widest">{t('gh_active')}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 p-4 gap-3">
                {stats.map(({ icon: Icon, labelKey, value, color }, i) => (
                  <motion.div
                    key={labelKey}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i }}
                    className="bg-bg-2 border border-border p-4 hover:border-accent-green/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon size={14} style={{ color }} />
                    </div>
                    <p className="font-sans font-black text-2xl text-white tabular-nums">
                      <AnimatedNumber value={value} />
                    </p>
                    <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mt-1">{t(labelKey)}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-bg border border-border rounded-lg overflow-hidden h-full">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-accent-green" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('gh_contribution')}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto pb-2 mb-4"><ContribGrid /></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-700">Less</span>
                    {['#0d1117','#0e4429','#006d32','#26a641','#39d353'].map(c => (
                      <div key={c} className="w-[10px] h-[10px] rounded-[2px]" style={{ background: c }} />
                    ))}
                    <span className="font-mono text-[10px] text-slate-700">More</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-2">
            <div className="bg-bg border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('gh_top_langs')}</p>
              </div>
              <div className="p-4">
                <div className="mb-4 h-3 flex rounded-full overflow-hidden gap-px">
                  {data.topLangs.map(([lang, count]) => {
                    const pct = (count / totalLangRepos) * 100
                    const color = LANG_COLORS[lang] ?? '#60a5fa'
                    return (
                      <motion.div key={lang} className="h-full" style={{ background: color }}
                        initial={{ width: 0 }} whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                    )
                  })}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {data.topLangs.map(([lang, count], i) => {
                    const pct = Math.round((count / totalLangRepos) * 100)
                    const color = LANG_COLORS[lang] ?? '#60a5fa'
                    return (
                      <motion.div key={lang} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ delay: 0.05 * i }}
                        className="flex items-center gap-3 bg-bg-2 border border-border p-3 hover:border-accent-green/30 transition-colors">
                        <div className="relative w-8 h-8 shrink-0">
                          <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
                            <circle cx="16" cy="16" r="12" fill="none" stroke="#ffffff08" strokeWidth="3" />
                            <motion.circle cx="16" cy="16" r="12" fill="none" stroke={color} strokeWidth="3"
                              strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 12}`}
                              initial={{ strokeDashoffset: 2 * Math.PI * 12 }}
                              whileInView={{ strokeDashoffset: 2 * Math.PI * 12 * (1 - pct / 100) }}
                              viewport={{ once: true }} transition={{ delay: 0.1 * i, duration: 0.9, ease: 'easeOut' }} />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px]" style={{ color }}>{pct}%</span>
                        </div>
                        <div>
                          <p className="font-mono text-xs text-slate-300">{lang}</p>
                          <p className="font-mono text-[10px] text-slate-700">{count} {t('gh_repos_count')}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      )}
    </section>
  )
}
