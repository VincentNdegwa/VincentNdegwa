<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <section class="wrap py-20 sm:py-28 lg:py-36">
    <div class="grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
      <Reveal>
        <h2 class="max-w-[18ch] text-[clamp(34px,3.8vw,56px)] font-semibold leading-[1.12] tracking-[-0.025em] text-ink [font-stretch:85%]">
          {{ page.about.title }}
          <em
            v-if="page.about.highlight"
            class="font-medium italic text-accent"
          >{{ page.about.highlight }}</em>
        </h2>

        <dl class="mt-14 grid grid-cols-2 gap-6 border-t border-line-strong pt-7 sm:grid-cols-4">
          <div
            v-for="stat in page.about.stats"
            :key="stat.label"
          >
            <dt class="sr-only">
              {{ stat.label }}
            </dt>
            <dd>
              <span class="block text-[clamp(36px,3.4vw,48px)] font-semibold leading-none tracking-[-0.02em] text-ink [font-stretch:80%]">{{ stat.value }}</span>
              <span class="mt-2 block text-sm leading-snug text-ink-3">{{ stat.label }}</span>
            </dd>
          </div>
        </dl>
      </Reveal>

      <Reveal
        :delay="0.1"
        class="flex flex-col gap-7 rounded-3xl border border-line bg-surface p-6 sm:p-9"
      >
        <h3 class="text-xl font-semibold text-ink">
          {{ page.about.process.title }}
        </h3>
        <ol class="flex flex-col gap-5">
          <li
            v-for="(step, index) in page.about.process.steps"
            :key="step.title"
            :class="index > 0 ? 'border-t border-line pt-5' : ''"
          >
            <p class="text-lg font-semibold text-ink">
              {{ step.title }}
            </p>
            <p class="mt-1.5 text-[15px] leading-relaxed text-ink-2">
              {{ step.description }}
            </p>
          </li>
        </ol>
      </Reveal>
    </div>
  </section>
</template>
