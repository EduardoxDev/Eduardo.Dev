import type { Project, Experience, TechCategory } from '@/types'

export const PERSONAL = {
  name: 'Eduardo Maciel',
  title: 'Software Engineer',
  bio: "Hello, I'm Eduardo Maciel — software engineer and open source builder. I focus on distributed systems, high-performance backends, and building software you can trust at scale.",
  github: 'https://github.com/EduardoxDev',
  linkedin: 'https://www.linkedin.com/in/eduardo-maciel-wanka-6194a1396/',
  email: 'eduardomacielwanka78@gmail.com',
  location: 'Brusque, Santa Catarina, Brazil',
  company: 'Open to Work',
  companyUrl: 'https://www.linkedin.com/in/eduardo-maciel-wanka-6194a1396/',
  available: true,
}

export const TECH_STACK: TechCategory[] = [
  {
    label: 'Languages', icon: '{ }',
    items: [
      { name: 'Java', level: 5, descriptionKey: 'tech_java_desc' },
      { name: 'Go', level: 5, descriptionKey: 'tech_go_desc' },
      { name: 'C++', level: 4, descriptionKey: 'tech_cpp_desc' },
      { name: 'TypeScript', level: 4, descriptionKey: 'tech_ts_desc' },
    ],
  },
  {
    label: 'Backend', icon: '⚙',
    items: [
      { name: 'Spring Boot', level: 5, descriptionKey: 'tech_spring_desc' },
      { name: 'Go (net/http)', level: 5, descriptionKey: 'tech_go_http_desc' },
      { name: 'REST APIs', level: 5, descriptionKey: 'tech_rest_desc' },
      { name: 'API Gateway', level: 4, descriptionKey: 'tech_apigw_desc' },
    ],
  },
  {
    label: 'Infrastructure', icon: '◻',
    items: [
      { name: 'Kubernetes', level: 5, descriptionKey: 'tech_k8s_desc' },
      { name: 'Docker', level: 5, descriptionKey: 'tech_docker_desc' },
      { name: 'Linux', level: 5, descriptionKey: 'tech_linux_desc' },
      { name: 'CI/CD', level: 4, descriptionKey: 'tech_cicd_desc' },
    ],
  },
  {
    label: 'Databases', icon: '⬡',
    items: [
      { name: 'PostgreSQL', level: 5, descriptionKey: 'tech_postgres_desc' },
      { name: 'MySQL', level: 5, descriptionKey: 'tech_mysql_desc' },
      { name: 'MongoDB', level: 4, descriptionKey: 'tech_mongo_desc' },
      { name: 'Redis', level: 4, descriptionKey: 'tech_redis_desc' },
    ],
  },
  {
    label: 'Tooling & Design', icon: '◈',
    items: [
      { name: 'IntelliJ IDEA', level: 5, descriptionKey: 'tech_intellij_desc' },
      { name: 'Git', level: 5, descriptionKey: 'tech_git_desc' },
      { name: 'Figma', level: 3, descriptionKey: 'tech_figma_desc' },
    ],
  },
]

export const PROJECTS: Project[] = [
  {
    slug: 'mini-runtime-container',
    title: 'Mini Runtime Container',
    descriptionKey: 'proj_mini_desc',
    longDescriptionKey: 'proj_mini_long',
    tech: ['Go', 'Linux Namespaces', 'cgroups', 'Docker'],
    problemKey: 'proj_mini_problem',
    impactKey: 'proj_mini_impact',
    github: 'https://github.com/EduardoxDev/Mini-Runtime-Container',
    featured: true, year: 2026,
  },
  {
    slug: 'api-gateway',
    title: 'API Gateway',
    descriptionKey: 'proj_apigw_desc',
    longDescriptionKey: 'proj_apigw_long',
    tech: ['Go', 'Java', 'Spring Boot', 'Docker', 'Redis'],
    problemKey: 'proj_apigw_problem',
    impactKey: 'proj_apigw_impact',
    github: 'https://github.com/EduardoxDev/Api-Gateway',
    featured: true, year: 2026,
  },
  {
    slug: 'digital-banking-system',
    title: 'Digital Banking System',
    descriptionKey: 'proj_bank_desc',
    longDescriptionKey: 'proj_bank_long',
    tech: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Redis'],
    problemKey: 'proj_bank_problem',
    impactKey: 'proj_bank_impact',
    github: 'https://github.com/EduardoxDev/Digital-Banking-System',
    featured: true, year: 2026,
  },
  {
    slug: 'codesearch-engine',
    title: 'CodeSearch',
    descriptionKey: 'proj_search_desc',
    longDescriptionKey: 'proj_search_long',
    tech: ['Go', 'TypeScript', 'PostgreSQL', 'Docker'],
    problemKey: 'proj_search_problem',
    impactKey: 'proj_search_impact',
    github: 'https://github.com/EduardoxDev/CodeSearch-Style-Search-Engine',
    featured: false, year: 2026,
  },
  {
    slug: 'data-structures',
    title: 'Data Structures',
    descriptionKey: 'proj_ds_desc',
    longDescriptionKey: 'proj_ds_long',
    tech: ['C++', 'Java', 'Go'],
    problemKey: 'proj_ds_problem',
    impactKey: 'proj_ds_impact',
    github: 'https://github.com/EduardoxDev/Data-Structures-Exercise',
    featured: false, year: 2026,
  },
  {
    slug: 'binary-search-tree',
    title: 'Binary Search Tree',
    descriptionKey: 'proj_bst_desc',
    longDescriptionKey: 'proj_bst_long',
    tech: ['C++', 'Java'],
    problemKey: 'proj_bst_problem',
    impactKey: 'proj_bst_impact',
    github: 'https://github.com/EduardoxDev/Binary-Search-Tree',
    featured: false, year: 2026,
  },
]

export const EXPERIENCE: Experience[] = [
  {
    company: 'MIT',
    role: 'Estudando para Ingressar no MIT',
    period: '2026 — Em andamento',
    location: 'Remote · Self-directed',
    descriptionKey: 'exp_mit_desc',
    tech: ['Algorithms', 'Math', 'Computer Science', 'Distributed Systems', 'OS Internals'],
    impactKeys: ['exp_mit_i1', 'exp_mit_i2', 'exp_mit_i3', 'exp_mit_i4'],
  },
  {
    company: 'Stackr Hosting',
    role: 'Software Engineer',
    roleKey: 'exp_stackr_role',
    period: '2023 — 2025',
    location: 'Remote',
    descriptionKey: 'exp_stackr_desc',
    tech: ['Go', 'Java', 'Spring Boot', 'Kubernetes', 'Docker', 'PostgreSQL', 'Redis'],
    impactKeys: ['exp_stackr_i1', 'exp_stackr_i2', 'exp_stackr_i3', 'exp_stackr_i4'],
  },
  {
    company: 'Open Source Projects',
    role: 'Independent Engineer',
    period: '2022 — Present',
    location: 'Remote',
    descriptionKey: 'exp_oss_desc',
    tech: ['Go', 'C++', 'Java', 'Linux', 'Docker', 'TypeScript'],
    impactKeys: ['exp_oss_i1', 'exp_oss_i2', 'exp_oss_i3'],
  },
  {
    company: 'Colégio Unifebe',
    role: 'Ensino Fundamental — 9º Ano',
    period: '2025 — Present',
    location: 'Brusque, Santa Catarina, Brazil',
    descriptionKey: 'exp_school_desc',
    tech: ['C++', 'Java', 'Algoritmos', 'Lógica de Programação'],
    impactKeys: ['exp_school_i1', 'exp_school_i2', 'exp_school_i3'],
  },
]

export const PRINCIPLES = [
  { iconId: 'systems', titleKey: 'princ_systems', descKey: 'princ_systems_desc' },
  { iconId: 'availability', titleKey: 'princ_availability', descKey: 'princ_availability_desc' },
  { iconId: 'scalable', titleKey: 'princ_scalable', descKey: 'princ_scalable_desc' },
  { iconId: 'learn', titleKey: 'princ_learn', descKey: 'princ_learn_desc' },
  { iconId: 'ops', titleKey: 'princ_ops', descKey: 'princ_ops_desc' },
  { iconId: 'depth', titleKey: 'princ_depth', descKey: 'princ_depth_desc' },
] as const
