<script setup lang="ts">
const { footer, global } = useAppConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="wrap overflow-hidden">
    <div class="flex flex-wrap items-center justify-between gap-4 py-5 text-[15px] text-ink-2">
      <nav
        aria-label="Elsewhere"
        class="flex flex-wrap items-center gap-x-6 gap-y-1"
      >
        <NuxtLink
          v-for="link in footer.links"
          :key="link.to"
          :to="link.to"
          :target="link.target"
          :rel="link.target === '_blank' ? 'noopener' : undefined"
          class="py-2 transition-colors hover:text-accent"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
      <span class="text-ink-3">© {{ year }} {{ global.name }}</span>
    </div>
    <div
      aria-hidden="true"
      class="select-none whitespace-nowrap text-[15.4vw] font-bold leading-[0.78] tracking-[-0.045em] text-line [font-stretch:75%] -mb-[0.08em]"
    >
      {{ global.name }}
    </div>
  </footer>
</template>
