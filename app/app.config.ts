export default defineAppConfig({
  global: {
    picture: {
      dark: '/personal/profile.jpeg',
      light: '/personal/profile.jpeg',
      alt: 'Vincent — Full-Stack Engineer'
    },
    meetingLink: 'https://cal.com/vincent-ndegwa',
    email: 'ndegwavincent7@gmail.com',
    available: true
  },
  ui: {
    colors: {
      primary: 'violet',
      neutral: 'zinc'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `Vincent Ndegwa • Full-Stack Engineer & AI Engineer © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/vincentNdegwa',
      'target': '_blank',
      'aria-label': 'GitHub'
    }, {
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://www.linkedin.com/in/vincentndegwa01/',
      'target': '_blank',
      'aria-label': 'LinkedIn'
    }]
  }
})
