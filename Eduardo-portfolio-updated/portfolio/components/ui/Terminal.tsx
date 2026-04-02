'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PERSONAL, PROJECTS, EXPERIENCE, TECH_STACK } from '@/lib/data'
import { useLocale } from '@/lib/locale-context'

type FSNode =
  | { type: 'dir'; children: Record<string, FSNode> }
  | { type: 'file'; content: string }

function makeFilesystem(t: (k: string) => string): FSNode { return {
  type: 'dir',
  children: {
    home: {
      type: 'dir',
      children: {
        eduardo: {
          type: 'dir',
          children: {
            projects: {
              type: 'dir',
              children: Object.fromEntries(
                PROJECTS.map((p) => [
                  p.slug,
                  {
                    type: 'dir' as const,
                    children: {
                      'README.md': {
                        type: 'file' as const,
                        content: `# ${p.title}\n\n${p.longDescriptionKey}\n\nTech: ${p.tech.join(', ')}\nImpact: ${p.impactKey}\nGitHub: ${p.github}`,
                      },
                    },
                  },
                ])
              ),
            },
            'about.txt': {
              type: 'file',
              content: t('personal_bio'),
            },
            'contact.txt': {
              type: 'file',
              content: `Email:    ${PERSONAL.email}\nLinkedIn: ${PERSONAL.linkedin}\nGitHub:   ${PERSONAL.github}\nCompany:  ${PERSONAL.companyUrl}`,
            },
            '.ssh': {
              type: 'dir',
              children: {
                'id_rsa.pub': {
                  type: 'file',
                  content: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAB... eduardo@gmail.com',
                },
              },
            },
          },
        },
      },
    },
  },
} }

function resolvePath(cwd: string[], target: string): string[] | null {
  if (target === '/') return []
  const parts = target.startsWith('/')
    ? target.split('/').filter(Boolean)
    : [...cwd, ...target.split('/').filter(Boolean)]
  const resolved: string[] = []
  for (const p of parts) {
    if (p === '..') resolved.pop()
    else if (p !== '.') resolved.push(p)
  }
  return resolved
}

function getNode(path: string[], filesystem: FSNode): FSNode | null {
  let node: FSNode = filesystem
  for (const seg of path) {
    if (node.type !== 'dir') return null
    node = node.children[seg]
    if (!node) return null
  }
  return node
}

function cwdString(path: string[]): string {
  if (path.length === 0) return '/'
  return '/' + path.join('/')
}

type OutputLine = { text: string; color?: string; bold?: boolean }

interface CommandContext {
  args: string[]
  cwd: string[]
  setCwd: (p: string[]) => void
  t: (key: string) => string
  fs: FSNode
}

type CommandRegistry = Record<string, {
  desc: string
  run: (ctx: CommandContext) => OutputLine[]
}>

const COMMAND_REGISTRY: CommandRegistry = {
  help: {
    desc: 'Show available commands',
    run: ({ t }) => [
      { text: t('term_help_header'), color: '#60a5fa' },
      { text: t('term_help_help') },
      { text: t('term_help_whoami') },
      { text: t('term_help_neofetch') },
      { text: t('term_help_ls') },
      { text: t('term_help_cd') },
      { text: t('term_help_cat') },
      { text: t('term_help_pwd') },
      { text: t('term_help_projects') },
      { text: t('term_help_skills') },
      { text: t('term_help_experience') },
      { text: t('term_help_contact') },
      { text: t('term_help_man') },
      { text: t('term_help_clear') },
      { text: '  easter-egg  🥚' },
      { text: '└────────────────────────────────────────────────', color: '#60a5fa' },
      { text: t('term_help_tip'), color: '#64748b' },
    ],
  },

  whoami: {
    desc: 'Display engineer profile',
    run: ({ t }) => [
      { text: `  Name       ${PERSONAL.name}`, bold: true },
      { text: `  Title      ${t('personal_title')}`, color: '#60a5fa' },
      { text: `  Company    ${PERSONAL.company}` },
      { text: `  Location   ${PERSONAL.location}` },
      { text: `  Email      ${PERSONAL.email}` },
      { text: `  GitHub     ${PERSONAL.github}`, color: '#22d3ee' },
      { text: `  LinkedIn   ${PERSONAL.linkedin}`, color: '#22d3ee' },
      {
        text: `  Status     ${PERSONAL.available ? t('term_status_available') : t('term_status_unavailable')}`,
        color: PERSONAL.available ? '#60a5fa' : '#f87171',
      },
    ],
  },

  neofetch: {
    desc: 'System info (portfolio edition)',
    run: ({ t }) => [
      { text: '        .          eduardo@portfolio', color: '#60a5fa', bold: true },
      { text: '       /|\\         ─────────────────' },
      { text: '      / | \\        OS: Debian GNU/Linux 12' },
      { text: `     /  |  \\       Host: ${t('term_neo_host')}` },
      { text: '    /   |   \\      Kernel: 6.1.0-distributed' },
      { text: `   /    |    \\     Uptime: ${t('term_neo_uptime')}` },
      { text: '  /     |     \\    Shell: /bin/zsh' },
      { text: ' /______|______\\   Editor: IntelliJ IDEA' },
      { text: '       / \\         Languages: Java Go C++ TypeScript', color: '#60a5fa' },
      { text: '      /   \\        Infra: Kubernetes Docker Linux' },
      { text: '─────────────────────────────────────────────────' },
      { text: '  ██ ██ ██ ██ ██ ██ ██ ██', color: '#60a5fa' },
      { text: '  ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░', color: '#22d3ee' },
    ],
  },

  pwd: {
    desc: 'Print working directory',
    run: ({ cwd }) => [{ text: cwdString(cwd), color: '#60a5fa' }],
  },

  ls: {
    desc: 'List directory contents',
    run: ({ args, cwd, fs }) => {
      const target = args[0] ? resolvePath(cwd, args[0]) : cwd
      if (!target) return [{ text: 'ls: invalid path', color: '#f87171' }]
      const node = getNode(target, fs)
      if (!node) return [{ text: `ls: cannot access '${args[0]}': No such file or directory`, color: '#f87171' }]
      if (node.type === 'file') return [{ text: args[0] ?? cwdString(cwd) }]
      const entries = Object.entries(node.children)
      if (entries.length === 0) return [{ text: '(empty directory)', color: '#64748b' }]
      return entries.map(([name, n]) => ({
        text: n.type === 'dir' ? `📁 ${name}/` : `📄 ${name}`,
        color: n.type === 'dir' ? '#22d3ee' : '#e2e8f0',
      }))
    },
  },

  cd: {
    desc: 'Change directory',
    run: ({ args, cwd, setCwd, fs }) => {
      const target = args[0] ?? '/home/eduardo'
      const resolved = resolvePath(cwd, target)
      if (!resolved) return [{ text: `cd: invalid path`, color: '#f87171' }]
      const node = getNode(resolved, fs)
      if (!node) return [{ text: `cd: ${target}: No such file or directory`, color: '#f87171' }]
      if (node.type === 'file') return [{ text: `cd: ${target}: Not a directory`, color: '#f87171' }]
      setCwd(resolved)
      return []
    },
  },

  cat: {
    desc: 'Read a file',
    run: ({ args, cwd, fs }) => {
      if (!args[0]) return [{ text: 'cat: missing file operand', color: '#f87171' }]
      const resolved = resolvePath(cwd, args[0])
      if (!resolved) return [{ text: `cat: invalid path`, color: '#f87171' }]
      const node = getNode(resolved, fs)
      if (!node) return [{ text: `cat: ${args[0]}: No such file or directory`, color: '#f87171' }]
      if (node.type === 'dir') return [{ text: `cat: ${args[0]}: Is a directory`, color: '#f87171' }]
      return node.content.split('\n').map((line) => ({ text: line }))
    },
  },

  projects: {
    desc: 'List all projects',
    run: ({ t }) => [
      { text: '┌─ PROJECTS ──────────────────────────────────────', color: '#60a5fa' },
      ...PROJECTS.map((p, i) => ({
        text: `  ${String(i + 1).padStart(2, '0')}  ${p.title.padEnd(28)} ${p.year}`,
        color: p.featured ? '#e2e8f0' : '#64748b',
        bold: p.featured,
      })),
      { text: '└────────────────────────────────────────────────', color: '#60a5fa' },
      { text: t('term_projects_tip'), color: '#64748b' },
    ],
  },

  skills: {
    desc: 'Show tech stack',
    run: () =>
      TECH_STACK.flatMap((cat) => [
        { text: `  ${cat.label}`, color: '#60a5fa', bold: true },
        { text: '  ' + cat.items.map((i) => i.name).join('  ·  '), color: '#94a3b8' },
      ]),
  },

  experience: {
    desc: 'Work and education history',
    run: () =>
      EXPERIENCE.map((e) => ({
        text: `  ${e.period.padEnd(18)} ${e.company} — ${e.role}`,
        color: '#94a3b8',
      })),
  },

  contact: {
    desc: 'Contact information',
    run: () => [
      { text: `  Email     ${PERSONAL.email}` },
      { text: `  LinkedIn  ${PERSONAL.linkedin}`, color: '#22d3ee' },
      { text: `  GitHub    ${PERSONAL.github}`, color: '#22d3ee' },
      { text: `  Website   ${PERSONAL.companyUrl}`, color: '#22d3ee' },
    ],
  },

  man: {
    desc: 'Manual page for a command',
    run: ({ args }) => {
      const cmd = args[0]
      if (!cmd) return [{ text: 'man: what manual page do you want?', color: '#f87171' }]
      const def = COMMAND_REGISTRY[cmd]
      if (!def) return [{ text: `man: no entry for ${cmd}`, color: '#f87171' }]
      return [
        { text: `NAME`, color: '#60a5fa', bold: true },
        { text: `       ${cmd} — ${def.desc}` },
        { text: `SYNOPSIS`, color: '#60a5fa', bold: true },
        { text: `       ${cmd} [options]` },
      ]
    },
  },

  'easter-egg': {
    desc: '🥚',
    run: ({ t }) => [
      { text: '    ██████████████████████████', color: '#60a5fa' },
      { text: '    ██   EDUARDO MACIEL — MIT  ██', color: '#60a5fa' },
      { text: t('term_egg_built'), color: '#60a5fa' },
      { text: `    ██  ${PERSONAL.name}       ██`, color: '#60a5fa', bold: true },
      { text: '    ██████████████████████████', color: '#60a5fa' },
      { text: '' },
      { text: t('term_egg_quote'), color: '#22d3ee' },
      { text: '' },
      { text: '  🚀 Kubernetes  🐳 Docker  ⚡ Go  ☕ Java', color: '#94a3b8' },
    ],
  },
}

interface HistoryLine {
  id: number
  type: 'input' | 'output' | 'error' | 'boot'
  text: string
  color?: string
  bold?: boolean
}

export function Terminal() {
  const { t } = useLocale()
  const [booted, setBooted] = useState(false)
  const [bootLines, setBootLines] = useState<HistoryLine[]>([])
  const [history, setHistory] = useState<HistoryLine[]>([])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [cwd, setCwd] = useState<string[]>(['home', 'eduardo'])
  const [suggestion, setSuggestion] = useState('')

  const fs = makeFilesystem(t)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const BOOT_LINES = [
    { text: t('term_boot_bios'), delay: 0 },
    { text: t('term_boot_kernel'), delay: 120 },
    { text: t('term_boot_modules'), delay: 220 },
    { text: t('term_boot_dist'), delay: 380, color: '#60a5fa' },
    { text: t('term_boot_k8s'), delay: 500, color: '#60a5fa' },
    { text: t('term_boot_java'), delay: 620, color: '#60a5fa' },
    { text: t('term_boot_go'), delay: 720, color: '#60a5fa' },
    { text: t('term_welcome'), delay: 900, color: '#22d3ee' },
  ]

  useEffect(() => {
    setBootLines([])
    setBooted(false)
    BOOT_LINES.forEach(({ text, delay, color }) => {
      setTimeout(() => {
        setBootLines((prev) => [...prev, { id: Math.random(), type: 'boot', text, color }])
      }, delay)
    })
    setTimeout(() => setBooted(true), 1100)
  }, [t])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, bootLines])

  useEffect(() => {
    if (!input.trim()) { setSuggestion(''); return }
    const parts = input.trim().split(' ')
    if (parts.length === 1) {
      const partial = parts[0].toLowerCase()
      const match = Object.keys(COMMAND_REGISTRY).find((k) => k.startsWith(partial) && k !== partial)
      setSuggestion(match ? match.slice(partial.length) : '')
    } else {
      setSuggestion('')
    }
  }, [input])

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim()
      if (!trimmed) return

      const newLines: HistoryLine[] = [{ id: Math.random(), type: 'input', text: trimmed }]

      if (trimmed === 'clear') {
        setHistory([])
        setCmdHistory((p) => [trimmed, ...p])
        setHistoryIdx(-1)
        return
      }

      const [cmd, ...args] = trimmed.split(/\s+/)
      const def = COMMAND_REGISTRY[cmd.toLowerCase()]

      if (def) {
        const output = def.run({ args, cwd, setCwd, t, fs })
        output.forEach((line) => newLines.push({ id: Math.random(), type: 'output', ...line }))
      } else {
        newLines.push({
          id: Math.random(),
          type: 'error',
          text: `bash: ${cmd}: ${t('term_notfound')}`,
          color: '#f87171',
        })
      }

      setHistory((prev) => [...prev, ...newLines])
      setCmdHistory((p) => [trimmed, ...p])
      setHistoryIdx(-1)
    },
    [cwd, t]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    runCommand(input)
    setInput('')
    setSuggestion('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(historyIdx + 1, cmdHistory.length - 1)
      setHistoryIdx(idx)
      setInput(cmdHistory[idx] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(historyIdx - 1, -1)
      setHistoryIdx(idx)
      setInput(idx === -1 ? '' : cmdHistory[idx])
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestion) setInput((v) => v + suggestion)
    }
  }

  const prompt = `eduardo@portfolio:~/${cwd.slice(2).join('/')} $`

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-xl bg-[#090d11] border border-white/[0.07] font-mono text-[13px] shadow-2xl shadow-black/60"
      style={{ boxShadow: '0 0 0 1px rgba(96,165,250,0.08), 0 32px 64px rgba(0,0,0,0.6)' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <button className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all" />
        <button className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 transition-all" />
        <button className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 transition-all" />
        <span className="ml-3 text-[11px] text-slate-600 tracking-wider flex-1 text-center">
          eduardo@portfolio — bash
        </span>
        <span className="text-[10px] text-slate-700 font-mono">zsh 5.9</span>
      </div>
      <div className="p-4 h-64 overflow-y-auto space-y-0.5 scrollbar-thin">
        {bootLines.map((line) => (
          <motion.p
            key={line.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="leading-relaxed text-[12px]"
            style={{ color: line.color ?? '#475569' }}
          >
            {line.text}
          </motion.p>
        ))}
        {booted &&
          history.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.12 }}
            >
              {line.type === 'input' ? (
                <p className="leading-relaxed">
                  <span className="text-accent-green select-none">{prompt} </span>
                  <span className="text-white font-medium">{line.text}</span>
                </p>
              ) : (
                <p
                  className="leading-relaxed"
                  style={{ color: line.color ?? '#94a3b8', fontWeight: line.bold ? 600 : 400 }}
                >
                  {line.text}
                </p>
              )}
            </motion.div>
          ))}
        <div ref={bottomRef} />
      </div>
      <AnimatePresence>
        {booted && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="flex items-center gap-0 px-4 py-3 border-t border-white/[0.06] relative"
          >
            <span className="text-accent-green text-[12px] shrink-0 mr-2 select-none">
              {prompt}
            </span>
            <div className="relative flex-1">
              <span className="absolute inset-0 flex items-center pointer-events-none text-[13px]">
                <span className="invisible">{input}</span>
                <span className="text-slate-700">{suggestion}</span>
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent outline-none text-white caret-accent-green text-[13px] relative z-10"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                autoFocus
              />
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
