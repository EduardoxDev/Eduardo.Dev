import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'
import { getBlogPosts, getBlogPost, formatDate } from '@/lib/utils'
import { ReadingProgress } from '@/components/ui/ReadingProgress'

interface Params {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getBlogPost(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: post.cover ? { images: [post.cover] } : undefined,
  }
}

export default function BlogPostPage({ params }: Params) {
  const post = getBlogPost(params.slug)
  if (!post) notFound()

  const allPosts = getBlogPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === params.slug)
  const prevPost = allPosts[currentIndex + 1] ?? null
  const nextPost = allPosts[currentIndex - 1] ?? null

  return (
    <>
      <ReadingProgress />

      <div className="min-h-screen pb-32 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
          <div className="absolute top-2/3 right-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        {post.cover && (
          <div className="relative h-72 md:h-[420px] w-full overflow-hidden">
            <img
              src={post.cover}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg/20 to-transparent" />
          </div>
        )}

        <div className="px-6 lg:px-12 max-w-3xl mx-auto">
          <div className={post.cover ? '-mt-32 relative z-10' : 'pt-28'}>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 font-mono text-xs text-slate-400 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white mb-8"
            >
              <ArrowLeft size={12} />
              All posts
            </Link>

            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] uppercase tracking-widest text-sky-400 rounded-lg border border-sky-400/30 bg-sky-400/5 px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-sans font-black text-3xl md:text-5xl text-white tracking-tight leading-[1.05] mb-5">
              {post.title}
            </h1>

            <p className="font-mono text-sm text-slate-400 leading-loose mb-7 rounded-lg border-l-2 border-sky-400/20 pl-4">
              {post.description}
            </p>

            <div className="flex items-center gap-6 font-mono text-xs text-slate-600 pb-8 border-b border-white/[0.08] mb-10">
              <span className="flex items-center gap-2">
                <Calendar size={12} />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={12} />
                {post.readingTime}
              </span>
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-white/10">
                  <img src="/phot.png" alt="Eduardo" className="w-full h-full object-cover object-top" />
                </div>
                Eduardo Maciel
              </span>
            </div>

            <article className="prose prose-invert prose-sm max-w-none
              prose-headings:font-sans prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white
              prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-white/[0.08]
              prose-h3:text-lg prose-h3:mt-8
              prose-p:text-slate-400 prose-p:leading-loose prose-p:font-mono prose-p:text-[13px]
              prose-a:text-sky-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-bold
              prose-code:text-sky-400 prose-code:bg-white/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:text-[12px] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/[0.08] prose-pre:rounded-lg
              prose-blockquote:border-sky-400 prose-blockquote:text-slate-500 prose-blockquote:italic
              prose-li:text-slate-400 prose-li:font-mono prose-li:text-[13px]
              prose-img:border prose-img:border-white/[0.08] prose-img:rounded-lg
              prose-hr:border-white/[0.08]
            ">
              <MDXRemote source={post.content} />
            </article>

            <div className="mt-16 pt-8 border-t border-white/[0.08]">
              <div className="flex items-start gap-4 p-6 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-sky-400/20 shrink-0">
                  <img src="/phot.png" alt="Eduardo Maciel" className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <p className="font-sans font-bold text-white text-sm mb-1">Eduardo Maciel</p>
                  <p className="font-mono text-[10px] text-sky-400 mb-2">Software Engineer & CTO @ Stackr Hosting</p>
                  <p className="font-mono text-xs text-slate-500 leading-loose">
                    Engenheiro de software focado em sistemas distribuídos, infraestrutura e backend de alta performance. Co-fundador da Stackr Hosting.
                  </p>
                </div>
              </div>
            </div>

            {(prevPost || nextPost) && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevPost ? (
                  <Link href={`/blog/${prevPost.slug}`} className="group rounded-xl bg-[#0a0a0a] border border-white/[0.08] hover:border-sky-400/30 hover:bg-white/[0.02] p-6 transition-colors">
                    <p className="font-mono text-[10px] text-slate-700 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <ArrowLeft size={9} /> Previous
                    </p>
                    <p className="font-sans font-bold text-sm text-slate-400 group-hover:text-white transition-colors leading-snug">
                      {prevPost.title}
                    </p>
                  </Link>
                ) : <div />}

                {nextPost ? (
                  <Link href={`/blog/${nextPost.slug}`} className="group rounded-xl bg-[#0a0a0a] border border-white/[0.08] hover:border-sky-400/30 hover:bg-white/[0.02] p-6 transition-colors text-right">
                    <p className="font-mono text-[10px] text-slate-700 uppercase tracking-widest mb-2 flex items-center justify-end gap-1">
                      Next <ArrowRight size={9} />
                    </p>
                    <p className="font-sans font-bold text-sm text-slate-400 group-hover:text-white transition-colors leading-snug">
                      {nextPost.title}
                    </p>
                  </Link>
                ) : <div />}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
