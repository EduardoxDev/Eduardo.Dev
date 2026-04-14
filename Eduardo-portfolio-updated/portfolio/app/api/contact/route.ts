import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import fs from 'fs'
import path from 'path'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const TO_EMAIL = 'eduardomacielwanka78@gmail.com'
const RATE_LIMIT_WINDOW = 60_000
const RATE_LIMIT_MAX = 3
const MAX_FILE_SIZE = 2_000_000
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const rateMap = new Map<string, { count: number; reset: number; blocked?: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  
  if (entry?.blocked && now < entry.blocked) return true
  
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW })
    return false
  }
  
  entry.count++
  
  if (entry.count > RATE_LIMIT_MAX) {
    entry.blocked = now + 300_000
    return true
  }
  
  return false
}

function sanitize(value: unknown): string {
  return String(value ?? '')
    .replace(/[<>"'`]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 500)
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email) && email.length <= 254
}

function saveMessage(data: Record<string, string>): void {
  try {
    const dir = path.join(process.cwd(), '.messages')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const file = path.join(dir, `${Date.now()}.json`)
    fs.writeFileSync(file, JSON.stringify({ ...data, receivedAt: new Date().toISOString() }, null, 2))
  } catch (err) {
    console.error('[contact] Failed to save message:', err)
  }
}

function buildHtml(emoji: string, img: string | null, name: string, email: string, company: string, role: string, msg: string): string {
  const date = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  const avatar = img
    ? `<img src="${img}" width="52" height="52" style="border-radius:50%;object-fit:cover;border:2px solid #bbf7d0;display:block;" alt="Avatar">`
    : `<div style="width:52px;height:52px;border-radius:50%;background:#f0fdf4;border:2px solid #bbf7d0;font-size:26px;line-height:52px;text-align:center;">${emoji}</div>`
  
  const meta = [sanitize(role), sanitize(company)].filter(Boolean).join(' @ ')
  const cleanName = sanitize(name)
  const cleanEmail = sanitize(email)
  const cleanMsg = sanitize(msg).replace(/\n/g, '<br>')
  
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova proposta</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1);">
        <tr>
          <td style="background:linear-gradient(135deg,#16a34a,#15803d);padding:28px;">
            <p style="margin:0;font-size:11px;font-weight:700;color:#bbf7d0;text-transform:uppercase;letter-spacing:.1em;">Nova proposta — eduardomaciel.dev</p>
            <p style="margin:8px 0 4px;font-size:20px;font-weight:800;color:#fff;">${cleanName} quer trabalhar com você</p>
            <p style="margin:0;font-size:12px;color:#86efac;">${date}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:22px 28px 18px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;padding-right:14px;">${avatar}</td>
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-size:15px;font-weight:700;color:#111;">${cleanName}</p>
                  <p style="margin:3px 0;font-size:13px;"><a href="mailto:${cleanEmail}" style="color:#16a34a;text-decoration:none;">${cleanEmail}</a></p>
                  ${meta ? `<p style="margin:3px 0 0;font-size:12px;color:#6b7280;">${meta}</p>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 28px;">
            <div style="height:1px;background:#f3f4f6;"></div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 28px;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.08em;">Mensagem</p>
            <div style="font-size:14px;color:#374151;line-height:1.75;background:#f9fafb;border-left:3px solid #16a34a;padding:14px 16px;">${cleanMsg}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:4px 28px 28px;">
            <a href="mailto:${cleanEmail}?subject=Re: ${encodeURIComponent(cleanName)}" style="display:inline-block;padding:12px 22px;background:#16a34a;color:#fff;font-size:13px;font-weight:700;text-decoration:none;border-radius:8px;">Responder agora →</a>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 28px;background:#f9fafb;border-top:1px solid #f3f4f6;">
            <p style="margin:0;font-size:11px;color:#9ca3af;">Enviado via <strong style="color:#374151;">eduardomaciel.dev</strong></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

async function trySendEmail(from: string, subject: string, html: string, replyTo: string): Promise<boolean> {
  if (!RESEND_API_KEY) return false
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${RESEND_API_KEY}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        from, 
        to: [TO_EMAIL], 
        reply_to: replyTo, 
        subject, 
        html 
      }),
    })
    
    if (response.ok) {
      console.log('[contact] Email sent successfully from:', from)
      return true
    }
    
    const body = await response.json().catch(() => ({}))
    console.warn('[contact] Email failed:', { from, status: response.status, message: (body as {message?:string}).message })
    return false
  } catch (error) {
    console.error('[contact] Network error:', error)
    return false
  }
}

export async function POST(req: Request) {
  const hdrs = await headers()
  const ip = hdrs.get('x-forwarded-for')?.split(',')[0].trim() ?? '0.0.0.0'
  
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limit' }, { 
      status: 429,
      headers: { 'Retry-After': '300' }
    })
  }

  let name = '', email = '', company = '', role = '', message = '', emoji = '👤'
  let imgB64: string | null = null

  try {
    const contentType = req.headers.get('content-type') ?? ''
    
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      name = sanitize(form.get('name'))
      email = sanitize(form.get('email'))
      company = sanitize(form.get('company'))
      role = sanitize(form.get('role'))
      message = sanitize(form.get('message'))
      emoji = String(form.get('avatarEmoji') ?? '👤').slice(0, 10)
      
      const img = form.get('avatarImage') as File | null
      if (img && img.size > 0 && img.size < MAX_FILE_SIZE) {
        if (!ALLOWED_IMAGE_TYPES.includes(img.type)) {
          return NextResponse.json({ error: 'invalid_file_type' }, { status: 400 })
        }
        imgB64 = `data:${img.type};base64,${Buffer.from(await img.arrayBuffer()).toString('base64')}`
      }
    } else {
      const body = await req.json()
      name = sanitize(body.name)
      email = sanitize(body.email)
      company = sanitize(body.company)
      role = sanitize(body.role)
      message = sanitize(body.message)
      emoji = String(body.avatar ?? '👤').slice(0, 10)
    }
  } catch {
    return NextResponse.json({ error: 'parse_error' }, { status: 400 })
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }
  
  if (!validateEmail(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }
  
  if (name.length < 2 || message.length < 10) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
  }

  saveMessage({ name, email, company, role, message, emoji })

  if (!RESEND_API_KEY) {
    console.log('[contact] No API key - message saved locally:', { name, email })
    return NextResponse.json({ ok: true })
  }

  const html = buildHtml(emoji, imgB64, name, email, company, role, message)
  const subject = `${emoji} ${name} quer trabalhar com você${company ? ` — ${company}` : ''}`

  const froms = [
    'Portfolio <onboarding@resend.dev>',
    'onboarding@resend.dev',
  ]

  for (const from of froms) {
    const success = await trySendEmail(from, subject, html, email)
    if (success) return NextResponse.json({ ok: true })
  }

  console.log('[contact] Email failed but message saved:', { name, email })
  return NextResponse.json({ ok: true })
}
