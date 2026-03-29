import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { PERSONAL } from '@/lib/data'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] mt-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 shrink-0 border border-accent-green/20 flex items-center justify-center group-hover:border-accent-green/50 transition-all" style={{ background: 'rgba(96,165,250,0.04)' }}>
            <span className="font-mono font-black text-[10px] text-accent-green/60 group-hover:text-accent-green transition-colors">E</span>
          </div>
          <span className="font-mono text-xs text-slate-600 group-hover:text-slate-400 transition-colors">
            {PERSONAL.name}
          </span>
        </Link>

        <div className="text-center">
          <p className="font-mono text-xs text-slate-700">
            © {new Date().getFullYear()} — Built with Next.js & TypeScript
          </p>
          <p className="font-mono text-[10px] text-slate-800 mt-1 uppercase tracking-widest">
            Open to Work · MIT Aspirant
          </p>
        </div>

        <div className="flex items-center gap-5">
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
              className="text-slate-700 hover:text-accent-green transition-colors"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
