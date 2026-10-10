// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
    'nuxt-seo-utils',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'motion-v/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // Canonical origin for absolute URLs (canonical, og:url, og:image, sitemap, schema).
  // Without it, Vercel preview hostnames leak into production meta tags.
  site: {
    url: 'https://vincentndegwa.com',
    name: 'Vincent Ndegwa',
    description: 'Software and AI engineer building scalable software applications and AI products: full-stack platforms, payment systems, RAG pipelines and LLM features.',
    defaultLocale: 'en'
  },

  // Blog slugs were renamed to match their articles; keep the old URLs working.
  routeRules: {
    '/blog/from-mockup-to-market': { redirect: { to: '/blog/laravel-report-generation-30s-to-2s', statusCode: 301 } },
    '/blog/how-i-built-my-own-design-system-from-scratch': { redirect: { to: '/blog/integrating-llms-into-laravel-python-microservices', statusCode: 301 } },
    '/blog/psychology-of-color-in-ui-design': { redirect: { to: '/blog/postgresql-vs-mongodb-crm-reporting', statusCode: 301 } },
    '/blog/slow-design-in-fast-paced-digital-world': { redirect: { to: '/blog/github-actions-laravel-zero-downtime-deployment', statusCode: 301 } }
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true,
      // The Vercel image optimizer only exists at runtime; the crawler finds it via image preload links.
      ignore: ['/_vercel/image']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  image: {
    quality: 80
  },

  schemaOrg: {
    identity: {
      type: 'Person',
      name: 'Vincent Ndegwa',
      jobTitle: 'Software and AI Engineer',
      description: 'Software and AI engineer with six years of experience building scalable platforms, payment systems and production AI features.',
      image: '/personal/profile.jpeg',
      email: 'ndegwavincent7@gmail.com',
      address: { '@type': 'PostalAddress', 'addressCountry': 'KE' },
      worksFor: { '@type': 'Organization', 'name': 'Paysoko Systems' },
      alumniOf: [
        { '@type': 'CollegeOrUniversity', 'name': 'Open University of Kenya' },
        { '@type': 'CollegeOrUniversity', 'name': 'Kirinyaga University' }
      ],
      knowsAbout: [
        'Software Engineering',
        'Artificial Intelligence',
        'Large Language Models',
        'Retrieval-Augmented Generation',
        'Laravel',
        'Python',
        'FastAPI',
        'Node.js',
        'Vue.js',
        'Nuxt',
        'React',
        'PostgreSQL',
        'Stripe Payments'
      ],
      sameAs: [
        'https://github.com/VincentNdegwa',
        'https://www.linkedin.com/in/vincentndegwa01/',
        'https://x.com/SWE_Vincent'
      ]
    }
  },

  sitemap: {
    discoverImages: false,
    zeroRuntime: true
  }
})
