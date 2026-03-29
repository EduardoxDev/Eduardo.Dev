import type { Metadata } from 'next'
import '../styles/globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PageTransition } from '@/components/ui/PageTransition'
import { LocaleProvider } from '@/lib/locale-context'
import { PERSONAL } from '@/lib/data'

export const metadata: Metadata = {
  metadataBase: new URL('https://eduardomaciel.dev'),
  title: {
    default: `${PERSONAL.name} — ${PERSONAL.title}`,
    template: `%s | ${PERSONAL.name}`,
  },
  description: PERSONAL.bio,
  keywords: ['Software Engineer', 'CTO', 'Distributed Systems', 'Backend', 'Go', 'Java', 'Kubernetes', 'Stackr Hosting'],
  authors: [{ name: PERSONAL.name }],
  icons: {
    icon: '/photo.png',
    apple: '/photo.png',
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${PERSONAL.name} — ${PERSONAL.title}`,
    description: PERSONAL.bio,
    type: 'website',
    url: 'https://eduardomaciel.dev',
    siteName: PERSONAL.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${PERSONAL.name} — ${PERSONAL.title}`,
    description: PERSONAL.bio,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-bg text-slate-200 antialiased overflow-x-hidden">
        <LocaleProvider>
          <div className="noise-overlay noise-overlay--subtle" aria-hidden />
          <Navbar />
          <main className="relative z-10">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  )
}
