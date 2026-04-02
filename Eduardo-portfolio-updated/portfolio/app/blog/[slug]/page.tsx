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

      <div className="min-h-screen pb-32">
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
              className="inline-flex items-center gap-2 font-mono text-xs text-slate-600 hover:text-accent-green transition-colors mb-8"
            >
              <ArrowLeft size={12} />
              All posts
            </Link>

            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] uppercase tracking-widest text-accent-green border border-accent-green/30 bg-accent-green/5 px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-sans font-black text-3xl md:text-5xl text-white tracking-tight leading-[1.05] mb-5">
              {post.title}
            </h1>

            <p className="font-mono text-sm text-slate-400 leading-loose mb-7 border-l-2 border-accent-green/20 pl-4">
              {post.description}
            </p>

            <div className="flex items-center gap-6 font-mono text-xs text-slate-600 pb-8 border-b border-border mb-10">
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
              prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border
              prose-h3:text-lg prose-h3:mt-8
              prose-p:text-slate-400 prose-p:leading-loose prose-p:font-mono prose-p:text-[13px]
              prose-a:text-accent-green prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-bold
              prose-code:text-accent-green prose-code:bg-white/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:text-[12px] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/[0.07] prose-pre:rounded-none
              prose-blockquote:border-accent-green prose-blockquote:text-slate-500 prose-blockquote:italic
              prose-li:text-slate-400 prose-li:font-mono prose-li:text-[13px]
              prose-img:border prose-img:border-white/10 prose-img:rounded-none
              prose-hr:border-border
            ">
              <MDXRemote source={post.content} />
            </article>

            <div className="mt-16 pt-8 border-t border-border">
              <div className="flex items-start gap-4 p-6 bg-white/[0.02] border border-white/[0.06]">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-accent-green/20 shrink-0">
                  <img src="/phot.png" alt="Eduardo Maciel" className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <p className="font-sans font-bold text-white text-sm mb-1">Eduardo Maciel</p>
                  <p className="font-mono text-[10px] text-accent-green mb-2">Software Engineer & CTO @ Stackr Hosting</p>
                  <p className="font-mono text-xs text-slate-500 leading-loose">
                    Engenheiro de software focado em sistemas distribuídos, infraestrutura e backend de alta performance. Co-fundador da Stackr Hosting.
                  </p>
                </div>
              </div>
            </div>

            {(prevPost || nextPost) && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
                {prevPost ? (
                  <Link href={`/blog/${prevPost.slug}`} className="group bg-bg hover:bg-white/[0.02] p-6 transition-colors">
                    <p className="font-mono text-[10px] text-slate-700 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <ArrowLeft size={9} /> Previous
                    </p>
                    <p className="font-sans font-bold text-sm text-slate-400 group-hover:text-white transition-colors leading-snug">
                      {prevPost.title}
                    </p>
                  </Link>
                ) : <div className="bg-bg" />}

                {nextPost ? (
                  <Link href={`/blog/${nextPost.slug}`} className="group bg-bg hover:bg-white/[0.02] p-6 transition-colors text-right">
                    <p className="font-mono text-[10px] text-slate-700 uppercase tracking-widest mb-2 flex items-center justify-end gap-1">
                      Next <ArrowRight size={9} />
                    </p>
                    <p className="font-sans font-bold text-sm text-slate-400 group-hover:text-white transition-colors leading-snug">
                      {nextPost.title}
                    </p>
                  </Link>
                ) : <div className="bg-bg" />}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
