<script setup lang="ts">
import type { IndexCollectionItem, ProjectsCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()

const { data: projects } = await useAsyncData('featured-projects', () =>
  queryCollection('projects').all()
)

// Featured projects drive the bento: the first is the large tile, the last runs full width.
const featured = computed(() => (projects.value || [])
  .filter(project => project.featured)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  .slice(0, 4))

const lead = computed(() => featured.value[0])
const middle = computed(() => featured.value.slice(1, 3))
const wide = computed(() => featured.value[3])

const linkFor = (project: ProjectsCollectionItem) => {
  if (project.url && project.url !== '#') return project.url
  if (project.repository) return project.repository
  return '/projects'
}

const isExternal = (to: string) => to.startsWith('http')
</script>

<template>
  <section
    id="work"
    class="wrap scroll-mt-24 pb-20 sm:pb-28 lg:pb-36"
  >
    <SectionHeading
      :title="page.work.title"
      :highlight="page.work.highlight"
      :description="page.work.description"
    />

    <div class="grid gap-5 lg:grid-cols-12">
      <!-- Lead project -->
      <Reveal
        v-if="lead"
        class="lg:col-span-8 lg:row-span-2"
      >
        <NuxtLink
          :to="linkFor(lead)"
          :target="isExternal(linkFor(lead)) ? '_blank' : undefined"
          :rel="isExternal(linkFor(lead)) ? 'noopener' : undefined"
          class="lift flex h-full flex-col gap-7 rounded-3xl bg-accent p-6 text-on-accent sm:p-10"
        >
          <div class="flex items-start justify-between gap-4">
            <ul class="flex flex-wrap gap-2 text-[13px] font-semibold">
              <li
                v-for="tag in lead.tags.slice(0, 4)"
                :key="tag"
                class="rounded-full border border-on-accent-2 px-3 py-1.5"
              >
                {{ tag }}
              </li>
            </ul>
            <span
              aria-hidden="true"
              class="lift-arrow flex size-12 shrink-0 items-center justify-center rounded-full bg-on-accent text-accent"
            >
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-5"
              />
            </span>
          </div>

          <div>
            <h3 class="max-w-[16ch] text-[clamp(32px,3.4vw,50px)] font-semibold leading-[1.05] tracking-[-0.025em] [font-stretch:82%]">
              {{ lead.title }}
            </h3>
            <p class="mt-3.5 max-w-[54ch] text-[17px] leading-relaxed opacity-85">
              {{ lead.summary }}
            </p>
          </div>

          <dl
            v-if="lead.metrics?.length"
            class="grid gap-5 border-t border-on-accent-2 pt-6 sm:grid-cols-3"
          >
            <div
              v-for="metric in lead.metrics"
              :key="metric.label"
            >
              <dt class="sr-only">
                {{ metric.label }}
              </dt>
              <dd>
                <span class="block text-[32px] font-semibold leading-none [font-stretch:80%]">{{ metric.value }}</span>
                <span class="mt-1.5 block text-[13px] opacity-80">{{ metric.label }}</span>
              </dd>
            </div>
          </dl>

          <!-- Media frame fills the rest of the tile; without a screenshot it carries the longer write-up. -->
          <NuxtImg
            v-if="lead.image"
            :src="lead.image"
            :alt="`${lead.title} screenshot`"
            width="1200"
            format="webp"
            loading="lazy"
            class="min-h-[220px] w-full flex-1 rounded-2xl object-cover object-top"
          />
          <div
            v-else-if="lead.description"
            class="flex min-h-[220px] flex-1 flex-col justify-end gap-4 rounded-2xl border border-on-accent-2/40 p-6 sm:p-8"
          >
            <p class="max-w-[60ch] text-[15px] leading-relaxed opacity-85">
              {{ lead.description }}
            </p>
            <p
              v-if="lead.confidential"
              class="font-mono text-[12.5px] opacity-70"
            >
              Private client work
            </p>
          </div>
        </NuxtLink>
      </Reveal>

      <!-- Two supporting projects -->
      <Reveal
        v-for="(project, index) in middle"
        :key="project.id"
        :delay="0.08 * (index + 1)"
        class="lg:col-span-4"
      >
        <NuxtLink
          :to="linkFor(project)"
          :target="isExternal(linkFor(project)) ? '_blank' : undefined"
          :rel="isExternal(linkFor(project)) ? 'noopener' : undefined"
          class="lift flex h-full flex-col gap-5 rounded-3xl p-7"
          :class="index === 0 ? 'border border-line bg-surface' : 'bg-accent-soft'"
        >
          <div class="flex items-start justify-between gap-3">
            <ul class="flex flex-wrap gap-1.5 text-xs font-semibold text-ink-2">
              <li
                v-for="tag in project.tags.slice(0, 2)"
                :key="tag"
                class="rounded-full px-3 py-1.5"
                :class="index === 0 ? 'bg-canvas' : 'bg-surface'"
              >
                {{ tag }}
              </li>
            </ul>
            <span
              aria-hidden="true"
              class="lift-arrow flex size-[42px] shrink-0 items-center justify-center rounded-full bg-ink text-canvas"
            >
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-[18px]"
              />
            </span>
          </div>

          <div v-if="project.metrics?.[0]">
            <p class="text-[clamp(44px,4vw,60px)] font-semibold leading-none tracking-[-0.02em] text-accent [font-stretch:78%]">
              {{ project.metrics[0].value }}
            </p>
            <p class="mt-1.5 text-sm text-ink-3">
              {{ project.metrics[0].label }}
            </p>
          </div>

          <div class="mt-auto">
            <h3 class="text-[22px] font-semibold tracking-[-0.01em] text-ink">
              {{ project.title }}
            </h3>
            <p class="mt-2 text-[15px] leading-relaxed text-ink-2">
              {{ project.summary }}
            </p>
          </div>
        </NuxtLink>
      </Reveal>

      <!-- Wide project -->
      <Reveal
        v-if="wide"
        class="lg:col-span-12"
      >
        <NuxtLink
          :to="linkFor(wide)"
          :target="isExternal(linkFor(wide)) ? '_blank' : undefined"
          :rel="isExternal(linkFor(wide)) ? 'noopener' : undefined"
          class="lift grid items-center gap-8 rounded-3xl bg-surface-2 p-6 sm:p-9 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
        >
          <div class="flex flex-col gap-5">
            <ul class="flex flex-wrap gap-1.5 text-xs font-semibold text-ink-2">
              <li
                v-for="tag in wide.tags.slice(0, 2)"
                :key="tag"
                class="rounded-full bg-surface px-3 py-1.5"
              >
                {{ tag }}
              </li>
            </ul>
            <div v-if="wide.metrics?.[0]">
              <p class="text-[clamp(44px,4vw,60px)] font-semibold leading-none tracking-[-0.02em] text-accent [font-stretch:78%]">
                {{ wide.metrics[0].value }}
              </p>
              <p class="mt-1.5 text-sm text-ink-3">
                {{ wide.metrics[0].label }}
              </p>
            </div>
            <div>
              <h3 class="text-[clamp(22px,2vw,28px)] font-semibold tracking-[-0.015em] text-ink">
                {{ wide.title }}
              </h3>
              <p class="mt-2 max-w-[44ch] text-[15px] leading-relaxed text-ink-2">
                {{ wide.summary }}
              </p>
            </div>
            <span class="inline-flex items-center gap-2.5 text-[15px] font-semibold text-ink">
              {{ wide.confidential ? 'Private client work' : 'View project' }}
              <span
                aria-hidden="true"
                class="lift-arrow flex size-[38px] items-center justify-center rounded-full bg-ink text-canvas"
              >
                <UIcon
                  name="i-lucide-arrow-up-right"
                  class="size-4"
                />
              </span>
            </span>
          </div>
          <NuxtImg
            v-if="wide.image"
            :src="wide.image"
            :alt="`${wide.title} screenshot`"
            width="1400"
            format="webp"
            loading="lazy"
            class="aspect-[16/10] w-full rounded-2xl border border-line bg-surface object-cover object-top lg:aspect-[2/1]"
          />
        </NuxtLink>
      </Reveal>
    </div>

    <Reveal
      v-if="page.work.link"
      class="mt-10"
    >
      <AppButton
        :to="page.work.link.to || '/projects'"
        :label="page.work.link.label"
        variant="outline"
        size="sm"
      />
    </Reveal>
  </section>
</template>
