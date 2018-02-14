import Vue from 'vue'
import { sync } from 'vuex-router-sync'

import App from './App'
import router from './router'
import store from './store'
import { setApiUrl, getTokenFromCookie, onResponse } from './rest'
import './utils/ui-setup'

sync(store, router)
setApiUrl(document.getElementById('girder-api-root').getAttribute('url'))
onResponse((resp) => {
  if (401 === resp.response.status && !store.getters['auth/isLoggedIn'] && !store.state.auth.authDialogVisible) {
    store.commit('auth/showAuthDialog', {})
    store.dispatch('toast/showToast', {
      text: 'You must log in first.',
      type: 'info' // TODO use constants for toast types
    })
  }
  return Promise.reject(resp)
})

store.commit('auth/setToken', getTokenFromCookie())
store.dispatch('auth/whoami').then(() => new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
}))
