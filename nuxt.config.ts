// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/device", "nuxt-auth-sanctum"],
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/variables.scss" as *;',
        },
      },
    },
  },
  sanctum: {
    baseUrl: process.env.NUXT_BASE_URL, // Laravel API
},
  app: {
    head: {
      titleTemplate: '%s - Firefighter Connect',
      title: 'Firefighter Connect',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Firefighter social intranet platform' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
    },
  },
  runtimeConfig: {
    public: {
      baseUrl: 'http://localhost:8000', 
      apiUrl: 'http://localhost:8000/api', 
    }
  }
})