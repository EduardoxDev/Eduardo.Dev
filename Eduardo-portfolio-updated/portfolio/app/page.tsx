import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { TechStack } from '@/components/sections/TechStack'
import { Projects } from '@/components/sections/Projects'
import { Experience } from '@/components/sections/Experience'
import { GitHubStats } from '@/components/sections/GitHubStats'

export default function HomePage() {
  return (
    <>
      <div className="hero-orb-1" />
      <div className="hero-orb-2" />
      <Hero />
      <div className="section-line max-w-6xl mx-auto my-4" />
      <About />
      <div className="section-line max-w-6xl mx-auto my-4" />
      <TechStack />
      <div className="section-line max-w-6xl mx-auto my-4" />
      <Projects />
      <div className="section-line max-w-6xl mx-auto my-4" />
      <Experience />
      <div className="section-line max-w-6xl mx-auto my-4" />
      <GitHubStats />
    </>
  )
}
