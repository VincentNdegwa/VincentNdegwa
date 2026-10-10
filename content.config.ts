import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const createBaseSchema = () => z.object({
  title: z.string(),
  description: z.string()
})

const createButtonSchema = () => z.object({
  label: z.string(),
  icon: z.string().optional(),
  to: z.string().optional(),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional(),
  target: z.enum(['_blank', '_self']).optional()
})

const createImageSchema = () => z.object({
  src: z.string().editor({ input: 'media' }),
  alt: z.string()
})

const createAuthorSchema = () => z.object({
  name: z.string(),
  description: z.string().optional(),
  username: z.string().optional(),
  twitter: z.string().optional(),
  to: z.string().optional(),
  avatar: createImageSchema().optional()
})

const createMetricSchema = () => z.object({
  value: z.string(),
  label: z.string()
})

// A section headline with an optional emphasised tail, rendered in italic accent.
const createHeadingSchema = () => z.object({
  title: z.string(),
  highlight: z.string().optional(),
  description: z.string().optional()
})

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'page',
      source: 'index.yml',
      schema: z.object({
        hero: z.object({
          status: z.string(),
          unavailableStatus: z.string().optional(),
          headline: z.string(),
          highlight: z.string().optional(),
          intro: z.string(),
          links: z.array(createButtonSchema()),
          image: createImageSchema()
        }),
        tools: z.object({
          title: z.string(),
          rows: z.array(z.array(z.object({
            name: z.string(),
            icon: z.string().editor({ input: 'icon' }).optional()
          })))
        }),
        about: createHeadingSchema().extend({
          stats: z.array(createMetricSchema()),
          process: z.object({
            title: z.string(),
            steps: z.array(z.object({
              title: z.string(),
              description: z.string()
            }))
          })
        }),
        work: createHeadingSchema().extend({
          link: createButtonSchema().optional()
        }),
        experience: createHeadingSchema().extend({
          items: z.array(z.object({
            date: z.string(),
            current: z.boolean().optional(),
            position: z.string(),
            summary: z.string(),
            company: z.object({
              name: z.string(),
              url: z.string().optional()
            })
          })),
          cv: createButtonSchema().optional()
        }),
        lab: createHeadingSchema().extend({
          now: z.object({
            title: z.string(),
            items: z.array(z.string())
          }),
          repos: z.array(z.object({
            name: z.string(),
            description: z.string(),
            stack: z.string(),
            url: z.string()
          })),
          github: z.object({
            label: z.string(),
            username: z.string(),
            url: z.string()
          })
        }),
        contact: createBaseSchema()
      })
    }),
    projects: defineCollection({
      type: 'data',
      source: 'projects/*.yml',
      schema: z.object({
        title: z.string().nonempty(),
        summary: z.string().nonempty(),
        description: z.string().nonempty(),
        image: z.string().editor({ input: 'media' }).optional(),
        url: z.string().optional(),
        repository: z.string().optional(),
        confidential: z.boolean().optional(),
        featured: z.boolean().optional(),
        order: z.number().optional(),
        metrics: z.array(createMetricSchema()).optional(),
        tags: z.array(z.string()),
        date: z.date()
      })
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        minRead: z.number(),
        date: z.date(),
        image: z.string().nonempty().editor({ input: 'media' }),
        author: createAuthorSchema()
      })
    }),
    pages: defineCollection({
      type: 'page',
      source: [
        { include: 'projects.yml' },
        { include: 'blog.yml' }
      ],
      schema: z.object({
        links: z.array(createButtonSchema())
      })
    }),
    speaking: defineCollection({
      type: 'page',
      source: 'speaking.yml',
      schema: z.object({
        links: z.array(createButtonSchema()),
        events: z.array(z.object({
          category: z.enum(['Live talk', 'Podcast', 'Conference']),
          title: z.string(),
          date: z.date(),
          location: z.string(),
          url: z.string().optional()
        }))
      })
    }),
    about: defineCollection({
      type: 'page',
      source: 'about.yml',
      schema: z.object({
        content: z.object({}),
        images: z.array(createImageSchema())
      })
    })
  }
})
