'use client'

import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { Locale } from './i18n'
import { translations } from './i18n'

interface LocaleContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (k) => k,
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null
    if (stored && translations[stored]) {
      setLocaleState(stored)
    } else {
      const lang = navigator.language
      if (lang.startsWith('pt')) setLocaleState('pt-BR')
      else if (lang.startsWith('zh')) setLocaleState('zh')
      else if (lang.startsWith('es')) setLocaleState('es')
      else if (lang.startsWith('fr')) setLocaleState('fr')
      else setLocaleState('en')
    }
  }, [])

  const value = useMemo(() => ({
    locale,
    setLocale: (l: Locale) => {
      setLocaleState(l)
      localStorage.setItem('locale', l)
    },
    t: (key: string) => translations[locale]?.[key] ?? translations['en']?.[key] ?? key,
  }), [locale])

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
