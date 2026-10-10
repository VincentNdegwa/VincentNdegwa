<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()

const { global } = useAppConfig()
</script>

<template>
  <section
    id="contact"
    class="wrap scroll-mt-24 pb-12"
  >
    <Reveal>
      <div class="flex flex-wrap items-end justify-between gap-10 rounded-3xl bg-accent px-6 py-12 text-on-accent sm:px-12 sm:py-16 lg:px-18 lg:py-22">
        <div class="flex-[1_1_520px]">
          <h2 class="max-w-[14ch] text-[clamp(40px,5.4vw,80px)] font-semibold leading-[1.05] tracking-[-0.03em] [font-stretch:82%]">
            {{ title }}
          </h2>
          <p
            v-if="description"
            class="mt-4 max-w-[48ch] text-lg leading-relaxed opacity-85"
          >
            {{ description }}
          </p>
        </div>
        <div class="flex flex-col items-start gap-3.5">
          <AppButton
            :to="global.meetingLink"
            label="Book a call"
            variant="inverse"
            size="lg"
          />
          <NuxtLink
            :to="`mailto:${global.email}`"
            external
            class="border-b border-on-accent-2 py-2 text-base font-medium"
          >
            {{ global.email }}
          </NuxtLink>
        </div>
      </div>
    </Reveal>
  </section>
</template>
