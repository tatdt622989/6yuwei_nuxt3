// https://nuxt.com/docs/api/configuration/nuxt-config
const apiProxyTarget = process.env.NUXT_API_PROXY_TARGET || 'http://localhost:3001'

export default defineNuxtConfig({
  srcDir: '.',
  devtools: { enabled: false },
  build: { transpile: ['@vuepic/vue-datepicker'] },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '32x32' },
        { rel: 'apple-touch-icon', href: '/favicon_180x180.png', sizes: '180x180' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
      ]
    },
    // pageTransition: {
    //   name: 'page',
    //   mode: 'out-in' // default
    // },
    // layoutTransition: {
    //   name: 'layout',
    //   mode: 'out-in' // default
    // }
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
    },
  },

  router: {},

  // typescript: {
  //   typeCheck: true
  // },
  nitro: {
    devProxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
        prependPath: true,
      },
    },
    routeRules: {
      "/api/**": {
        proxy: {
          to: `${apiProxyTarget}/**`,
          // Hand the API's redirects to the browser. Sign-in answers with a 302 and a cookie
          // (/api/session/login, /api/session/callback); following it here would lose both
          fetchOptions: { redirect: "manual" },
        }
      }
    }
  },

  runtimeConfig: {
    apiProxyTarget,
    public: {
      gtagId: 'G-HW6MDZLN6Z',
      // The identity provider; NUXT_PUBLIC_AUTH_URL overrides it in local development
      authUrl: 'https://auth.6yuwei.com',
    }
  },
  experimental: {
    appManifest: false
  },
  compatibilityDate: '2024-09-08'
})
