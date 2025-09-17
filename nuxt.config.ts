export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/gadgetguyug-logo.png' }
      ]
    }
  },

  nitro: {
    preset: 'heroku'
  }
})