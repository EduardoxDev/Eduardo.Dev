export interface Project {
  slug: string
  title: string
  descriptionKey: string
  longDescriptionKey: string
  tech: string[]
  problemKey: string
  impactKey: string
  github: string
  demo?: string
  featured: boolean
  year: number
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readingTime: string
  tags: string[]
  cover?: string
  content: string
}

export interface Experience {
  company: string
  role: string
  /** When set, UI shows t(roleKey) instead of role (for localized titles). */
  roleKey?: string
  period: string
  location: string
  descriptionKey: string
  tech: string[]
  impactKeys: string[]
}

export interface TechCategory {
  label: string
  icon: string
  items: TechItem[]
}

export interface TechItem {
  name: string
  level: number
  logo?: string
  descriptionKey?: string
}
