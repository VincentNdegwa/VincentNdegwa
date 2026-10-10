<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

const notFound = computed(() => props.error?.statusCode === 404)

useSeoMeta({
  title: notFound.value ? 'Page not found' : 'Something went wrong',
  description: 'This page could not be found.'
})
</script>

<template>
  <UApp>
    <div class="flex min-h-dvh flex-col bg-canvas text-ink">
      <AppHeader />
      <main class="wrap flex flex-1 flex-col items-start justify-center gap-6 py-24">
        <p class="font-mono text-sm text-accent">
          {{ error.statusCode }}
        </p>
        <h1 class="max-w-[16ch] text-[clamp(40px,5.4vw,80px)] font-semibold leading-[1.05] tracking-[-0.03em] [font-stretch:82%]">
          {{ notFound ? 'This page does not exist.' : 'Something went wrong.' }}
        </h1>
        <p class="max-w-[48ch] text-lg leading-relaxed text-ink-2">
          {{ notFound ? 'The link may be old or mistyped. The home page has everything else.' : 'Please try again in a moment.' }}
        </p>
        <AppButton
          to="/"
          label="Back to home"
        />
      </main>
      <AppFooter />
    </div>
  </UApp>
</template>
