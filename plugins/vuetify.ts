// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import { VCalendar } from 'vuetify/labs/VCalendar'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      ...components,
      VCalendar,
    },
    ssr: true,
    directives,
    theme: {
      themes: {
        light: {
          colors: {
            primary: '#D32F2F',
            secondary: '#FF5722',
            accent: '#FFC107',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})