import prependHttp from 'prepend-http'

export default {
  methods: {
    apiURL(uri = '') {
      return this.$config.API_HOST + uri
    },
    companyLogo(path) {
      return this.apiURL('/storage/c-assets/branding/' + path)
    },
    signatureSource(path) {
      return this.apiURL('/storage/c-assets/signatures/' + path)
    },
    productPreview(path) {
      return this.apiURL('/storage/c-assets/product-previews/' + path)
    },
    fixURL(url) {
      return url ? prependHttp(url) : ''
    },
  },
}
