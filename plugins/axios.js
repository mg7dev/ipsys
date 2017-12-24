import { setClient } from '~/services/api'
import cookie from 'cookie'

export default function ({ $axios, $toast, app, req }) {
  setClient($axios)

  $axios.onRequest((config) => {
    if (config.data) {
      if (config.data.hideToast) {
        app.store.commit('toast/DISABLE')
      }
    }
    let token = app.store.getters['auth/getAuthToken']

    if (!token && req) {
      token = cookie.parse(req.headers.cookie).access_token
    }
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }

    return config
  })

  $axios.onError((err) => {
    if (!app.store.state.toast.show) {
      app.store.commit('toast/ENABLE')
      return
    }

    const message = err.response.data
      ? err.response.data.translation ||
        err.response.data.message ||
        'Something went wrong'
      : err

    $toast.error(app.i18n.t(message))
  })
}
