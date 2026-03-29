'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { HireMeModal } from '@/components/ui/HireMeModal'

const NAV_KEYS = [
  { key: 'nav_about', href: '#about' },
  { key: 'nav_stack', href: '#stack' },
  { key: 'nav_projects', href: '#projects' },
  { key: 'nav_experience', href: '#experience' },
  { key: 'nav_blog', href: '/blog' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hireOpen, setHireOpen] = useState(false)
  const [logoSrc, setLogoSrc] = useState('/stakcr-logo.png')
  const { t } = useLocale()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-0 top-0 z-50 w-full transition-[padding,box-shadow] duration-500 ease-in-out ${
          scrolled ? 'p-2' : 'p-4 sm:p-8'
        }`}
      >
        <div
          className={`mx-auto flex h-[3.75rem] max-w-7xl items-center justify-between rounded-2xl border px-4 sm:px-8 transition-all duration-500 ${
            scrolled
              ? 'border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl'
              : 'border-white/5 bg-white/5 backdrop-blur-md'
          }`}
        >
          <Link
            href="/"
            className="relative z-10 flex items-center gap-3 transition hover:opacity-80"
          >
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/10">
              <Image
                src={logoSrc}
                alt=""
                width={36}
                height={36}
                className="object-cover"
                priority
                onError={() => setLogoSrc('/photo.png')}
              />
            </div>
            <span className="font-syne text-sm font-bold tracking-tight text-white sm:inline">
              Eduardo<span className="text-accent-green">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 overflow-hidden rounded-full border border-white/5 bg-white/[0.03] p-1 lg:flex">
            {NAV_KEYS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 transition-all hover:bg-white/5 hover:text-white"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <button
              type="button"
              onClick={() => setHireOpen(true)}
              className="hidden rounded-xl border border-white/10 bg-white/5 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-200 transition hover:bg-white/10 hover:text-white md:inline-flex"
            >
              {t('hire_me')}
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-white/5 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/95 backdrop-blur-xl shadow-xl lg:hidden"
            >
              <div className="flex flex-col gap-1 p-3">
                {NAV_KEYS.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="rounded-xl px-3 py-2.5 font-mono text-xs uppercase tracking-widest text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-accent-green"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3 md:hidden">
                  <LanguageSwitcher />
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      setHireOpen(true)
                    }}
                    className="rounded-xl border border-accent-green/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-accent-green"
                  >
                    {t('hire_me')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <HireMeModal open={hireOpen} onClose={() => setHireOpen(false)} />
    </>
  )
}
