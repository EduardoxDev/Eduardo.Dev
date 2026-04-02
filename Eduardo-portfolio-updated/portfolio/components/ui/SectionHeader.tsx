import { Reveal } from './Reveal'

interface SectionHeaderProps {
  index: string
  title: string
  subtitle?: string
  /** Centered layout (e.g. Tech Stack hero-style block). */
  align?: 'left' | 'center'
}

export function SectionHeader({ index, title, subtitle, align = 'left' }: SectionHeaderProps) {
  if (align === 'center') {
    return (
      <div className="mb-14 md:mb-16">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="mb-5 inline-flex font-mono text-[10px] uppercase tracking-[0.35em] text-slate-400 border border-white/[0.12] bg-white/[0.03] px-2.5 py-1">
              {index}
            </span>
            <h2 className="font-sans text-4xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
            {subtitle && (
              <p className="mt-5 max-w-lg font-mono text-sm leading-relaxed text-slate-500">{subtitle}</p>
            )}
          </div>
        </Reveal>
      </div>
    )
  }

  return (
    <div className="mb-16">
      <Reveal>
        <div className="mb-4 flex items-center gap-4">
          <span className="border border-accent-green/20 bg-accent-green/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.3em] text-accent-green">
            {index}
          </span>
          <div className="h-px max-w-[120px] flex-1" style={{ background: 'linear-gradient(90deg, rgba(96,165,250,0.4), transparent)' }} />
        </div>
        <h2 className="relative inline-block font-sans text-4xl font-black tracking-tight text-white md:text-5xl">
          {title}
          <span
            className="absolute -bottom-1 left-0 h-px w-1/3"
            style={{ background: 'linear-gradient(90deg, rgba(96,165,250,0.6), transparent)' }}
          />
        </h2>
        {subtitle && (
          <p className="mt-4 max-w-xl font-mono text-sm leading-relaxed text-slate-500">{subtitle}</p>
        )}
      </Reveal>
    </div>
  )
}
