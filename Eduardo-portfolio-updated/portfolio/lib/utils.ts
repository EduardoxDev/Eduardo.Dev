import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) return []

  const fileNames = fs.readdirSync(postsDirectory)

  return fileNames
    .filter((f) => f.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      const words = content.split(/\s+/).length
      const readingTime = `${Math.ceil(words / 200)} min read`

      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? '',
        date: data.date ?? '',
        readingTime,
        tags: data.tags ?? [],
        cover: data.cover ?? null,
        content,
      } as BlogPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.slug === slug)
}
