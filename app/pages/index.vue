<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => {
  return queryCollection('index').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

useSeoMeta({
  title: page.value?.seo.title || page.value?.title,
  ogTitle: page.value?.seo.title || page.value?.title,
  description: page.value?.seo.description || page.value?.description,
  ogDescription: page.value?.seo.description || page.value?.description
})

useSchemaOrg([
  defineWebPage({ '@type': 'ProfilePage' })
])
</script>

<template>
  <div v-if="page">
    <LandingHero :page />
    <LandingTools :page />
    <LandingAbout :page />
    <LandingWork :page />
    <LandingWorkExperience :page />
    <LandingLab :page />
    <LandingContact
      :title="page.contact.title"
      :description="page.contact.description"
    />
  </div>
</template>
