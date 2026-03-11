<script setup lang="ts">
const { data: page } = await useAsyncData('blog-page', () => {
  return queryCollection('pages').path('/blog').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}
const { data: posts } = await useAsyncData('blogs', () =>
  queryCollection('blog').order('date', 'DESC').all()
)
if (!posts.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'blogs posts not found',
    fatal: true
  })
}

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})

const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
</script>

<template>
  <UPage v-if="page">
    <!-- Page header -->
    <section class="relative overflow-hidden py-16 sm:py-20">
      <div class="dot-grid absolute inset-0 pointer-events-none" />
      <div class="relative z-10 flex flex-col gap-4 max-w-2xl">
        <p class="text-xs font-mono tracking-widest uppercase text-primary/70">
          / writing
        </p>
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
          {{ page.title }}
        </h1>
        <p class="text-muted text-sm sm:text-base leading-relaxed">
          {{ page.description }}
        </p>
      </div>
    </section>

    <!-- Article list -->
    <section class="pb-20">
      <div class="flex flex-col divide-y divide-default">
        <Motion
          v-for="(post, index) in posts"
          :key="post.path"
          :initial="{ opacity: 0, x: -12 }"
          :while-in-view="{ opacity: 1, x: 0 }"
          :transition="{ delay: 0.1 * index }"
          :in-view-options="{ once: true }"
        >
          <NuxtLink
            :to="post.path"
            class="group flex flex-col sm:flex-row gap-5 py-8 hover:bg-muted/30 -mx-4 px-4 rounded-xl transition-colors"
          >
            <!-- Thumbnail -->
            <div class="shrink-0 overflow-hidden rounded-xl w-full sm:w-44 h-28 bg-muted">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              >
            </div>

            <!-- Text -->
            <div class="flex flex-col justify-between gap-2 flex-1 min-w-0">
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center gap-2 text-xs font-mono text-muted">
                  <span v-if="post.date">{{ formatDate(post.date) }}</span>
                  <span
                    v-if="post.minRead"
                    class="text-primary/50"
                  >·</span>
                  <span v-if="post.minRead">{{ post.minRead }} min read</span>
                </div>
                <h2 class="font-semibold text-highlighted text-base sm:text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {{ post.title }}
                </h2>
                <p class="text-xs text-muted leading-relaxed line-clamp-2">
                  {{ post.description }}
                </p>
              </div>
              <div class="flex items-center gap-1 text-xs font-mono text-primary">
                Read article
                <UIcon
                  name="i-lucide-arrow-right"
                  class="size-3 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </NuxtLink>
        </Motion>
      </div>
    </section>
  </UPage>
</template>
