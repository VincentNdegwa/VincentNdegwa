<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  highlight?: string
  description?: string
  as?: 'h1' | 'h2'
}>(), {
  highlight: undefined,
  description: undefined,
  as: 'h2'
})
</script>

<template>
  <Reveal class="mb-10">
    <component
      :is="as"
      class="text-[clamp(40px,5vw,72px)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink [font-stretch:82%]"
    >
      {{ title }}
      <em
        v-if="highlight"
        class="inline-block pb-1 font-medium italic text-accent"
      >{{ highlight }}</em>
    </component>
    <p
      v-if="description"
      class="mt-3.5 max-w-[52ch] text-[17px] leading-relaxed text-ink-2"
    >
      {{ description }}
    </p>
    <slot />
  </Reveal>
</template>
