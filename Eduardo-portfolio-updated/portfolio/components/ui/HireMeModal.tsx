'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle, Upload, Camera, UserRound } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

interface Props {
  open: boolean
  onClose: () => void
}

type Status = 'idle' | 'sending' | 'success'

export function HireMeModal({ open, onClose }: Props) {
  const { t } = useLocale()
  const fileRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

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
    if (file.size > 2_000_000) return
    setUploadedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImg(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

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
      formData.append('avatarEmoji', '👤')
      if (uploadedFile) {
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
        onClose()
      }, 2200)
    } catch {
      setStatus('idle')
    }
  }

  const inputClass =
    'w-full rounded-lg border border-white/[0.08] bg-[#0d0d0d] px-3.5 py-3 font-mono text-[13px] text-white outline-none transition-colors placeholder:text-slate-600 focus:border-sky-400/50'

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
              className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a] shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
                <div>
                  <p className="font-sans text-xl font-black tracking-tight text-white">{t('hire_modal_title')}</p>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">{t('hire_modal_subtitle')}</p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg border border-white/[0.08] p-2 text-slate-500 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className={`relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 transition-all ${
                        isDragging 
                          ? 'border-sky-400 bg-sky-400/10' 
                          : uploadedImg 
                            ? 'border-sky-400/50 bg-[#0d0d0d]' 
                            : 'border-white/[0.15] bg-[#0d0d0d] hover:border-sky-400/50'
                      }`}
                    >
                      {uploadedImg ? (
                        <img src={uploadedImg} alt="avatar" className="h-full w-full object-cover" />
                      ) : (
                        <UserRound size={32} className="text-slate-600" strokeWidth={1.5} />
                      )}
                    </div>
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-sky-400/40 bg-[#0a0a0a] text-sky-400 transition hover:bg-sky-400 hover:text-[#0a0a0a]"
                    >
                      <Camera size={14} />
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
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-slate-500 mb-2">Profile Photo (Optional)</p>
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-all ${
                        isDragging 
                          ? 'border-sky-400 bg-sky-400/5' 
                          : uploadedImg
                            ? 'border-sky-400/30 bg-sky-400/5'
                            : 'border-white/[0.1] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      <Upload size={16} className={`mx-auto mb-2 ${uploadedImg ? 'text-sky-400' : 'text-slate-600'}`} />
                      <p className="font-mono text-xs text-slate-500">
                        {uploadedImg ? '✓ Photo uploaded — click to change' : 'Click or drag to upload'}
                      </p>
                      <p className="font-mono text-[10px] text-slate-700 mt-1">JPG, PNG — max 2MB</p>
                    </div>
                  </div>
                </div>

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

                <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
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
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-400 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-widest text-[#0a0a0a] transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
