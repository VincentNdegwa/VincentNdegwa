<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const { footer, global } = useAppConfig()

defineProps<{
  page: IndexCollectionItem
}>()

const stats = [
  { value: '4+', label: 'Years Exp.' },
  { value: '6+', label: 'Projects' },
  { value: '2', label: 'Domains' },
  { value: 'MSc', label: 'AI Eng.' }
]
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Dot grid background -->
    <div class="dot-grid absolute inset-0 pointer-events-none" />

    <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 py-20 sm:py-24 lg:py-28">
      <!-- Left column: text -->
      <div class="flex flex-col gap-5 max-w-xl w-full">
        <!-- Availability badge -->
        <Motion
          :initial="{ opacity: 0, x: -16 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.45, delay: 0.1 }"
        >
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-default bg-muted/50 w-fit">
            <span class="relative flex size-2">
              <span
                class="absolute inline-flex size-full rounded-full opacity-75"
                :class="global.available ? 'bg-success animate-ping' : 'bg-error'"
              />
              <span
                class="relative inline-flex size-2 rounded-full scale-90"
                :class="global.available ? 'bg-success' : 'bg-error'"
              />
            </span>
            <span class="text-xs font-mono text-muted">
              {{ global.available ? 'Open to roles &amp; contracts' : 'Not available right now' }}
            </span>
          </div>
        </Motion>

        <!-- Name and role -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.2 }"
        >
          <div>
            <p class="text-xs font-mono tracking-widest uppercase text-primary/70 mb-2">
              — hello, I'm
            </p>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              <span class="text-highlighted">Vincent</span>
              <br>
              <span class="bg-linear-to-r from-violet-500 to-indigo-400 dark:from-violet-400 dark:to-indigo-300 bg-clip-text text-transparent">
                Ndegwa
              </span>
            </h1>
            <p class="text-base sm:text-lg font-medium text-muted mt-2">
              Full-Stack Engineer &amp; AI Engineer
            </p>
          </div>
        </Motion>

        <!-- Description -->
        <Motion
          :initial="{ opacity: 0, y: 14 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.32 }"
        >
          <p class="text-sm sm:text-base text-muted leading-relaxed">
            {{ page.description }}
          </p>
        </Motion>

        <!-- CTA buttons -->
        <Motion
          :initial="{ opacity: 0, y: 14 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.44 }"
        >
          <div class="flex items-center gap-3 flex-wrap">
            <UButton
              label="View My Projects"
              to="/projects"
              color="primary"
              icon="i-lucide-folder-open"
              size="md"
            />
            <UButton
              label="Schedule a Call"
              :to="global.meetingLink"
              target="_blank"
              color="neutral"
              variant="outline"
              icon="i-lucide-calendar"
              size="md"
            />
          </div>
        </Motion>

        <!-- Social icon links -->
        <Motion
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ duration: 0.5, delay: 0.56 }"
        >
          <div class="flex items-center gap-1 -ml-2">
            <UButton
              v-for="link in footer?.links"
              :key="link.to"
              v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }"
            />
          </div>
        </Motion>
      </div>

      <!-- Right column: photo card + stats -->
      <Motion
        :initial="{ opacity: 0, scale: 0.94 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.6, delay: 0.28 }"
        class="hidden lg:flex flex-col items-center gap-4 shrink-0"
      >
        <!-- Profile photo -->
        <div class="relative">
          <div class="absolute -inset-4 rounded-3xl bg-linear-to-br from-violet-500/25 via-indigo-500/10 to-transparent blur-2xl -z-10" />
          <div class="relative rounded-2xl overflow-hidden ring-1 ring-default size-56 bg-muted">
            <img
              :src="global.picture?.dark"
              :alt="global.picture?.alt"
              class="hidden dark:block w-full h-full object-cover"
            >
            <img
              :src="global.picture?.light"
              :alt="global.picture?.alt"
              class="block dark:hidden w-full h-full object-cover"
            >
          </div>
        </div>

        <!-- Stats 2×2 grid -->
        <div class="grid grid-cols-2 gap-2 mt-4 w-56">
          <div
            v-for="s in stats"
            :key="s.label"
            class="flex flex-col items-center justify-center gap-0.5 rounded-xl border border-default bg-muted/40 py-4"
          >
            <span class="font-mono text-xl font-bold text-primary leading-none">{{ s.value }}</span>
            <span class="text-[10px] text-muted text-center leading-tight mt-0.5">{{ s.label }}</span>
          </div>
        </div>
      </Motion>
    </div>
  </section>
</template>
