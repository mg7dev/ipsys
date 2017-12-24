export default {
  methods: {
    errMess(err) {
      return err.response
        ? err.response.data.translation ||
            err.response.data.message ||
            'errors.default'
        : err
    },
  },
}
