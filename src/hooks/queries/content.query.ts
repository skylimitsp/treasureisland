import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { getAboutContent, getFaqs, getTestimonials } from '#/data/content'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { Faq, Testimonial } from '#/types'
import type { AboutContent } from '#/types/about'

export const contentKeys = {
  all: ['content'] as const,
  testimonials: () => ['content', 'testimonials'] as const,
  faqs: () => ['content', 'faqs'] as const,
  about: () => ['content', 'about'] as const,
}

const fetchTestimonials = withErrorHandling(
  async (): Promise<Array<Testimonial>> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return getTestimonials()
  },
  'Failed to load testimonials',
)

const fetchFaqs = withErrorHandling(async (): Promise<Array<Faq>> => {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return getFaqs()
}, 'Failed to load FAQs')

const fetchAbout = withErrorHandling(async (): Promise<AboutContent> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return getAboutContent()
}, 'Failed to load about content')

// Shared options so route loaders can prefetch (SSR/crawlable).
export const aboutQueryOptions = () =>
  queryOptions({
    queryKey: contentKeys.about(),
    queryFn: fetchAbout,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

export const testimonialsQueryOptions = () =>
  queryOptions({
    queryKey: contentKeys.testimonials(),
    queryFn: fetchTestimonials,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

export const faqsQueryOptions = () =>
  queryOptions({
    queryKey: contentKeys.faqs(),
    queryFn: fetchFaqs,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Lists guest testimonials.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useTestimonialsQuery = () => useQuery(testimonialsQueryOptions())

/**
 * Lists frequently asked questions.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useFaqsQuery = () =>
  useQuery({
    queryKey: contentKeys.faqs(),
    queryFn: fetchFaqs,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Loads the About page content.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useAboutContent = () => useQuery(aboutQueryOptions())
