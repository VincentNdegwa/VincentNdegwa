<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('blog', route.path, {
    fields: ['description']
  })
)

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

// Crop the cover to the 1200x630 social card size so the declared dimensions are true.
const ogImageUrl = (() => {
  const url = new URL(page.value.image, 'https://vincentndegwa.com')
  url.searchParams.set('w', '1200')
  url.searchParams.set('h', '630')
  url.searchParams.set('fit', 'crop')
  return url.toString()
})()

useSeoMeta({
  title,
  description,
  ogDescription: description,
  ogTitle: title,
  ogType: 'article',
  ogImage: { url: ogImageUrl, width: 1200, height: 630, alt: page.value.title },
  twitterImage: { url: ogImageUrl, alt: page.value.title },
  articlePublishedTime: new Date(page.value.date).toISOString(),
  articleAuthor: ['https://vincentndegwa.com/about']
})

useSchemaOrg([
  defineWebPage({ description }),
  defineArticle({
    '@type': 'BlogPosting',
    'headline': page.value.title,
    description,
    'image': ogImageUrl,
    'datePublished': new Date(page.value.date).toISOString(),
    'timeRequired': page.value.minRead ? `PT${page.value.minRead}M` : undefined
  })
])

const copyLink = () => {
  copyToClipboard(window.location.href, 'Article link copied to clipboard')
}

const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <article
    v-if="page"
    class="wrap pt-8 pb-20 sm:pt-12 sm:pb-28"
  >
    <div class="mx-auto max-w-[72ch]">
      <NuxtLink
        to="/blog"
        class="inline-flex items-center gap-1.5 py-2 text-[15px] font-medium text-ink-2 hover:text-accent"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="size-4"
        />
        All notes
      </NuxtLink>

      <Reveal
        on-load
        class="mt-8 flex flex-col gap-5"
      >
        <p class="font-mono text-[13px] text-ink-3">
          <time
            v-if="page.date"
            :datetime="new Date(page.date).toISOString().slice(0, 10)"
          >{{ formatDate(page.date) }}</time><span v-if="page.minRead"> · {{ page.minRead }} min read</span>
        </p>
        <h1 class="text-[clamp(36px,4.6vw,60px)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink [font-stretch:85%]">
          {{ page.title }}
        </h1>
        <p class="text-lg leading-relaxed text-ink-2">
          {{ page.description }}
        </p>
      </Reveal>
    </div>

    <Reveal
      on-load
      :delay="0.1"
      class="mx-auto mt-10 max-w-5xl"
    >
      <NuxtImg
        :src="page.image"
        :alt="page.title"
        width="1600"
        class="aspect-[2/1] w-full rounded-3xl bg-surface-2 object-cover"
      />
    </Reveal>

    <div class="mx-auto mt-12 max-w-[72ch]">
      <div class="prose-vn">
        <ContentRenderer
          v-if="page.body"
          :value="page"
        />
      </div>

      <div class="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <UUser
          v-if="page.author"
          v-bind="page.author"
          size="lg"
        />
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-link"
          label="Copy link"
          @click="copyLink"
        />
      </div>

      <UContentSurround
        :surround="surround || []"
        class="mt-10"
      />
    </div>
  </article>
</template>
