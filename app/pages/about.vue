<script setup lang="ts">
const { data: page } = await useAsyncData('about', () => {
  return queryCollection('about').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { global } = useAppConfig()

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})
</script>

<template>
  <UPage v-if="page">
    <!-- Custom header: split layout matching home page language -->
    <section class="relative overflow-hidden py-14 sm:py-20">
      <div class="dot-grid absolute inset-0 pointer-events-none" />
      <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10">
        <!-- Left: text -->
        <div class="flex flex-col gap-4 max-w-xl">
          <p class="text-xs font-mono tracking-widest uppercase text-primary/70">
            / about
          </p>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">
            {{ page.title }}
          </h1>
          <p class="text-sm sm:text-base text-muted leading-relaxed">
            {{ page.description }}
          </p>
        </div>

        <!-- Right: photo with glow -->
        <div class="relative shrink-0">
          <div class="absolute -inset-4 rounded-3xl bg-linear-to-br from-violet-500/20 via-indigo-500/10 to-transparent blur-2xl -z-10" />
          <div class="relative rounded-2xl overflow-hidden ring-1 ring-default size-44 sm:size-52 bg-muted">
            <img
              :src="global.picture?.dark"
              :alt="global.picture?.alt"
              class="hidden dark:block w-full h-full object-cover"
            >
            <img
              :src="global.picture?.light"
              :alt="global.picture?.alt"
              class="block dark:hidden w-full h-full object-cover"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Content section -->
    <section class="pb-20">
      <!-- MDC prose content -->
      <div class="prose prose-sm dark:prose-invert max-w-none">
        <MDC
          :value="page.content"
          unwrap="p"
        />
      </div>

      <!-- Contact CTA -->
      <div class="flex flex-col items-start gap-4 pt-10 mt-10 border-t border-default">
        <p class="text-sm text-muted max-w-md">
          Open to full-time roles, contract work, and interesting side projects. Let's build something worth shipping.
        </p>
        <div class="flex items-center gap-3 flex-wrap">
          <UButton
            label="Schedule a call"
            icon="i-lucide-calendar"
            :to="global.meetingLink"
            target="_blank"
            color="primary"
          />
          <UButton
            label="Send an email"
            icon="i-lucide-mail"
            :to="`mailto:${global.email}`"
            target="_blank"
            color="neutral"
            variant="outline"
          />
        </div>
      </div>
    </section>
  </UPage>
</template>
