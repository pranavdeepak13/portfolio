import { z } from 'zod'

export const requiredText = z.string().trim().min(1)
export const internalHref = z.string().regex(
  /^(?:\/(?!\/)(?:[A-Za-z0-9][A-Za-z0-9/_-]*)?(?:#[A-Za-z0-9_-]+)?|#[A-Za-z0-9_-]+)$/,
  'Expected an internal path or anchor.'
)
export const httpsUrl = z.string().url().refine((value) => value.startsWith('https://'), {
  message: 'Expected an HTTPS URL.'
})
export const imagePath = z.string().regex(
  /^\/images\/(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9][A-Za-z0-9._/-]*$/,
  'Expected a local image path under /images/.'
)
export const objectPosition = z.string().regex(
  /^(?:100|[1-9]?\d)% (?:100|[1-9]?\d)%$/,
  'Expected an object position such as "50% 50%".'
)

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Expected a stable kebab-case identifier.')
export const gradientTokenSchema = z.enum(['aurora', 'sunset', 'cobalt', 'orchid', 'citrus'])

const siteSchema = z.object({
  name: requiredText,
  mark: requiredText,
  role: requiredText,
  language: requiredText,
  metadata: z.object({
    title: requiredText,
    description: requiredText
  }).strict(),
  resume: z.object({
    label: requiredText,
    fallbackUrl: httpsUrl
  }).strict(),
  socials: z.array(z.object({ label: requiredText, href: httpsUrl }).strict()),
  socialsLabel: requiredText,
  footer: requiredText
}).strict()

const interfaceCopySchema = z.object({
  skipToContentLabel: requiredText,
  loading: z.object({
    title: requiredText,
    detail: requiredText
  }).strict(),
  error: z.object({
    title: requiredText,
    reloadLabel: requiredText
  }).strict()
}).strict()

const navigationItemSchema = z.object({ label: requiredText, href: internalHref }).strict()
const navigationSchema = z.object({
  primaryLabel: requiredText,
  mobileLabel: requiredText,
  menuOpenLabel: requiredText,
  menuCloseLabel: requiredText,
  menuLabel: requiredText,
  backToTopLabel: requiredText,
  primary: z.array(navigationItemSchema),
  secondaryLabel: requiredText,
  secondary: z.array(z.object({
    id: z.enum(['blog', 'recommendations']),
    label: requiredText,
    href: internalHref
  }).strict())
}).strict()

const heroSchema = z.object({
  markLabel: requiredText,
  ambientTop: requiredText,
  ambientBottom: requiredText,
  scrollLabel: requiredText,
  scrollHref: internalHref
}).strict()

const aboutSchema = z.object({
  eyebrow: requiredText,
  headline: requiredText,
  portrait: z.object({ src: imagePath, alt: requiredText }).strict(),
  paragraphs: z.array(requiredText),
  actions: z.array(navigationItemSchema)
}).strict()

const sectionsSchema = z.object({
  experience: z.object({ title: requiredText, subtitle: requiredText, empty: requiredText }).strict(),
  projects: z.object({
    title: requiredText,
    subtitle: requiredText,
    empty: requiredText,
    codeLabel: requiredText,
    demoLabel: requiredText
  }).strict(),
  sideQuests: z.object({ title: requiredText, subtitle: requiredText, empty: requiredText }).strict(),
  writing: z.object({
    title: requiredText,
    metadata: z.object({ title: requiredText, description: requiredText }).strict(),
    viewAllLabel: requiredText,
    empty: requiredText,
    previewLimit: z.number().int().min(1).max(12)
  }).strict(),
  recommendations: z.object({ title: requiredText, viewAllLabel: requiredText, empty: requiredText }).strict(),
  hobbies: z.object({ title: requiredText, subtitle: requiredText, empty: requiredText }).strict()
}).strict()

const experienceSchema = z.object({
  id,
  period: requiredText,
  title: requiredText,
  summary: requiredText,
  stack: z.array(requiredText)
}).strict()

const projectSchema = z.object({
  slug: id,
  title: requiredText,
  subtitle: requiredText,
  description: requiredText,
  details: requiredText.nullable().optional(),
  tech: z.array(requiredText),
  metrics: z.array(requiredText),
  links: z.object({ repo: httpsUrl.nullable().optional(), demo: httpsUrl.nullable().optional() }).strict()
}).strict()

const sideQuestSchema = z.object({
  slug: id,
  title: requiredText,
  subtitle: requiredText,
  details: requiredText,
  links: z.array(z.object({ label: requiredText, href: httpsUrl }).strict())
}).strict()

const recommendationBaseSchema = z.object({
  id,
  title: requiredText,
  href: httpsUrl.nullable().optional(),
  image: imagePath.nullable().optional(),
  gradient: gradientTokenSchema
})

const bookRecommendationSchema = recommendationBaseSchema.extend({
  kind: z.literal('book'),
  author: requiredText.nullable().optional()
}).strict()
const movieRecommendationSchema = recommendationBaseSchema.extend({
  kind: z.literal('movie'),
  year: requiredText.nullable().optional(),
  tmdbId: z.number().int().positive().nullable().optional()
}).strict()
const videoRecommendationSchema = recommendationBaseSchema.extend({
  kind: z.literal('video'),
  channel: requiredText.nullable().optional()
}).strict()
const articleRecommendationSchema = recommendationBaseSchema.extend({
  kind: z.literal('article'),
  publication: requiredText.nullable().optional()
}).strict()
const recommendationSchema = z.union([
  bookRecommendationSchema,
  movieRecommendationSchema,
  videoRecommendationSchema,
  articleRecommendationSchema
])

const recommendationsSchema = z.object({
  previewLimit: z.number().int().min(1).max(12),
  countsLabel: requiredText,
  booksTitle: requiredText,
  booksLabel: requiredText,
  labels: z.object({
    book: requiredText,
    movie: requiredText,
    video: requiredText,
    article: requiredText,
    editorial: requiredText
  }).strict(),
  shelfTitle: requiredText,
  shelfNote: requiredText,
  filmsTitle: requiredText,
  editorialTitle: requiredText,
  letterboxd: z.object({ label: requiredText, href: httpsUrl }).strict(),
  items: z.array(recommendationSchema)
}).strict()

const hobbiesSchema = z.array(z.object({
  id,
  src: imagePath,
  alt: requiredText,
  title: requiredText,
  blurb: requiredText,
  objectPosition
}).strict())

const contactSchema = z.object({
  triggerLabel: requiredText,
  eyebrow: requiredText,
  title: requiredText,
  intro: requiredText,
  closeLabel: requiredText,
  fields: z.object({
    name: z.object({ label: requiredText, autoComplete: requiredText }).strict(),
    email: z.object({ label: requiredText, autoComplete: requiredText }).strict(),
    message: z.object({ label: requiredText }).strict(),
    website: z.object({ label: requiredText }).strict()
  }).strict(),
  submitLabel: requiredText,
  submittingLabel: requiredText,
  validation: z.object({
    nameRequired: requiredText,
    nameTooShort: requiredText,
    nameTooLong: requiredText,
    nameUnsafe: requiredText,
    emailRequired: requiredText,
    emailTooLong: requiredText,
    emailInvalid: requiredText,
    messageRequired: requiredText,
    messageTooShort: requiredText,
    messageTooLong: requiredText,
    messageUnsafe: requiredText
  }).strict(),
  messages: z.object({
    invalid: requiredText,
    sending: requiredText,
    success: requiredText,
    rateLimited: requiredText,
    failure: requiredText,
    network: requiredText
  }).strict()
}).strict()

export const portfolioSchema = z.object({
  site: siteSchema,
  interface: interfaceCopySchema,
  navigation: navigationSchema,
  hero: heroSchema,
  about: aboutSchema,
  sections: sectionsSchema,
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  sideQuests: z.array(sideQuestSchema),
  writing: z.object({
    notFoundTitle: requiredText,
    backLabel: requiredText,
    indexLabel: requiredText,
    readLabel: requiredText
  }).strict(),
  recommendations: recommendationsSchema,
  hobbies: hobbiesSchema,
  contact: contactSchema
}).strict().superRefine((content, context) => {
  const reportDuplicates = (entries: Array<{ value: string; path: Array<string | number> }>) => {
    const firstPaths = new Map<string, Array<string | number>>()
    for (const entry of entries) {
      const firstPath = firstPaths.get(entry.value)
      if (firstPath) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: firstPath, message: `Duplicate value: ${entry.value}` })
        context.addIssue({ code: z.ZodIssueCode.custom, path: entry.path, message: `Duplicate value: ${entry.value}` })
      } else {
        firstPaths.set(entry.value, entry.path)
      }
    }
  }

  reportDuplicates(content.experience.map((item, index) => ({ value: item.id, path: ['experience', index, 'id'] })))
  reportDuplicates(content.projects.map((item, index) => ({ value: item.slug, path: ['projects', index, 'slug'] })))
  reportDuplicates(content.sideQuests.map((item, index) => ({ value: item.slug, path: ['sideQuests', index, 'slug'] })))
  reportDuplicates(content.hobbies.map((item, index) => ({ value: item.id, path: ['hobbies', index, 'id'] })))
  reportDuplicates(content.recommendations.items.map((item, index) => ({ value: item.id, path: ['recommendations', 'items', index, 'id'] })))
  reportDuplicates(content.navigation.primary.map((item, index) => ({ value: item.href, path: ['navigation', 'primary', index, 'href'] })))
  reportDuplicates(content.navigation.secondary.map((item, index) => ({ value: item.href, path: ['navigation', 'secondary', index, 'href'] })))
  reportDuplicates(content.navigation.secondary.map((item, index) => ({ value: item.id, path: ['navigation', 'secondary', index, 'id'] })))
})

export type GradientToken = z.infer<typeof gradientTokenSchema>
export type PortfolioContentShape = z.infer<typeof portfolioSchema>
export type PortfolioContent = PortfolioContentShape
export type Project = z.infer<typeof projectSchema>
export type Recommendation = z.infer<typeof recommendationSchema>
export type ContactCopy = z.infer<typeof contactSchema>
export type NavigationContent = z.infer<typeof navigationSchema>

export function parsePortfolioContent(input: unknown): PortfolioContent {
  return portfolioSchema.parse(input)
}

export interface ResumeUrlEnvironment {
  NEXT_PUBLIC_RESUME_URL?: string
  NEXT_PUBLIC_RESUME_SHEET_URL?: string
}

function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function resolvePortfolioContent(
  input: unknown,
  environment: ResumeUrlEnvironment
): PortfolioContent {
  const resumeUrl = environment.NEXT_PUBLIC_RESUME_URL
    ?? environment.NEXT_PUBLIC_RESUME_SHEET_URL

  if (
    resumeUrl === undefined
    || !isUnknownRecord(input)
    || !isUnknownRecord(input.site)
    || !isUnknownRecord(input.site.resume)
  ) {
    return parsePortfolioContent(input)
  }

  return parsePortfolioContent({
    ...input,
    site: {
      ...input.site,
      resume: {
        ...input.site.resume,
        fallbackUrl: resumeUrl
      }
    }
  })
}
