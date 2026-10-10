<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
}>()

const colorMode = useColorMode()

// Live contribution chart rendered by ghchart, tinted to the page accent for each mode.
const graphSrc = computed(() => {
  const hex = colorMode.value === 'dark' ? '62C6B2' : '0E4A43'
  return `https://ghchart.rshah.org/${hex}/${props.page.lab.github.username}`
})

// With an odd number of repos the last tile stretches so the grid has no empty cell.
const repoSpan = (index: number) => {
  const count = props.page.lab.repos.length
  return count % 2 === 1 && index === count - 1 ? 'lg:col-span-8' : 'lg:col-span-4'
}
</script>

<template>
  <section
    id="lab"
    class="wrap scroll-mt-24 pb-20 sm:pb-28 lg:pb-36"
  >
    <SectionHeading
      :title="page.lab.title"
      :highlight="page.lab.highlight"
      :description="page.lab.description"
    />

    <div class="grid gap-5 lg:grid-cols-12">
      <Reveal class="lg:col-span-4 lg:row-span-2">
        <div class="flex h-full flex-col gap-6 rounded-3xl bg-accent p-6 text-on-accent sm:p-8">
          <h3 class="text-[22px] font-semibold">
            {{ page.lab.now.title }}
          </h3>
          <ul class="flex flex-col gap-4 text-base leading-normal">
            <li
              v-for="(item, index) in page.lab.now.items"
              :key="item"
              :class="index > 0 ? 'border-t border-on-accent-2 pt-4' : ''"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </Reveal>

      <Reveal
        v-for="(repo, index) in page.lab.repos"
        :key="repo.name"
        :delay="0.06 * (index + 1)"
        :class="repoSpan(index)"
      >
        <NuxtLink
          :to="repo.url"
          target="_blank"
          rel="noopener"
          class="lift flex h-full min-h-[220px] flex-col gap-3.5 rounded-3xl p-6 sm:p-7"
          :class="index % 3 === 1 ? 'bg-surface-2' : 'border border-line bg-surface'"
        >
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-[26px] font-semibold tracking-[-0.015em] text-ink [font-stretch:82%]">
              {{ repo.name }}
            </h3>
            <UIcon
              name="i-lucide-arrow-up-right"
              class="lift-arrow size-5 text-ink-3"
              aria-hidden="true"
            />
          </div>
          <p class="flex-1 text-[15px] leading-relaxed text-ink-2">
            {{ repo.description }}
          </p>
          <p class="font-mono text-[12.5px] text-ink-3">
            {{ repo.stack }}
          </p>
        </NuxtLink>
      </Reveal>

      <Reveal class="lg:col-span-12">
        <div class="flex flex-wrap items-center gap-x-8 gap-y-5 rounded-3xl border border-line bg-surface px-5 py-6 sm:px-8">
          <NuxtLink
            :to="page.lab.github.url"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 py-2 text-[17px] font-semibold text-ink transition-colors hover:text-accent"
          >
            <UIcon
              name="i-simple-icons-github"
              class="size-5"
            />
            {{ page.lab.github.label }}
          </NuxtLink>
          <div class="min-w-0 flex-[1_1_420px] overflow-x-auto">
            <ClientOnly>
              <img
                :src="graphSrc"
                :alt="`GitHub contribution graph for ${page.lab.github.username}`"
                width="663"
                height="104"
                loading="lazy"
                class="h-auto w-full min-w-[560px]"
              >
              <template #fallback>
                <div class="h-[88px] w-full min-w-[560px] rounded-xl bg-surface-2" />
              </template>
            </ClientOnly>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
</template>
