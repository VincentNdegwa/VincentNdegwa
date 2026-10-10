<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()

const { global } = useAppConfig()
</script>

<template>
  <section
    id="top"
    class="wrap pt-8 pb-16 sm:pt-12 lg:pt-16 lg:pb-24"
  >
    <div class="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
      <div class="flex flex-col items-start gap-7">
        <Reveal on-load>
          <span class="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-2 pr-4 pl-3 text-sm font-medium text-ink-2">
            <span
              aria-hidden="true"
              class="size-2 rounded-full"
              :class="global.available ? 'bg-[#2F9E44]' : 'bg-ink-3'"
            />
            {{ global.available ? page.hero.status : (page.hero.unavailableStatus || page.hero.status) }}
          </span>
        </Reveal>

        <Reveal
          as="h1"
          on-load
          :delay="0.08"
          class="max-w-[13ch] text-[clamp(44px,5.6vw,82px)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink [font-stretch:82%]"
        >
          {{ page.hero.headline }}
          <em
            v-if="page.hero.highlight"
            class="inline-block pb-1 font-medium italic text-accent"
          >{{ page.hero.highlight }}</em>
        </Reveal>

        <Reveal
          as="p"
          on-load
          :delay="0.16"
          class="max-w-[46ch] text-[clamp(17px,1.4vw,20px)] leading-relaxed text-ink-2"
        >
          {{ page.hero.intro }}
        </Reveal>

        <Reveal
          on-load
          :delay="0.24"
          class="flex flex-wrap gap-3"
        >
          <AppButton
            v-for="link in page.hero.links"
            :key="link.label"
            :to="link.to || '/'"
            :label="link.label"
            :variant="link.variant"
            :target="link.target"
            size="lg"
          />
        </Reveal>
      </div>

      <Reveal
        as="figure"
        on-load
        :delay="0.16"
        class="w-full max-w-[476px] justify-self-center lg:justify-self-end"
      >
        <NuxtImg
          :src="page.hero.image.src"
          :alt="page.hero.image.alt"
          width="920"
          height="1150"
          fit="cover"
          preload
          class="aspect-[4/5] w-full rounded-3xl border border-line bg-surface-2 object-cover object-[50%_30%]"
        />
      </Reveal>
    </div>
  </section>
</template>
