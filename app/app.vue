<script setup lang="ts">
import { MotionConfig } from 'motion-v'

const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#0E1513' : '#F2F4F0')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: (title?: string) => {
    if (!title) return 'Vincent Ndegwa | Software and AI Engineer'
    return title.includes('Vincent Ndegwa') ? title : `${title} | Vincent Ndegwa`
  },
  ogImage: '/personal/profile.jpeg',
  twitterImage: '/personal/profile.jpeg',
  twitterCard: 'summary_large_image'
})

const [{ data: navigation }, { data: files }] = await Promise.all([
  useAsyncData('navigation', () => {
    return Promise.all([
      queryCollectionNavigation('blog')
    ])
  }, {
    transform: data => data.flat()
  }),
  useLazyAsyncData('search', () => {
    return Promise.all([
      queryCollectionSearchSections('blog')
    ])
  }, {
    server: false,
    transform: data => data.flat()
  })
])

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <MotionConfig reduced-motion="user">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </MotionConfig>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        shortcut="meta_k"
        :links="navLinks"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
