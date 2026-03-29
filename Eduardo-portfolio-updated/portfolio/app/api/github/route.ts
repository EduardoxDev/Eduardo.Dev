import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const GITHUB_USERNAME = 'EduardoxDev'
const CACHE_SECONDS = 3600
const RATE_LIMIT_WINDOW = 60_000
const RATE_LIMIT_MAX = 15

const FALLBACK = {
  username: GITHUB_USERNAME,
  name: 'Eduardo Maciel',
  publicRepos: 47,
  followers: 19,
  following: 3,
  stars: 2,
  topLangs: [
    ['Go', 8], ['HTML', 6], ['TypeScript', 4],
    ['Java', 3], ['C++', 2],
  ] as [string, number][],
}

const requestLog = new Map<string, { count: number; windowStart: number; blocked?: number }>()

function isApiRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = requestLog.get(ip)
  
  if (entry?.blocked && now < entry.blocked) return true
  
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    requestLog.set(ip, { count: 1, windowStart: now })
    return false
  }
  
  entry.count++
  
  if (entry.count > RATE_LIMIT_MAX) {
    entry.blocked = now + 300_000
    return true
  }
  
  return false
}

function getGitHubHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'portfolio-site',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

export async function GET() {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() ?? '0.0.0.0'

  if (isApiRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' }, 
      { 
        status: 429,
        headers: { 'Retry-After': '300' }
      }
    )
  }

  try {
    const ghHeaders = getGitHubHeaders()

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers: ghHeaders,
        next: { revalidate: CACHE_SECONDS },
      }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
        headers: ghHeaders,
        next: { revalidate: CACHE_SECONDS },
      }),
    ])

    if (!userRes.ok || !reposRes.ok) {
      console.warn('[github] API error:', { userStatus: userRes.status, reposStatus: reposRes.status })
      return NextResponse.json(FALLBACK, {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
        },
      })
    }

    const user = await userRes.json()
    const repos = await reposRes.json()

    if (!Array.isArray(repos)) {
      return NextResponse.json(FALLBACK, {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
        },
      })
    }

    const stars = repos.reduce(
      (acc: number, repo: { stargazers_count?: number }) => acc + (repo.stargazers_count ?? 0), 
      0
    )

    const langMap: Record<string, number> = {}
    for (const repo of repos as { language?: string | null }[]) {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] ?? 0) + 1
      }
    }

    const topLangs = Object.entries(langMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5) as [string, number][]

    return NextResponse.json(
      {
        username: user.login ?? GITHUB_USERNAME,
        name: user.name ?? 'Eduardo Maciel',
        publicRepos: user.public_repos ?? 0,
        followers: user.followers ?? 0,
        following: user.following ?? 0,
        stars,
        topLangs,
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
        },
      }
    )
  } catch (error) {
    console.error('[github] Fetch error:', error)
    return NextResponse.json(FALLBACK, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
      },
    })
  }
}
