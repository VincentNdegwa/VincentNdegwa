<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <section
    id="experience"
    class="wrap scroll-mt-24 pb-20 sm:pb-28 lg:pb-36"
  >
    <SectionHeading
      :title="page.experience.title"
      :highlight="page.experience.highlight"
      :description="page.experience.description"
    />

    <ol class="border-t border-line-strong pt-8">
      <Reveal
        v-for="(item, index) in page.experience.items"
        :key="`${item.position}-${item.date}`"
        as="li"
        :delay="0.05 * index"
        class="grid gap-1.5 pb-10 last:pb-0 md:grid-cols-[minmax(0,2fr)_minmax(0,4fr)_minmax(0,6fr)] md:gap-10"
      >
        <p
          class="pt-1.5 font-mono text-sm"
          :class="item.current ? 'font-medium text-accent' : 'text-ink-3'"
        >
          {{ item.date }}
        </p>
        <div>
          <h3 class="text-[22px] font-semibold tracking-[-0.01em] text-ink">
            {{ item.position }}
          </h3>
          <NuxtLink
            v-if="item.company.url"
            :to="item.company.url"
            target="_blank"
            rel="noopener"
            class="mt-1 inline-block text-[15px] text-ink-3 underline-offset-4 hover:text-accent hover:underline"
          >
            {{ item.company.name }}
          </NuxtLink>
          <p
            v-else
            class="mt-1 text-[15px] text-ink-3"
          >
            {{ item.company.name }}
          </p>
        </div>
        <p class="mt-2 text-base leading-relaxed text-ink-2 md:mt-0">
          {{ item.summary }}
        </p>
      </Reveal>
    </ol>

    <Reveal
      v-if="page.experience.cv"
      class="mt-12"
    >
      <AppButton
        :to="page.experience.cv.to || '#'"
        :label="page.experience.cv.label"
        :target="page.experience.cv.target"
        variant="outline"
        size="sm"
      />
    </Reveal>
  </section>
</template>
