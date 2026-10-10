<script setup lang="ts">
const props = withDefaults(defineProps<{
  to: string
  label?: string
  variant?: 'solid' | 'outline' | 'inverse' | 'subtle' | 'soft' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  target?: '_blank' | '_self'
}>(), {
  label: undefined,
  variant: 'solid',
  size: 'md',
  target: undefined
})

const isExternal = computed(() => /^(https?:|mailto:|tel:)/.test(props.to))
const resolvedTarget = computed(() => props.target ?? (props.to.startsWith('http') ? '_blank' : undefined))

const variantClass = computed(() => {
  switch (props.variant) {
    case 'outline':
    case 'ghost':
    case 'link':
      return 'border-[1.5px] border-ink text-ink hover:bg-ink hover:text-canvas'
    case 'inverse':
      return 'bg-on-accent text-accent hover:bg-canvas'
    case 'subtle':
    case 'soft':
      return 'bg-surface-2 text-ink hover:bg-line'
    default:
      return 'bg-accent text-on-accent hover:opacity-90'
  }
})

const sizeClass = computed(() => ({
  sm: 'h-[42px] px-5 text-[15px]',
  md: 'h-12 px-6 text-base',
  lg: 'h-[50px] px-[26px] text-[17px]'
}[props.size]))
</script>

<template>
  <NuxtLink
    :to="to"
    :external="isExternal"
    :target="resolvedTarget"
    :rel="resolvedTarget === '_blank' ? 'noopener' : undefined"
    class="inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[transform,background-color,color,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    :class="[variantClass, sizeClass]"
  >
    <slot>{{ label }}</slot>
  </NuxtLink>
</template>
