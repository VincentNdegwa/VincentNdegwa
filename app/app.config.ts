export default defineAppConfig({
  global: {
    name: 'Vincent Ndegwa',
    role: 'Software and AI Engineer',
    picture: {
      dark: '/personal/profile.jpeg',
      light: '/personal/profile.jpeg',
      alt: 'Portrait of Vincent Ndegwa'
    },
    meetingLink: 'https://cal.com/vincent-ndegwa',
    email: 'ndegwavincent7@gmail.com',
    available: true
  },
  ui: {
    colors: {
      primary: 'pine',
      neutral: 'sage'
    },
    button: {
      slots: {
        base: 'rounded-full font-semibold'
      }
    }
  },
  footer: {
    links: [{
      'label': 'GitHub',
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/VincentNdegwa',
      'target': '_blank',
      'aria-label': 'GitHub'
    }, {
      'label': 'LinkedIn',
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://www.linkedin.com/in/vincentndegwa01/',
      'target': '_blank',
      'aria-label': 'LinkedIn'
    }, {
      'label': 'X',
      'icon': 'i-simple-icons-x',
      'to': 'https://x.com/SWE_Vincent',
      'target': '_blank',
      'aria-label': 'X'
    }, {
      'label': 'Notes',
      'icon': 'i-lucide-notebook-pen',
      'to': '/blog',
      'aria-label': 'Notes'
    }]
  }
})
