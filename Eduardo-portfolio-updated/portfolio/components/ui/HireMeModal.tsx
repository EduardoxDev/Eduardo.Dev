'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle, Upload, UserRound, Code2, Briefcase, Target, Rocket, Palette, Bot, type LucideIcon } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

const AVATAR_OPTIONS: { id: string; icon: LucideIcon; label: string }[] = [
  { id: 'dev', icon: Code2, label: 'Dev' },
  { id: 'lead', icon: Briefcase, label: 'Lead' },
  { id: 'recruiter', icon: Target, label: 'Recruiter' },
  { id: 'founder', icon: Rocket, label: 'Founder' },
  { id: 'designer', icon: Palette, label: 'Designer' },
  { id: 'bot', icon: Bot, label: 'Bot' },
]

interface Props {
  open: boolean
  onClose: () => void
}

type Status = 'idle' | 'sending' | 'success'
type AvatarMode = 'emoji' | 'upload'

function AvatarPreview({
  mode,
  icon: Icon,
  imgSrc,
}: {
  mode: AvatarMode
  icon: LucideIcon
  imgSrc: string | null
}) {
  if (mode === 'upload' && imgSrc) {
    return <img src={imgSrc} alt="avatar" className="h-full w-full rounded-full object-cover" />
  }
  return <Icon size={28} className="text-sky-300" strokeWidth={1.8} />
}

export function HireMeModal({ open, onClose }: Props) {
  const { t } = useLocale()
  const fileRef = useRef<HTMLInputElement>(null)

  const [avatarMode, setAvatarMode] = useState<AvatarMode>('emoji')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0])
  const [uploadedImg, setUploadedImg] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('idle')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [message, setMessage] = useState('')

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploadedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImg(e.target?.result as string)
      setAvatarMode('upload')
    }
    reader.readAsDataURL(file)
  }, [])

  async function handleSend() {
    if (!name.trim() || !email.trim() || !message.trim()) return

    setStatus('sending')
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('company', company)
      formData.append('role', role)
      formData.append('message', message)
      formData.append('avatarEmoji', avatarMode === 'emoji' ? selectedAvatar.label : 'Custom Avatar')
      if (uploadedFile && avatarMode === 'upload') {
        formData.append('avatarImage', uploadedFile)
      }
      await fetch('/api/contact', { method: 'POST', body: formData })
      setStatus('success')
      setTimeout(() => {
        setStatus('idle')
        setName('')
        setEmail('')
        setCompany('')
        setRole('')
        setMessage('')
        setUploadedImg(null)
        setUploadedFile(null)
        setAvatarMode('emoji')
        setSelectedAvatar(AVATAR_OPTIONS[0])
        onClose()
      }, 2200)
    } catch {
      setStatus('idle')
    }
  }

  const inputClass =
    'w-full rounded-xl border border-white/[0.08] bg-[#0e1117] px-3.5 py-3 font-mono text-[13px] text-white outline-none transition-colors placeholder:text-slate-600 focus:border-sky-400/45'

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090d14] shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
                <div>
                  <p className="font-sans text-xl font-black tracking-tight text-white">{t('hire_modal_title')}</p>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">{t('hire_modal_subtitle')}</p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl border border-white/[0.08] p-2 text-slate-500 transition hover:border-white/20 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-[230px_1fr]">
                <aside className="rounded-xl border border-white/[0.06] bg-black/25 p-4">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('hire_avatar')}</p>
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-sky-400/35 bg-[#0f1520]">
                      <AvatarPreview mode={avatarMode} icon={selectedAvatar.icon} imgSrc={uploadedImg} />
                    </div>
                  </div>

                  <button
                    onClick={() => fileRef.current?.click()}
                    className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.02] px-3 py-2 font-mono text-[11px] text-slate-300 transition hover:border-sky-400/35 hover:text-white"
                  >
                    <Upload size={13} /> Upload
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleFile(f)
                    }}
                  />

                  <div className="grid grid-cols-3 gap-2">
                    {AVATAR_OPTIONS.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          setSelectedAvatar(a)
                          setAvatarMode('emoji')
                        }}
                        className={`rounded-lg border py-2 transition ${
                          avatarMode === 'emoji' && selectedAvatar.id === a.id
                            ? 'border-sky-400/45 bg-sky-400/10'
                            : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16]'
                        }`}
                        aria-label={a.label}
                      >
                        <a.icon size={16} className="mx-auto text-slate-200" strokeWidth={1.8} />
                      </button>
                    ))}
                  </div>
                </aside>

                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('hire_name')} *</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('hire_placeholder_name')} className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('hire_email')} *</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder={t('hire_placeholder_email')}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('hire_role')}</label>
                      <input value={role} onChange={(e) => setRole(e.target.value)} placeholder={t('hire_placeholder_role')} className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('hire_company')}</label>
                      <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder={t('hire_placeholder_company')} className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('hire_message')} *</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t('hire_placeholder_message')}
                      rows={5}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                    {status === 'success' ? (
                      <div className="flex items-center gap-2 font-mono text-[12px] text-sky-400">
                        <CheckCircle size={14} /> {t('hire_success')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                        <UserRound size={13} />
                        {name || t('hire_placeholder_name')}
                      </div>
                    )}
                    <button
                      onClick={handleSend}
                      disabled={status === 'sending' || !name.trim() || !email.trim() || !message.trim()}
                      className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-widest text-[#03111f] transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {status === 'sending' ? (
                        <>
                          <motion.div
                            className="h-3 w-3 rounded-full border-2 border-[#03111f]/25 border-t-[#03111f]"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                          />
                          {t('hire_sending')}
                        </>
                      ) : (
                        <>
                          <Send size={12} /> {t('hire_send')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
