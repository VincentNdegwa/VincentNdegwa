<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()

const stats = [
  { value: '4+', label: 'Years building production systems' },
  { value: '6+', label: 'Shipped projects — SaaS, ERP & AI' },
  { value: 'MSc', label: 'Artificial Intelligence (in progress)' }
]
</script>

<template>
  <UPageSection
    :title="page.about.title"
    :description="page.about.description"
    :ui="{
      container: '!p-0',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-3 text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <div class="flex flex-col gap-2 mt-3">
      <div
        v-for="s in stats"
        :key="s.value"
        class="flex items-baseline gap-2"
      >
        <span class="font-mono text-sm font-bold text-primary shrink-0">{{ s.value }}</span>
        <span class="text-xs text-muted">{{ s.label }}</span>
      </div>
    </div>
  </UPageSection>
</template>

<style scoped>

</style>
