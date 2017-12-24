export default {
  server: {
    port: 8088, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - LPG Oslo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/icon.png' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Catamaran',
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~assets/scss/theme.scss', '~assets/scss/global.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/localStorage.js',
    '~/plugins/axios.js',
    '~/plugins/mixins.js',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    [
      'nuxt-i18n',
      {
        locales: [
          {
            code: 'no',
            file: 'no.json',
          },
          {
            code: 'en',
            file: 'en.json',
          },
        ],
        defaultLocale: 'no',
        lazy: true,
        langDir: 'locales/',
        strategy: 'no_prefix',
        vueI18n: {
          fallbackLocale: 'no',
          silentTranslationWarn: true,
        },
      },
    ],
    // https://go.nuxtjs.dev/bootstrap
    [
      'bootstrap-vue/nuxt',
      {
        icons: true,
      },
    ],
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    '@nuxtjs/toast',
  ],
  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false, // Or `bvCSS: false`
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},
  toast: {
    position: 'bottom-center',
    theme: 'toasted-primary',
    duration: 5000,
    register: [
      {
        name: 'my-error',
        message: 'Error',
        options: {
          type: 'error',
        },
      },
    ],
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    loaders: {
      vue: {
        prettify: false,
      },
    },
  },

  styleResources: {
    scss: ['./assets/scss/*.scss'],
  },
  publicRuntimeConfig: {
    axios: {
      browserBaseURL:
        process.env.API_BASE ||
        'https://test-api.lpgsys.no/api' ||
        'https://api.lpgsys.no/api',
    },
    API_HOST:
      process.env.API_HOST ||
      'https://test-api.lpgsys.no/api' ||
      'https://api.lpgsys.no',
  },
  privateRuntimeConfig: {
    axios: {
      baseURL:
        process.env.API_BASE ||
        'https://test-api.lpgsys.no/api' ||
        'https://api.lpgsys.no/api',
    },
  },
}
