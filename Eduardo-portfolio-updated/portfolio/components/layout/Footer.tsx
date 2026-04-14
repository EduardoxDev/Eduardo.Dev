import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { PERSONAL } from '@/lib/data'

export function Footer() {
  return (
    <footer className="relative z-10 mt-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="font-mono text-sm text-slate-400 group-hover:text-white transition-colors">
                {PERSONAL.name}
              </span>
            </Link>

            <div className="text-center">
              <p className="font-mono text-xs text-slate-500">
                © {new Date().getFullYear()} — Built with Next.js & TypeScript
              </p>
              <p className="font-mono text-[10px] text-slate-600 mt-1 uppercase tracking-widest">
                Open to Work
              </p>
            </div>

            <div className="flex items-center gap-4">
              {[
                { href: PERSONAL.github, icon: Github, label: 'GitHub' },
                { href: PERSONAL.linkedin, icon: Linkedin, label: 'LinkedIn' },
                { href: `mailto:${PERSONAL.email}`, icon: Mail, label: 'Email' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-12" />
    </footer>
  )
}
