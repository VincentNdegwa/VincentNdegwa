<template>
  <div class="min-h-dvh bg-canvas text-ink">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
    >
      Skip to content
    </a>
    <AppHeader />
    <main
      id="main"
      class="overflow-x-clip"
    >
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
