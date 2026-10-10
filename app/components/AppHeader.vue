<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const props = defineProps<{
  links?: NavigationMenuItem[]
}>()

const { global } = useAppConfig()
const items = computed(() => props.links ?? navLinks)
const menuItems = computed(() => items.value.map(link => ({
  label: String(link.label),
  icon: link.icon,
  to: link.to
})))
</script>

<template>
  <header class="sticky top-0 z-40 bg-canvas/85 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/75">
    <div class="wrap flex h-[72px] items-center justify-between gap-4">
      <NuxtLink
        to="/"
        class="text-[19px] font-semibold tracking-[-0.01em] text-ink [font-stretch:85%]"
      >
        {{ global.name }}
      </NuxtLink>

      <nav
        aria-label="Primary"
        class="hidden md:flex items-center gap-1 text-[15px] font-medium text-ink-2"
      >
        <NuxtLink
          v-for="link in items"
          :key="String(link.to)"
          :to="link.to"
          class="rounded-full px-3.5 py-3 transition-colors hover:text-accent"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-1.5 sm:gap-2">
        <ColorModeButton />
        <UDropdownMenu
          :items="menuItems"
          :content="{ align: 'end' }"
          class="md:hidden"
        >
          <UButton
            icon="i-lucide-menu"
            color="neutral"
            variant="ghost"
            size="lg"
            aria-label="Open menu"
            class="md:hidden"
          />
        </UDropdownMenu>
        <AppButton
          :to="global.meetingLink"
          label="Book a call"
          size="sm"
          class="hidden sm:inline-flex"
        />
      </div>
    </div>
  </header>
</template>
