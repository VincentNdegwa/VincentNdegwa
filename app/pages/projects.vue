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
    <!-- Page header -->
    <section class="relative overflow-hidden py-16 sm:py-20">
      <div class="dot-grid absolute inset-0 pointer-events-none" />
      <div class="relative z-10 flex flex-col gap-4 max-w-2xl">
        <p class="text-xs font-mono tracking-widest uppercase text-primary/70">
          / projects
        </p>
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
          {{ page.title }}
        </h1>
        <p class="text-muted text-sm sm:text-base leading-relaxed">
          {{ page.description }}
        </p>
        <div class="flex items-center gap-3 flex-wrap mt-2">
          <UButton
            label="Schedule a Call"
            icon="i-lucide-calendar"
            :to="global.meetingLink"
            target="_blank"
            color="primary"
            size="md"
          />
          <UButton
            label="Email Me"
            icon="i-lucide-mail"
            :to="`mailto:${global.email}`"
            target="_blank"
            color="neutral"
            variant="outline"
            size="md"
          />
        </div>
      </div>
    </section>

    <!-- Projects grid -->
    <section class="pb-20">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <Motion
          v-for="(project, index) in projects"
          :key="project.title"
          :initial="{ opacity: 0, transform: 'translateY(16px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.08 * index }"
          :in-view-options="{ once: true }"
        >
          <div class="group flex flex-col rounded-xl border border-default overflow-hidden h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-default">
            <!-- Image -->
            <div class="relative overflow-hidden">
              <img
                :src="project.image"
                :alt="project.title"
                class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
              >
              <span class="absolute top-3 right-3 font-mono text-xs bg-default/85 backdrop-blur-sm px-2 py-0.5 rounded border border-default">
                {{ new Date(project.date).getFullYear() }}
              </span>
            </div>

            <!-- Body -->
            <div class="flex flex-col gap-3 p-4 flex-1">
              <div>
                <h3 class="font-semibold text-highlighted text-base leading-snug">
                  {{ project.title }}
                </h3>
                <p class="text-xs text-muted mt-1.5 leading-relaxed line-clamp-3">
                  {{ project.description }}
                </p>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1.5 mt-auto pt-2">
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

              <!-- Links -->
              <div class="flex items-center gap-4 pt-3 border-t border-default">
                <ULink
                  v-if="project.url && project.url !== '#'"
                  :to="project.url"
                  target="_blank"
                  class="text-sm text-primary flex items-center gap-1.5 hover:underline"
                >
                  <UIcon name="i-lucide-external-link" class="size-3.5" />
                  Live
                </ULink>
                <ULink
                  v-if="project.repository"
                  :to="project.repository"
                  target="_blank"
                  class="text-sm text-muted flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <UIcon name="i-simple-icons-github" class="size-3.5" />
                  GitHub
                </ULink>
                <span
                  v-if="!project.repository && (!project.url || project.url === '#')"
                  class="text-xs text-muted italic"
                >NDA — on request</span>
              </div>
            </div>
          </div>
        </Motion>
      </div>
    </section>
  </UPage>
</template>
