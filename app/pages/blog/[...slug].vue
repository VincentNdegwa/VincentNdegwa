<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { mapContentNavigation } from '@nuxt/ui/utils/content'
import { findPageBreadcrumb } from '@nuxt/content/utils'

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

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation', ref([]))
const blogNavigation = computed(() => navigation.value?.find(item => item.path === '/blog')?.children || [])

const breadcrumb = computed(() => mapContentNavigation(findPageBreadcrumb(blogNavigation?.value, page.value?.path)).map(({ icon, ...link }) => link))

if (page.value.image) {
  defineOgImage({ url: page.value.image })
} else {
  defineOgImageComponent('Blog', {
    headline: breadcrumb.value.map(item => item.label).join(' > ')
  }, {
    fonts: ['Geist:400', 'Geist:600']
  })
}

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  description,
  ogDescription: description,
  ogTitle: title
})

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
          <span v-if="page.date">{{ formatDate(page.date) }}</span><span v-if="page.minRead"> · {{ page.minRead }} min read</span>
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
