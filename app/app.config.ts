export default defineAppConfig({
  global: {
    picture: {
      dark: 'https://media.licdn.com/dms/image/v2/D4D03AQH277wN5U3E6Q/profile-displayphoto-scale_400_400/B4DZoIDfnkG8Ag-/0/1761071732624?e=1775088000&v=beta&t=J9QjZYYVnIdtRmvPPuD1QGgOxxXh2Gtq0DIsm0puffY',
      light: 'https://media.licdn.com/dms/image/v2/D4D03AQH277wN5U3E6Q/profile-displayphoto-scale_400_400/B4DZoIDfnkG8Ag-/0/1761071732624?e=1775088000&v=beta&t=J9QjZYYVnIdtRmvPPuD1QGgOxxXh2Gtq0DIsm0puffY',
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
    credits: `Vincent Ndegwa • Full-Stack Engineer & AI Researcher © ${new Date().getFullYear()}`,
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
