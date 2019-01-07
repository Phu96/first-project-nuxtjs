const pkg = require('./package')
const path = require('path')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
 css: [
  '@/assets/element-ui/lib/theme-chalk/index.css',
  '@/assets/@fortawesome/fontawesome-svg-core/styles.css'
],


  /*
  ** Plugins to load before mounting the App
  */
  plugins:['~/plugins/element-ui', '~/plugins/fontawesome' ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/axios-module#usage
  ],
  
  /*
	map proxy to handling request
  */
 proxy: {
  '/api/file/getDirTree': { target: 'http://localhost:3001', ws: false }
},
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: 'http://localhost:3001',
    proxy: false,
    credentials: false
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
		  options: {
			  fix: true
		  }
        })
      }
    }
  }
}
