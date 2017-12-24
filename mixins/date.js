import moment from 'moment'

export default {
  methods: {
    formatDate(timestamp) {
      return moment(timestamp).format('DD.MM.YYYY')
    },
    formatDateTime(timestamp) {
      return moment(timestamp).format('HH.mm, DD.MM.YYYY')
    },
  },
}
