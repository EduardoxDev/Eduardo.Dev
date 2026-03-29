'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle, Upload, Camera, ArrowRight } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

const EMOJI_AVATARS = [
  { id: 'dev',       emoji: '👨‍💻', label: 'Dev' },
  { id: 'brain',     emoji: '🧠', label: 'Lead' },
  { id: 'target',    emoji: '🎯', label: 'Recruiter' },
  { id: 'rocket',    emoji: '🚀', label: 'Founder' },
  { id: 'art',       emoji: '🎨', label: 'Designer' },
  { id: 'robot',     emoji: '🤖', label: 'Bot' },
  { id: 'ninja',     emoji: '🥷', label: 'Anon' },
  { id: 'astro',     emoji: '👩‍🚀', label: 'Explorer' },
  { id: 'wizard',    emoji: '🧙', label: 'Wizard' },
  { id: 'alien',     emoji: '👾', label: 'Alien' },
]

interface Props { open: boolean; onClose: () => void }
type Status = 'idle' | 'sending' | 'success'
type AvatarMode = 'emoji' | 'upload'

function AvatarPreview({ mode, emoji, imgSrc }: { mode: AvatarMode; emoji: string; imgSrc: string | null }) {
  if (mode === 'upload' && imgSrc) {
    return <img src={imgSrc} alt="avatar" className="w-full h-full object-cover rounded-full" />
  }
  return <span className="text-2xl leading-none">{emoji}</span>
}

export function HireMeModal({ open, onClose }: Props) {
  const { t } = useLocale()
  const fileRef = useRef<HTMLInputElement>(null)

  const [avatarMode, setAvatarMode] = useState<AvatarMode>('emoji')
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_AVATARS[0])
  const [uploadedImg, setUploadedImg] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [step, setStep] = useState<1 | 2>(1)

  const currentAvatar = avatarMode === 'upload' && uploadedImg
    ? { type: 'image', src: uploadedImg }
    : { type: 'emoji', value: selectedEmoji.emoji }

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploadedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => { setUploadedImg(e.target?.result as string); setAvatarMode('upload') }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  async function handleSend() {
    if (!name || !email || !message) return
    setStatus('sending')
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('company', company)
      formData.append('role', role)
      formData.append('message', message)
      formData.append('avatarEmoji', currentAvatar.type === 'emoji' ? (currentAvatar.value ?? '👤') : '👤')
      if (uploadedFile && avatarMode === 'upload') {
        formData.append('avatarImage', uploadedFile)
      }
      await fetch('/api/contact', { method: 'POST', body: formData })
    } catch {
      console.error('[contact] Failed to send message')
    }

    setStatus('success')
    setTimeout(() => {
      setStatus('idle'); setStep(1)
      setName(''); setEmail(''); setCompany(''); setRole(''); setMessage('')
      setUploadedImg(null); setUploadedFile(null); setAvatarMode('emoji')
      onClose()
    }, 2800)
  }

  const inputClass = "w-full bg-[#0a0f14] border border-white/[0.07] text-white font-mono text-[13px] px-3.5 py-3 outline-none focus:border-accent-green/50 transition-colors placeholder:text-slate-700 rounded-none"

  const canProceed = step === 1 ? true : (name.trim() && email.trim() && message.trim())

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full sm:max-w-[560px] bg-[#080c10] border border-white/[0.07] shadow-2xl sm:rounded-none flex flex-col max-h-[95dvh] sm:max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] shrink-0">
                <div className="flex items-center gap-4">
                  {/* Mini avatar preview */}
                  <div className="w-10 h-10 rounded-full border-2 border-white/[0.08] flex items-center justify-center bg-white/[0.03] overflow-hidden shrink-0">
                    <AvatarPreview mode={avatarMode} emoji={selectedEmoji.emoji} imgSrc={uploadedImg} />
                  </div>
                  <div>
                    <p className="font-sans font-black text-white text-[15px] tracking-tight leading-tight">{t('hire_modal_title')}</p>
                    <p className="font-mono text-[11px] text-slate-600 mt-0.5">{t('hire_modal_subtitle')}</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-slate-700 hover:text-white transition-colors p-1.5 hover:bg-white/[0.05] rounded">
                  <X size={15} />
                </button>
              </div>

              {/* Steps indicator */}
              <div className="flex items-center gap-0 px-6 pt-4 pb-0 shrink-0">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <button
                      onClick={() => s < step && setStep(s as 1 | 2)}
                      className={`flex items-center justify-center w-6 h-6 rounded-full font-mono text-[10px] font-bold transition-all ${
                        step === s ? 'bg-accent-green text-bg' :
                        step > s ? 'bg-accent-green/20 text-accent-green cursor-pointer' :
                        'bg-white/[0.05] text-slate-600'
                      }`}
                    >
                      {step > s ? '✓' : s}
                    </button>
                    <span className={`font-mono text-[10px] uppercase tracking-wider ${step === s ? 'text-white' : 'text-slate-600'}`}>
                      {s === 1 ? t('hire_avatar') : t('hire_name')}
                    </span>
                    {s < 2 && <div className="w-8 h-px bg-white/[0.08] mx-2" />}
                  </div>
                ))}
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">

                  {/* Step 1 — Avatar */}
                  {step === 1 && (
                    <motion.div key="step1"
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="p-6 space-y-5">

                      {/* Big avatar preview */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full border-2 border-accent-green/30 flex items-center justify-center bg-[#0d1117] overflow-hidden shadow-[0_0_30px_rgba(96,165,250,0.08)]">
                            {avatarMode === 'upload' && uploadedImg
                              ? <img src={uploadedImg} alt="avatar" className="w-full h-full object-cover" />
                              : <span className="text-5xl leading-none">{selectedEmoji.emoji}</span>
                            }
                          </div>
                          <button
                            onClick={() => fileRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0d1117] border border-accent-green/40 flex items-center justify-center text-accent-green hover:bg-accent-green hover:text-bg transition-all"
                          >
                            <Camera size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Upload zone */}
                      <div
                        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                        className={`border-2 border-dashed rounded-none py-5 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                          isDragging
                            ? 'border-accent-green/60 bg-accent-green/5'
                            : uploadedImg && avatarMode === 'upload'
                              ? 'border-accent-green/40 bg-accent-green/[0.03]'
                              : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]'
                        }`}
                      >
                        <Upload size={16} className={uploadedImg && avatarMode === 'upload' ? 'text-accent-green' : 'text-slate-600'} />
                        <p className="font-mono text-[11px] text-slate-500">
                          {uploadedImg && avatarMode === 'upload'
                            ? <span className="text-accent-green">✓ Imagem carregada — clique para trocar</span>
                            : 'Arraste uma foto ou clique para enviar do PC'
                          }
                        </p>
                        <p className="font-mono text-[10px] text-slate-700">JPG, PNG, GIF — máx. 5MB</p>
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

                      {/* OR divider */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/[0.05]" />
                        <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">ou escolha um emoji</span>
                        <div className="flex-1 h-px bg-white/[0.05]" />
                      </div>

                      {/* Emoji grid */}
                      <div className="grid grid-cols-5 gap-2">
                        {EMOJI_AVATARS.map(a => (
                          <button key={a.id}
                            onClick={() => { setSelectedEmoji(a); setAvatarMode('emoji') }}
                            className={`relative flex flex-col items-center gap-1.5 py-3 border transition-all group ${
                              avatarMode === 'emoji' && selectedEmoji.id === a.id
                                ? 'border-accent-green/50 bg-accent-green/[0.06]'
                                : 'border-white/[0.06] hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.03]'
                            }`}
                          >
                            <span className="text-xl leading-none">{a.emoji}</span>
                            <span className="font-mono text-[9px] text-slate-600 group-hover:text-slate-400 transition-colors">{a.label}</span>
                            {avatarMode === 'emoji' && selectedEmoji.id === a.id && (
                              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent-green" />
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 — Form */}
                  {step === 2 && (
                    <motion.div key="step2"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                      className="p-6 space-y-4">

                      {/* Live card preview */}
                      <div className="border border-white/[0.06] p-4 flex items-start gap-3 bg-[#0d1117] rounded-none">
                        <div className="w-10 h-10 rounded-full border border-accent-green/20 flex items-center justify-center overflow-hidden shrink-0 bg-white/[0.03]">
                          <AvatarPreview mode={avatarMode} emoji={selectedEmoji.emoji} imgSrc={uploadedImg} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans font-bold text-white text-[13px] leading-tight truncate">
                            {name || <span className="text-slate-600">{t('hire_placeholder_name')}</span>}
                          </p>
                          <p className="font-mono text-[11px] text-slate-600 truncate mt-0.5">
                            {email || t('hire_placeholder_email')}
                          </p>
                          {(company || role) && (
                            <p className="font-mono text-[10px] text-accent-green/60 mt-1 truncate">
                              {[role, company].filter(Boolean).join(' @ ')}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-accent-green border border-accent-green/25 px-2 py-0.5">
                            → Eduardo
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-mono text-[10px] uppercase tracking-widest text-slate-600 block mb-1.5">{t('hire_name')} *</label>
                          <input value={name} onChange={e => setName(e.target.value)}
                            placeholder={t('hire_placeholder_name')} className={inputClass} />
                        </div>
                        <div>
                          <label className="font-mono text-[10px] uppercase tracking-widest text-slate-600 block mb-1.5">{t('hire_email')} *</label>
                          <input value={email} onChange={e => setEmail(e.target.value)}
                            type="email" placeholder={t('hire_placeholder_email')} className={inputClass} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-mono text-[10px] uppercase tracking-widest text-slate-600 block mb-1.5">{t('hire_role')}</label>
                          <input value={role} onChange={e => setRole(e.target.value)}
                            placeholder={t('hire_placeholder_role')} className={inputClass} />
                        </div>
                        <div>
                          <label className="font-mono text-[10px] uppercase tracking-widest text-slate-600 block mb-1.5">{t('hire_company')}</label>
                          <input value={company} onChange={e => setCompany(e.target.value)}
                            placeholder={t('hire_placeholder_company')} className={inputClass} />
                        </div>
                      </div>

                      <div>
                        <label className="font-mono text-[10px] uppercase tracking-widest text-slate-600 block mb-1.5">{t('hire_message')} *</label>
                        <textarea value={message} onChange={e => setMessage(e.target.value)}
                          placeholder={t('hire_placeholder_message')}
                          rows={4} className={`${inputClass} resize-none`} />
                        <p className="font-mono text-[10px] text-slate-700 mt-1 text-right">{message.length}/500</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between gap-3 shrink-0 bg-[#080c10]">
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 font-mono text-[12px] text-accent-green">
                      <CheckCircle size={14} /> {t('hire_success')}
                    </motion.div>
                  )}
                  {(status === 'idle' || status === 'sending') && (
                    <p className="font-mono text-[10px] text-slate-700">
                      {step === 1 ? 'Passo 1 de 2' : 'Passo 2 de 2'}
                    </p>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2">
                  {step === 2 && (
                    <button onClick={() => setStep(1)}
                      className="font-mono text-[11px] text-slate-600 hover:text-white transition-colors px-3 py-2">
                      ← Voltar
                    </button>
                  )}

                  {step === 1 ? (
                    <button onClick={() => setStep(2)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-green text-bg font-mono text-[11px] uppercase tracking-widest font-bold hover:shadow-[0_0_24px_rgba(96,165,250,0.35)] transition-all">
                      Próximo <ArrowRight size={12} />
                    </button>
                  ) : (
                    <button onClick={handleSend}
                      disabled={status === 'sending' || !name.trim() || !email.trim() || !message.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-green text-bg font-mono text-[11px] uppercase tracking-widest font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_24px_rgba(96,165,250,0.35)] transition-all">
                      {status === 'sending' ? (
                        <>
                          <motion.div className="w-3 h-3 border-2 border-bg/30 border-t-bg rounded-full"
                            animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }} />
                          {t('hire_sending')}
                        </>
                      ) : (
                        <><Send size={12} /> {t('hire_send')}</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
