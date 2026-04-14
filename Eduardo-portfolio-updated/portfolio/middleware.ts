import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const RATE_LIMIT_WINDOW = 60_000
const RATE_LIMIT_MAX = 100
const BLOCK_DURATION = 600_000

const ipData = new Map<string, { count: number; windowStart: number; blockedUntil?: number }>()

const BLOCKED_PATHS = [
  '/wp-admin', '/wp-login', '/.env', '/phpMyAdmin', '/admin',
  '/config', '/backup', '/.git', '/api/v1/admin', '/shell',
  '/.htaccess', '/xmlrpc.php', '/cgi-bin',
]

const SUSPICIOUS_UA = [
  'sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab', 'dirbuster',
  'gobuster', 'wfuzz', 'hydra', 'medusa', 'burpsuite', 'havij',
]

function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '0.0.0.0'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = ipData.get(ip)

  if (entry?.blockedUntil && now < entry.blockedUntil) return true

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    ipData.set(ip, { count: 1, windowStart: now })
    return false
  }

  entry.count++

  if (entry.count > RATE_LIMIT_MAX) {
    entry.blockedUntil = now + BLOCK_DURATION
    return true
  }

  return false
}

function isSuspiciousUA(ua: string): boolean {
  const lower = ua.toLowerCase()
  return SUSPICIOUS_UA.some((s) => lower.includes(s))
}

function isBlockedPath(path: string): boolean {
  return BLOCKED_PATHS.some((p) => path === p || path.startsWith(`${p}/`))
}

/** Public assets from /public — skip security middleware so Next can serve them (avoids 404). */
const PUBLIC_FILE = /\.(?:svg|png|jpe?g|gif|webp|avif|ico|woff2?|woff|ttf|eot|txt|json|xml|webmanifest)$/i

function isPublicStaticFile(pathname: string): boolean {
  return PUBLIC_FILE.test(pathname)
}

function blockResponse(): NextResponse {
  return new NextResponse(null, { status: 403 })
}

function rateLimitResponse(): NextResponse {
  return new NextResponse(null, {
    status: 429,
    headers: { 'Retry-After': '60' },
  })
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = getIP(req)
  const ua = req.headers.get('user-agent') ?? ''

  if (isPublicStaticFile(pathname)) return NextResponse.next()

  if (isBlockedPath(pathname)) return blockResponse()
  if (isSuspiciousUA(ua)) return blockResponse()
  if (isRateLimited(ip)) return rateLimitResponse()

  const res = NextResponse.next()

  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')

  return res
}

// Skip API routes and Next internals; static /public files are handled inside middleware via isPublicStaticFile.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
