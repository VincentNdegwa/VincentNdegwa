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
  new Date(d).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
</script>

<template>
  <div v-if="page">
    <section class="wrap pt-10 pb-12 sm:pt-16 sm:pb-16">
      <Reveal
        on-load
        class="flex max-w-3xl flex-col gap-5"
      >
        <h1 class="text-[clamp(44px,6vw,88px)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink [font-stretch:82%]">
          {{ page.title }}
        </h1>
        <p class="max-w-[56ch] text-lg leading-relaxed text-ink-2">
          {{ page.description }}
        </p>
      </Reveal>
    </section>

    <section class="wrap pb-20 sm:pb-28">
      <div class="grid gap-6 md:grid-cols-2">
        <Reveal
          v-for="(post, index) in posts"
          :key="post.path"
          as="article"
          :delay="0.05 * (index % 2)"
        >
          <NuxtLink
            :to="post.path"
            class="lift group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface"
          >
            <NuxtImg
              :src="post.image"
              :alt="post.title"
              width="900"
              loading="lazy"
              class="aspect-[16/9] w-full bg-surface-2 object-cover"
            />
            <div class="flex flex-1 flex-col gap-3 p-6 sm:p-7">
              <p class="font-mono text-[13px] text-ink-3">
                {{ formatDate(post.date) }}<span v-if="post.minRead"> · {{ post.minRead }} min read</span>
              </p>
              <h2 class="text-[22px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
                {{ post.title }}
              </h2>
              <p class="line-clamp-3 text-[15px] leading-relaxed text-ink-2">
                {{ post.description }}
              </p>
            </div>
          </NuxtLink>
        </Reveal>
      </div>
    </section>
  </div>
</template>
