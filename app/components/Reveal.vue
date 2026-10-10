<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { IntrinsicElementAttributes } from 'vue'
import { Motion } from 'motion-v'

// Fades content up as it enters the viewport, once. MotionConfig in app.vue
// honours prefers-reduced-motion, which drops the movement and keeps the fade.
withDefaults(defineProps<{
  as?: keyof IntrinsicElementAttributes
  delay?: number
  y?: number
  onLoad?: boolean
}>(), {
  as: 'div',
  delay: 0,
  y: 24,
  onLoad: false
})
</script>

<template>
  <Motion
    v-if="onLoad"
    :as="as"
    :initial="{ opacity: 0, y }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }"
  >
    <slot />
  </Motion>
  <Motion
    v-else
    :as="as"
    :initial="{ opacity: 0, y }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :in-view-options="{ once: true, amount: 0.15 }"
    :transition="{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }"
  >
    <slot />
  </Motion>
</template>
