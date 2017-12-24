import cookie from 'cookie'

export default function ({ store, redirect, req }) {
  // If the user is not authenticated
  if (req) {
    const tokenCookie = cookie.parse(req.headers.cookie || '').access_token
    if (!store.getters['auth/getAuthToken'] && !tokenCookie) {
      return redirect('/')
    }
  }
}
