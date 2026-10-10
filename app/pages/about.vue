<script setup lang="ts">
const { data: page } = await useAsyncData('about', () => {
  return queryCollection('about').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { global } = useAppConfig()

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})
</script>

<template>
  <div v-if="page">
    <section class="wrap pt-10 pb-14 sm:pt-16 sm:pb-20">
      <div class="grid items-center gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16">
        <Reveal
          on-load
          class="flex flex-col gap-6"
        >
          <h1 class="text-[clamp(44px,6vw,88px)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink [font-stretch:82%]">
            {{ page.title }}
          </h1>
          <p class="max-w-[46ch] text-[clamp(18px,1.6vw,22px)] leading-relaxed text-ink-2">
            {{ page.description }}
          </p>
        </Reveal>
        <Reveal
          as="figure"
          on-load
          :delay="0.12"
          class="w-full max-w-[380px] justify-self-center lg:justify-self-end"
        >
          <NuxtImg
            :src="global.picture.light"
            :alt="global.picture.alt"
            width="760"
            height="950"
            fit="cover"
            class="aspect-[4/5] w-full rounded-3xl bg-surface-2 object-cover object-[50%_30%]"
          />
        </Reveal>
      </div>
    </section>

    <section class="wrap pb-20 sm:pb-28">
      <Reveal class="prose-vn mx-auto max-w-[68ch] border-t border-line-strong pt-10">
        <MDC
          :value="page.content"
          unwrap="p"
        />
      </Reveal>
    </section>

    <LandingContact
      title="Let's build something that scales."
      description="Open to senior engineering roles, contracts and AI product work."
    />
  </div>
</template>
