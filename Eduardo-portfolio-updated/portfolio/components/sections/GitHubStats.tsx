'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Star, Users, BookOpen, GitFork, ArrowUpRight, TrendingUp, Code2 } from 'lucide-react'
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
    { icon: BookOpen, labelKey: 'gh_repos',     value: data.publicRepos, color: '#60a5fa', gradient: 'from-blue-500/20 to-blue-600/5' },
    { icon: Star,     labelKey: 'gh_stars',     value: data.stars,       color: '#fbbf24', gradient: 'from-yellow-500/20 to-yellow-600/5' },
    { icon: Users,    labelKey: 'gh_followers', value: data.followers,   color: '#22d3ee', gradient: 'from-cyan-500/20 to-cyan-600/5' },
    { icon: GitFork,  labelKey: 'gh_following', value: data.following,   color: '#a78bfa', gradient: 'from-purple-500/20 to-purple-600/5' },
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
        <div className="space-y-4">
          <Reveal>
            <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden">
              <div className="border-b border-white/[0.06] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                      <Github size={22} className="text-white" />
                    </div>
                    <div>
                      <a href={PERSONAL.github} target="_blank" rel="noopener noreferrer"
                        className="font-sans font-bold text-lg text-white hover:text-sky-400 transition-colors flex items-center gap-2 group">
                        @{data.username}
                        <ArrowUpRight size={14} className="text-slate-600 group-hover:text-sky-400 transition-colors" />
                      </a>
                      <p className="font-mono text-xs text-slate-500 mt-0.5">{data.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">{t('gh_active')}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
                {stats.map(({ icon: Icon, labelKey, value, color }, i) => (
                  <motion.div
                    key={labelKey}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i, duration: 0.4 }}
                    className="bg-[#0a0a0a] p-6 hover:bg-white/[0.02] transition-colors group"
                  >
                    <Icon size={18} style={{ color }} className="mb-3" />
                    <p className="font-sans font-black text-3xl text-white tabular-nums mb-1">
                      <AnimatedNumber value={value} />
                    </p>
                    <p className="font-mono text-[10px] text-slate-600 uppercase tracking-wider">{t(labelKey)}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden">
              <div className="border-b border-white/[0.06] p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                    <Code2 size={18} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="font-sans font-bold text-white">{t('gh_top_langs')}</p>
                    <p className="font-mono text-xs text-slate-600">Most used technologies</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {data.topLangs.map(([lang, count], i) => {
                    const pct = Math.round((count / totalLangRepos) * 100)
                    const color = LANG_COLORS[lang] ?? '#60a5fa'
                    return (
                      <motion.div 
                        key={lang} 
                        initial={{ opacity: 0, y: 10 }} 
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} 
                        transition={{ delay: 0.05 * i, duration: 0.4 }}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 hover:border-white/[0.12] hover:bg-white/[0.03] transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                          <span className="font-mono text-[10px] text-slate-600">{count}</span>
                        </div>
                        <p className="font-sans font-bold text-sm text-white mb-2">{lang}</p>
                        <div className="relative h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                          <motion.div 
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{ background: color }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i, duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                        <p className="font-mono text-[10px] text-slate-600 mt-2">{pct}%</p>
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
