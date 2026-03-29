'use client'

import { useEffect, useState, memo, type ComponentType } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Mail, Cpu, Globe, Lock, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { PERSONAL } from '@/lib/data'
import { useLocale } from '@/lib/locale-context'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(to / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= to) {
        setVal(to)
        clearInterval(timer)
      } else setVal(start)
    }, 30)
    return () => clearInterval(timer)
  }, [to])
  return (
    <>
      {val}
      {suffix}
    </>
  )
}

const FloatingNode = memo(
  ({ icon: Icon, delay, x, y }: { icon: ComponentType<any>; delay: number; x: string; y: string }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{
        opacity: [0.25, 0.5, 0.25],
        scale: 1,
        y: ['0px', '20px', '0px'],
      }}
      transition={{
        delay,
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute hidden lg:flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/25 bg-black/35 backdrop-blur-md"
      style={{ left: x, top: y }}
    >
      <Icon size={18} className="text-sky-300/70" />
    </motion.div>
  )
)
FloatingNode.displayName = 'FloatingNode'

export function Hero() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const yTranslate = useTransform(scrollY, [0, 500], [0, 80])
  const parallaxY = useTransform(scrollY, [0, 500], [0, 40])

  const { t } = useLocale()
  const [heroEarthOk, setHeroEarthOk] = useState(true)

  return (
    <section id="hero" className="relative flex min-h-[100vh] items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
          {heroEarthOk ? (
            <Image
              src="/hero-earth.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_30%] sm:object-[50%_34%]"
              onError={() => setHeroEarthOk(false)}
            />
          ) : (
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_100%,rgba(8,47,73,0.9)_0%,#000_55%)]"
              aria-hidden
            />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/50 to-black/82" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_65%_at_50%_22%,rgba(14,165,233,0.12),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_100%,rgba(0,180,255,0.08),transparent_55%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.11] bg-[linear-gradient(to_right,rgba(56,189,248,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"
          aria-hidden
        />
      </div>

      <FloatingNode icon={Cpu} delay={0.2} x="12%" y="25%" />
      <FloatingNode icon={Globe} delay={0.5} x="82%" y="30%" />
      <FloatingNode icon={Lock} delay={0.8} x="15%" y="65%" />
      <FloatingNode icon={Zap} delay={1.1} x="85%" y="70%" />

      <motion.div
        style={{ opacity, y: yTranslate }}
        className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-28 text-center md:pt-32"
      >
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.4em] text-sky-400/80">
            {t('hero_eyebrow')} — <span className="text-white">ED01</span>
          </p>
        </motion.div>

        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <h1 className="font-syne text-6xl font-extrabold leading-none tracking-tighter text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.85)] md:text-8xl">
            {PERSONAL.name.split(' ')[0]}
          </h1>
        </motion.div>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto mb-10 max-w-2xl font-mono text-sm leading-relaxed text-slate-200/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)]"
        >
          {t('personal_bio')}
        </motion.p>

        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="mb-12 flex flex-wrap justify-center gap-4">
          <Link
            href="#projects"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-white px-8 py-4 text-sm font-bold text-black shadow-[0_0_28px_rgba(255,255,255,0.18)] transition-all hover:pr-10"
          >
            <span className="relative z-10">{t('view_projects')}</span>
            <ArrowRight size={18} className="absolute right-4 opacity-0 transition-all group-hover:opacity-100" />
          </Link>
          <a
            href={`mailto:${PERSONAL.email}`}
            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-black/40 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:border-sky-400/40 hover:bg-black/55"
          >
            {t('contact')}
          </a>
        </motion.div>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto grid max-w-lg grid-cols-3 gap-8 border-t border-white/10 pt-10"
        >
          {[
            { labelKey: 'years_exp', value: 5, suffix: '+' },
            { labelKey: 'open_source', value: 6, suffix: '' },
            { labelKey: 'tech_items', value: 20, suffix: '+' },
          ].map((s) => (
            <div key={s.labelKey} className="group cursor-default">
              <p className="font-syne text-3xl font-bold tabular-nums text-white transition group-hover:text-sky-300">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-sky-400/75">{t(s.labelKey)}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-6 hidden flex-col gap-6 lg:flex"
      >
        {[
          { icon: Github, href: PERSONAL.github },
          { icon: Linkedin, href: PERSONAL.linkedin },
          { icon: Mail, href: `mailto:${PERSONAL.email}` },
        ].map(({ icon: Icon, href }, i) => (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 transition-colors hover:text-sky-400"
          >
            <Icon size={18} />
          </a>
        ))}
        <div className="mx-auto h-20 w-px bg-white/15" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 right-6 hidden origin-right rotate-90 items-center gap-4 lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">{t('scroll')}</span>
        <div className="h-px w-12 bg-white/15" />
      </motion.div>
    </section>
  )
}
