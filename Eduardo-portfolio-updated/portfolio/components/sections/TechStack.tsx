'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { TECH_STACK } from '@/lib/data'
import { useLocale } from '@/lib/locale-context'
import type { TechItem } from '@/types'

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

const TECH_LOGOS: Record<string, string> = {
  Java: `${DEVICON}/java/java-original.svg`,
  Go: `${DEVICON}/go/go-original-wordmark.svg`,
  'C++': `${DEVICON}/cplusplus/cplusplus-original.svg`,
  TypeScript: `${DEVICON}/typescript/typescript-original.svg`,
  'Spring Boot': `${DEVICON}/spring/spring-original.svg`,
  'Go (net/http)': `${DEVICON}/go/go-original-wordmark.svg`,
  'REST APIs': `${DEVICON}/swagger/swagger-original.svg`,
  'API Gateway': `${DEVICON}/nginx/nginx-original.svg`,
  Kubernetes: `${DEVICON}/kubernetes/kubernetes-plain.svg`,
  Docker: `${DEVICON}/docker/docker-original.svg`,
  Linux: `${DEVICON}/linux/linux-original.svg`,
  'CI/CD': `${DEVICON}/github/github-original.svg`,
  PostgreSQL: `${DEVICON}/postgresql/postgresql-original.svg`,
  MySQL: `${DEVICON}/mysql/mysql-original.svg`,
  MongoDB: `${DEVICON}/mongodb/mongodb-original.svg`,
  Redis: `${DEVICON}/redis/redis-original.svg`,
  'IntelliJ IDEA': `${DEVICON}/intellij/intellij-original.svg`,
  Git: `${DEVICON}/git/git-original.svg`,
  Figma: `${DEVICON}/figma/figma-original.svg`,
}

function TechLogo({ item }: { item: TechItem }) {
  const [failed, setFailed] = useState(false)
  const logo = TECH_LOGOS[item.name]

  if (!logo || failed) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] font-mono text-xs font-semibold text-slate-300">
        {item.name.slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    <img
      src={logo}
      alt={item.name}
      width={32}
      height={32}
      className="h-8 w-8 object-contain"
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ imageRendering: 'crisp-edges' }}
    />
  )
}

function TechDetailPanel({
  item,
  onClose,
}: {
  item: TechItem
  onClose: () => void
}) {
  const { t } = useLocale()
  const desc = item.descriptionKey ? t(item.descriptionKey) : ''

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
        aria-label="Fechar"
      />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0c] shadow-[0_24px_64px_rgba(0,0,0,0.65)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-slate-500 transition hover:border-white/20 hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="p-6 pt-8">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] p-2">
              <TechLogo item={item} />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{t('tech_stack_modal_title')}</p>
              <h3 className="mt-1 font-sans text-xl font-bold tracking-tight text-white">{item.name}</h3>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-4 rounded-sm ${i < item.level ? 'bg-sky-500' : 'bg-white/[0.08]'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <Sparkles size={14} strokeWidth={1.5} />
              <span className="font-mono text-[10px] uppercase tracking-widest">Stack</span>
            </div>
            <p className="font-mono text-[13px] leading-relaxed text-slate-400">{desc}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function MarqueeBadge({
  item,
  onSelect,
}: {
  item: TechItem
  onSelect: (item: TechItem) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="group flex h-16 min-w-[170px] shrink-0 items-center gap-3.5 rounded-xl border border-white/[0.1] bg-[#0f0f0f] px-5 transition duration-200 hover:border-sky-400/40 hover:bg-[#1a1a1a] hover:shadow-lg hover:shadow-sky-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/30 active:scale-[0.98]"
    >
      <TechLogo item={item} />
      <span className="whitespace-nowrap font-sans text-[15px] font-semibold tracking-tight text-white">
        {item.name}
      </span>
    </button>
  )
}

function MarqueeRow({
  items,
  reverse,
  onSelect,
}: {
  items: TechItem[]
  reverse?: boolean
  onSelect: (item: TechItem) => void
}) {
  const track = [...items, ...items]

  return (
    <div className="tech-stack-fade overflow-hidden py-2.5">
      <div className={reverse ? 'tech-marquee-track-r' : 'tech-marquee-track-l'}>
        {track.map((item, idx) => (
          <MarqueeBadge key={`${item.name}-${idx}`} item={item} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

export function TechStack() {
  const { t } = useLocale()
  const [selected, setSelected] = useState<TechItem | null>(null)

  const allItems = TECH_STACK.flatMap((c) => c.items)
  const mid = Math.ceil(allItems.length / 2)
  const row1 = allItems.slice(0, mid)
  const row2 = allItems.slice(mid)

  return (
    <section
      id="stack"
      className={`relative z-10 overflow-x-clip bg-black py-24 ${selected ? 'tech-stack-paused' : ''}`}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <SectionHeader align="center" index="02" title={t('section_stack')} subtitle={t('tech_stack_subtitle')} />
      </div>

      <Reveal>
        <div className="relative mx-auto mt-2 max-w-6xl px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col gap-2 sm:gap-3">
            <MarqueeRow items={row1} onSelect={setSelected} />
            <MarqueeRow items={row2} reverse onSelect={setSelected} />
          </div>
        </div>
      </Reveal>

      <AnimatePresence>
        {selected && <TechDetailPanel item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}
