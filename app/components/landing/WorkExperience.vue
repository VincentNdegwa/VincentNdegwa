<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :title="page.experience.title"
    :ui="{
      container: '!p-0 gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium'
    }"
  >
    <div class="flex flex-col gap-5 mt-2">
      <Motion
        v-for="(experience, index) in page.experience.items"
        :key="index"
        :initial="{ opacity: 0, transform: 'translateY(20px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.15 + 0.15 * index }"
        :in-view-options="{ once: true }"
        class="rounded-xl border border-default p-4 flex flex-col gap-2"
      >
        <div class="flex items-start justify-between gap-2 flex-wrap">
          <div class="flex flex-col gap-0.5">
            <ULink
              :to="experience.company.url !== '#' ? experience.company.url : undefined"
              :target="experience.company.url !== '#' ? '_blank' : undefined"
              class="flex items-center gap-1.5"
            >
              <UIcon
                :name="experience.company.logo"
                class="size-4 shrink-0"
                :style="{ color: experience.company.color }"
              />
              <span class="font-semibold text-sm" :style="{ color: experience.company.color }">
                {{ experience.company.name }}
              </span>
            </ULink>
            <p class="text-sm font-medium text-highlighted">
              {{ experience.position }}
            </p>
          </div>
          <div class="flex flex-col items-end gap-0.5 shrink-0">
            <span class="text-xs text-muted font-mono">{{ experience.date }}</span>
            <span v-if="experience.location" class="text-xs text-muted flex items-center gap-1">
              <UIcon name="i-lucide-map-pin" class="size-3" />
              {{ experience.location }}
            </span>
          </div>
        </div>
        <ul v-if="experience.highlights?.length" class="flex flex-col gap-1 mt-1">
          <li
            v-for="(point, pi) in experience.highlights"
            :key="pi"
            class="text-xs text-muted flex items-start gap-2"
          >
            <UIcon name="i-lucide-chevron-right" class="size-3 mt-0.5 shrink-0 text-primary" />
            {{ point }}
          </li>
        </ul>
      </Motion>
    </div>
  </UPageSection>
</template>

<style scoped>
</style>
