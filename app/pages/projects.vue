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

const sortedProjects = computed(() => [...(projects.value || [])]
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99)))

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})

const year = (date: string | Date) => new Date(date).getFullYear()
</script>

<template>
  <div v-if="page">
    <section class="wrap pt-10 pb-14 sm:pt-16 sm:pb-20">
      <Reveal
        on-load
        class="flex max-w-3xl flex-col items-start gap-6"
      >
        <h1 class="text-[clamp(44px,6vw,88px)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink [font-stretch:82%]">
          {{ page.title }}
        </h1>
        <p class="max-w-[56ch] text-lg leading-relaxed text-ink-2">
          {{ page.description }}
        </p>
        <div
          v-if="page.links?.length"
          class="flex flex-wrap gap-3"
        >
          <AppButton
            v-for="link in page.links"
            :key="link.label"
            :to="link.to || '/'"
            :label="link.label"
            :variant="link.variant"
            :target="link.target"
          />
        </div>
      </Reveal>
    </section>

    <section class="wrap pb-20 sm:pb-28">
      <div class="grid gap-6 md:grid-cols-2">
        <Reveal
          v-for="(project, index) in sortedProjects"
          :key="project.id"
          as="article"
          :delay="0.05 * (index % 2)"
          class="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface"
        >
          <NuxtImg
            v-if="project.image"
            :src="project.image"
            :alt="`${project.title} screenshot`"
            width="1000"
            format="webp"
            loading="lazy"
            class="aspect-[16/10] w-full bg-surface-2 object-cover object-top"
          />
          <div
            v-else
            class="flex aspect-[16/10] w-full flex-col justify-end gap-2 bg-accent p-7 text-on-accent"
          >
            <template v-if="project.metrics?.[0]">
              <span class="text-[clamp(44px,5vw,64px)] font-semibold leading-none tracking-[-0.02em] [font-stretch:78%]">{{ project.metrics[0].value }}</span>
              <span class="text-[15px] opacity-85">{{ project.metrics[0].label }}</span>
            </template>
          </div>

          <div class="flex flex-1 flex-col gap-4 p-6 sm:p-7">
            <div class="flex items-baseline justify-between gap-4">
              <h2 class="text-2xl font-semibold tracking-[-0.015em] text-ink">
                {{ project.title }}
              </h2>
              <span class="font-mono text-[13px] text-ink-3">{{ year(project.date) }}</span>
            </div>
            <p class="text-[15px] leading-relaxed text-ink-2">
              {{ project.description }}
            </p>
            <ul class="flex flex-wrap gap-1.5 text-xs font-semibold text-ink-2">
              <li
                v-for="tag in project.tags"
                :key="tag"
                class="rounded-full bg-canvas px-3 py-1.5"
              >
                {{ tag }}
              </li>
            </ul>
            <div class="mt-auto flex flex-wrap items-center gap-5 border-t border-line pt-4 text-[15px] font-semibold">
              <NuxtLink
                v-if="project.url && project.url !== '#'"
                :to="project.url"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1.5 py-1.5 text-accent hover:underline underline-offset-4"
              >
                Live site
                <UIcon
                  name="i-lucide-arrow-up-right"
                  class="size-4"
                />
              </NuxtLink>
              <NuxtLink
                v-if="project.repository"
                :to="project.repository"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1.5 py-1.5 text-ink-2 hover:text-accent"
              >
                <UIcon
                  name="i-simple-icons-github"
                  class="size-4"
                />
                Source
              </NuxtLink>
              <span
                v-if="project.confidential"
                class="py-1.5 text-sm font-medium text-ink-3"
              >Private client work, details on request</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <LandingContact
      title="Have something to build?"
      description="Open to senior engineering roles, contracts and AI product work."
    />
  </div>
</template>
