import Vue from 'vue'
import App from './App.vue'
import store from './store'
import createNotice from "./utils/create.js";

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue();

Vue.use(createNotice);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
