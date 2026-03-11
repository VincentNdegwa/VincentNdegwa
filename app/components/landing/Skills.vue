<script setup lang="ts">
const categories = [
  {
    title: 'Backend & Logic',
    icon: 'i-lucide-server',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    groups: [
      {
        label: 'Expert',
        hint: '4+ yrs · architect systems from scratch',
        skills: ['Laravel', 'PHP', 'Django', 'Python', 'REST API Design', 'MySQL']
      },
      {
        label: 'Proficient',
        hint: 'daily production use',
        skills: ['Redis', 'PostgreSQL', 'MongoDB', 'Laravel Reverb', 'WebSockets', 'Laravel Queues']
      },
      {
        label: 'Advanced',
        hint: 'production architecture patterns',
        skills: ['Service Pattern', 'Multi-tenancy', 'RBAC', 'Docker', 'Nginx']
      }
    ]
  },
  {
    title: 'Frontend & UI',
    icon: 'i-lucide-layout',
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
    groups: [
      {
        label: 'Expert',
        hint: '4+ yrs · SSR, SPA, component systems',
        skills: ['Vue.js 3', 'Nuxt 3', 'TypeScript', 'Tailwind CSS']
      },
      {
        label: 'Proficient',
        hint: 'ship regularly',
        skills: ['Inertia.js', 'Livewire', 'React', 'Pinia', 'VueUse']
      }
    ]
  },
  {
    title: 'AI & Data Science',
    icon: 'i-lucide-brain',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    groups: [
      {
        label: 'Proficient',
        hint: 'deployed in production',
        skills: ['OpenAI API', 'NLP / Sentiment Analysis', 'Collaborative Filtering', 'Scikit-Learn']
      },
      {
        label: 'Exploring (MSc)',
        hint: 'active research & MSc projects',
        skills: ['LangChain', 'RAG', 'LLaMA / Ollama', 'Pandas', 'NumPy', 'PyTorch']
      }
    ]
  },
  {
    title: 'DevOps & Reliability',
    icon: 'i-lucide-shield-check',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    groups: [
      {
        label: 'Proficient',
        hint: 'every project I ship',
        skills: ['GitHub Actions', 'Docker', 'DigitalOcean', 'Google Cloud', 'CI/CD Pipelines']
      },
      {
        label: 'Working knowledge',
        hint: 'used in production monitoring',
        skills: ['Nightwatch', 'Laravel Pulse', 'Sentry', 'PHPUnit', 'Pest']
      }
    ]
  }
]

const labelColor: Record<string, string> = {
  'Expert': 'text-violet-500',
  'Proficient': 'text-sky-500',
  'Advanced': 'text-emerald-500',
  'Exploring (MSc)': 'text-orange-400',
  'Working knowledge': 'text-muted'
}
</script>

<template>
  <UPageSection
    title="Technical Stack"
    description="Tools and technologies I use — grouped by category and proficiency."
    :ui="{
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm text-muted',
      container: 'gap-8'
    }"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Motion
        v-for="(cat, ci) in categories"
        :key="cat.title"
        :initial="{ opacity: 0, transform: 'translateY(16px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.15 * ci }"
        :in-view-options="{ once: true }"
        class="rounded-xl border border-default p-5 flex flex-col gap-4"
        :class="cat.bg"
      >
        <div class="flex items-center gap-2">
          <UIcon :name="cat.icon" class="size-5" :class="cat.color" />
          <span class="font-semibold text-sm" :class="cat.color">{{ cat.title }}</span>
        </div>

        <div
          v-for="group in cat.groups"
          :key="group.label"
          class="flex flex-col gap-2"
        >
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium uppercase tracking-wide" :class="labelColor[group.label] || 'text-muted'">
              {{ group.label }}
            </span>
            <span class="text-xs text-muted">· {{ group.hint }}</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="skill in group.skills"
              :key="skill"
              :label="skill"
              color="neutral"
              variant="outline"
              size="sm"
              class="font-mono text-xs"
            />
          </div>
        </div>
      </Motion>
    </div>
  </UPageSection>
</template>
