'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Check,
  TrendingUp,
  Rocket,
  Gauge,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

type Tone = 'green' | 'amber' | 'red' | 'blue'

const toneStyles: Record<
  Tone,
  { icon: string; badge: string; glow: string }
> = {
  green: {
    icon: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    glow: 'shadow-[0_0_12px_rgba(52,211,153,0.12)]',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    glow: 'shadow-[0_0_12px_rgba(251,191,36,0.12)]',
  },
  red: {
    icon: 'bg-red-500/10 text-red-400 border-red-500/20',
    badge: 'text-red-400 bg-red-500/10 border-red-500/20',
    glow: 'shadow-[0_0_12px_rgba(248,113,113,0.14)]',
  },
  blue: {
    icon: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    badge: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.12)]',
  },
}

function FeedRow({
  Icon,
  tone,
  badge,
  time,
  message,
  active,
}: {
  Icon: LucideIcon
  tone: Tone
  badge: string
  time: string
  message: string
  active: boolean
}) {
  const s = toneStyles[tone]
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0.42, scale: active ? 1 : 0.985 }}
      transition={{ duration: 0.35 }}
      className={`rounded-xl border border-white/[0.06] bg-black/40 p-3 ${active ? s.glow : ''}`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${s.icon}`}
        >
          <Icon size={16} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-md border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${s.badge}`}>
              {badge}
            </span>
            <span className="font-mono text-[10px] text-slate-600">{time}</span>
          </div>
          <p className="mt-2 font-mono text-[11px] leading-relaxed text-slate-400">
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function LiveCard({
  title,
  desc,
  rows,
}: {
  title: string
  desc: string
  rows: {
    Icon: LucideIcon
    tone: Tone
    badgeKey: string
    timeKey: string
    msgKey: string
  }[]
}) {
  const { t } = useLocale()
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIdx((j) => (j + 1) % rows.length), 2400)
    return () => clearInterval(id)
  }, [rows.length])

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0c0c0c] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.5)] transition hover:border-accent-green/20 hover:shadow-[0_24px_60px_rgba(56,189,248,0.08)]">
      <div className="relative mb-4 min-h-[220px] space-y-2 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 bg-gradient-to-t from-[#0c0c0c] to-transparent" />
        {rows.map((row, i) => (
          <FeedRow
            key={`${row.badgeKey}-${i}`}
            Icon={row.Icon}
            tone={row.tone}
            badge={t(row.badgeKey)}
            time={t(row.timeKey)}
            message={t(row.msgKey)}
            active={i === idx}
          />
        ))}
      </div>
      <h3 className="font-sans text-lg font-bold tracking-tight text-white">{title}</h3>
      <p className="mt-2 font-mono text-xs leading-relaxed text-slate-500">{desc}</p>
    </div>
  )
}

export function HeroLiveShowcase() {
  const { t } = useLocale()

  const deployRows = [
    {
      Icon: Check,
      tone: 'green' as const,
      badgeKey: 'hero_feed_d1_badge',
      timeKey: 'hero_feed_d1_time',
      msgKey: 'hero_feed_d1_msg',
    },
    {
      Icon: TrendingUp,
      tone: 'amber' as const,
      badgeKey: 'hero_feed_d2_badge',
      timeKey: 'hero_feed_d2_time',
      msgKey: 'hero_feed_d2_msg',
    },
    {
      Icon: Rocket,
      tone: 'blue' as const,
      badgeKey: 'hero_feed_d3_badge',
      timeKey: 'hero_feed_d3_time',
      msgKey: 'hero_feed_d3_msg',
    },
  ]

  const monitorRows = [
    {
      Icon: Gauge,
      tone: 'blue' as const,
      badgeKey: 'hero_feed_m1_badge',
      timeKey: 'hero_feed_m1_time',
      msgKey: 'hero_feed_m1_msg',
    },
    {
      Icon: ShieldCheck,
      tone: 'green' as const,
      badgeKey: 'hero_feed_m2_badge',
      timeKey: 'hero_feed_m2_time',
      msgKey: 'hero_feed_m2_msg',
    },
    {
      Icon: AlertTriangle,
      tone: 'red' as const,
      badgeKey: 'hero_feed_m3_badge',
      timeKey: 'hero_feed_m3_time',
      msgKey: 'hero_feed_m3_msg',
    },
  ]

  return (
    <div className="relative z-[1] border-t border-white/[0.06] bg-black/40 px-6 py-14 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">{t('hero_live_label')}</p>
        <div className="grid gap-6 md:grid-cols-2">
          <LiveCard title={t('hero_live_c1_title')} desc={t('hero_live_c1_desc')} rows={deployRows} />
          <LiveCard title={t('hero_live_c2_title')} desc={t('hero_live_c2_desc')} rows={monitorRows} />
        </div>
      </div>
    </div>
  )
}
