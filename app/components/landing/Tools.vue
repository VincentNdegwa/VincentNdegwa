<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <section
    class="marquee flex flex-col gap-3 overflow-hidden border-y border-line bg-surface py-7"
    :aria-label="page.tools.title"
  >
    <h2 class="sr-only">
      {{ page.tools.title }}
    </h2>
    <div
      v-for="(row, rowIndex) in page.tools.rows"
      :key="rowIndex"
      class="marquee-track"
      :class="{ 'marquee-track--reverse': rowIndex % 2 === 1 }"
    >
      <!-- Each row renders twice so the loop is seamless; the copy is hidden from assistive tech. -->
      <template
        v-for="copy in 2"
        :key="copy"
      >
        <span
          v-for="tool in row"
          :key="`${copy}-${tool.name}`"
          :aria-hidden="copy === 2 ? 'true' : undefined"
          class="inline-flex h-[50px] shrink-0 items-center gap-3 whitespace-nowrap rounded-full bg-canvas pr-5 pl-1.5 text-base font-semibold text-ink"
        >
          <!-- Every chip carries a mark; tools without a brand icon fall back to their initial. -->
          <span class="flex size-9 items-center justify-center rounded-full bg-surface text-sm text-ink-2">
            <UIcon
              v-if="tool.icon"
              :name="tool.icon"
              class="size-[18px]"
            />
            <template v-else>{{ tool.name.charAt(0) }}</template>
          </span>
          {{ tool.name }}
        </span>
      </template>
    </div>
  </section>
</template>
