// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '32x32' },
        { rel: 'apple-touch-icon', href: '/favicon_180x180.png', sizes: '180x180' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
      ]
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in' // default
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in' // default
    }
  },
  modules: [
    '@pinia/nuxt',
  ],
  css: ['bootstrap-icons/font/bootstrap-icons.css', 'aos/dist/aos.css'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/main.scss" as *;'
        }
      }
    }
  },
  router: {},
  // typescript: {
  //   typeCheck: true
  // },
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        prependPath: true,
      },
    },
    // routeRules: {
    //   "/api/**": {
    //     proxy: 'http://localhost:3001/**'
    //   }
    // }
  },
  runtimeConfig: {
    public: {
      gtagId: 'G-HW6MDZLN6Z',
    }
  }
})
