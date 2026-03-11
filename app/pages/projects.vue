<script setup lang="ts">
const { data: page } = await useAsyncData('projects-page', () => {
  return queryCollection('pages').path('/projects').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').all()
})

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
      :links="page.links"
      :ui="{
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start'
      }"
    >
      <template #links>
        <div
          v-if="page.links"
          class="flex items-center gap-2"
        >
          <UButton
            :label="page.links[0]?.label"
            :to="global.meetingLink"
            target="_blank"
            v-bind="page.links[0]"
          />
          <UButton
            :to="`mailto:${global.email}`"
            target="_blank"
            v-bind="page.links[1]"
          />
        </div>
      </template>
    </UPageHero>
    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <Motion
        v-for="(project, index) in projects"
        :key="project.title"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.2 * index }"
        :in-view-options="{ once: true }"
      >
        <UPageCard
          :title="project.title"
          :description="project.description"
          orientation="horizontal"
          variant="naked"
          :reverse="index % 2 === 1"
          class="group"
          :ui="{
            wrapper: 'max-sm:order-last'
          }"
        >
          <template #leading>
            <span class="text-sm text-muted">
              {{ new Date(project.date).getFullYear() }}
            </span>
          </template>
          <template #footer>
            <div class="flex flex-col gap-3">
              <div class="flex flex-wrap gap-1.5">
                <UBadge
                  v-for="tag in project.tags"
                  :key="tag"
                  :label="tag"
                  variant="subtle"
                  color="primary"
                  size="sm"
                  class="font-mono text-xs"
                />
              </div>
              <div class="flex items-center gap-4">
                <ULink
                  v-if="project.url && project.url !== '#'"
                  :to="project.url"
                  target="_blank"
                  class="text-sm text-primary flex items-center gap-1"
                >
                  <UIcon name="i-lucide-external-link" class="size-4" />
                  Live
                </ULink>
                <ULink
                  v-if="project.repository"
                  :to="project.repository"
                  target="_blank"
                  class="text-sm text-muted flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <UIcon name="i-simple-icons-github" class="size-4" />
                  GitHub
                </ULink>
                <span
                  v-if="!project.repository && (!project.url || project.url === '#')"
                  class="text-sm text-muted italic"
                >NDA — available on request</span>
              </div>
            </div>
          </template>
          <img
            :src="project.image"
            :alt="project.title"
            class="object-cover w-full h-48 rounded-lg"
          >
        </UPageCard>
      </Motion>
    </UPageSection>
  </UPage>
</template>
