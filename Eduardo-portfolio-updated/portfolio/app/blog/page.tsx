import Link from 'next/link'
import { ArrowLeft, Clock, ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import { getBlogPosts, formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Escritos sobre sistemas distribuídos, backend, infraestrutura e engenharia de software.',
}

export default function BlogPage() {
  const posts = getBlogPosts()
  const [featured, ...rest] = posts

  return (
    <div className="min-h-screen px-6 lg:px-12 max-w-6xl mx-auto pt-28 pb-24">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-xs text-slate-600 hover:text-accent-green transition-colors mb-12"
      >
        <ArrowLeft size={12} />
        Home
      </Link>

      <div className="mb-16">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-px h-4 bg-accent-green" />
          <span className="font-mono text-xs text-accent-green tracking-widest uppercase">
            engineering blog
          </span>
        </div>
        <h1 className="font-sans font-black text-5xl text-white tracking-tight">Writings</h1>
        <p className="mt-3 font-mono text-sm text-slate-500 max-w-lg">
          Análises sobre sistemas distribuídos, performance, containers, infraestrutura e o dia a dia de ser CTO de uma startup de hosting.
        </p>
        <p className="mt-1 font-mono text-xs text-slate-700">
          {posts.length} articles · Updated regularly
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <p className="font-mono text-xs text-slate-700">No posts yet.</p>
        </div>
      ) : (
        <div className="space-y-px">
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="block group">
              <article className="relative border border-white/[0.06] hover:border-accent-green/30 bg-[#090d11] hover:bg-white/[0.02] transition-all overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-56 md:h-auto overflow-hidden">
                    <img
                      src={featured.cover ?? 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80'}
                      alt={featured.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#090d11] hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090d11] to-transparent md:hidden" />
                    <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-accent-green border border-accent-green/30 bg-bg/80 backdrop-blur-sm px-2 py-1">
                      Featured
                    </span>
                  </div>
                  <div className="p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featured.tags.map((tag) => (
                          <span key={tag} className="font-mono text-[10px] uppercase tracking-wider text-slate-600 border border-border px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="font-sans font-black text-white text-2xl md:text-3xl tracking-tight mb-3 group-hover:text-accent-green transition-colors">
                        {featured.title}
                      </h2>
                      <p className="font-mono text-xs text-slate-500 leading-loose">
                        {featured.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/[0.05]">
                      <div className="flex items-center gap-4 font-mono text-[10px] text-slate-700">
                        <span>{formatDate(featured.date)}</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{featured.readingTime}</span>
                      </div>
                      <span className="font-mono text-xs text-accent-green flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] mt-px">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <article className="bg-[#090d11] hover:bg-white/[0.02] transition-all h-full flex flex-col border border-transparent hover:border-accent-green/20">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={post.cover ?? 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090d11] via-[#090d11]/40 to-transparent" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="font-mono text-[9px] uppercase tracking-wider text-slate-600 border border-border px-1.5 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-sans font-black text-white text-base tracking-tight mb-2 group-hover:text-accent-green transition-colors leading-snug flex-1">
                      {post.title}
                    </h2>
                    <p className="font-mono text-[11px] text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                      <span className="font-mono text-[10px] text-slate-700">{formatDate(post.date)}</span>
                      <span className="font-mono text-[10px] text-slate-700 flex items-center gap-1">
                        <Clock size={9} /> {post.readingTime}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
