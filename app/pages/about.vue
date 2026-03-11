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
    <UPageHero
      :title="page.title"
      :description="page.description"
      orientation="horizontal"
      :ui="{
        container: 'lg:flex sm:flex-row items-center',
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start'
      }"
    >
      <UColorModeAvatar
        class="sm:rotate-4 size-36 rounded-lg ring ring-default ring-offset-3 ring-offset-bg"
        :light="global.picture?.light!"
        :dark="global.picture?.dark!"
        :alt="global.picture?.alt!"
      />
    </UPageHero>
    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <MDC
        :value="page.content"
        unwrap="p"
      />
      <div class="flex flex-row justify-center items-center py-10 -space-x-8">
        <PolaroidItem
          v-for="(image, index) in page.images"
          :key="index"
          :image="image"
          :index
        />
      </div>
      <div class="flex flex-col items-center gap-4 py-8 border-t border-default mt-4">
        <p class="text-sm text-muted text-center max-w-md">
          Open to full-time roles, contract work, and interesting side projects. Let's build something worth shipping.
        </p>
        <div class="flex items-center gap-3 flex-wrap justify-center">
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
    </UPageSection>
  </UPage>
</template>
