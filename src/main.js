// import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import apolloClient from "./utils/graphql";
import socket from "./utils/socket";
import VueChatScroll from "vue-chat-scroll";

import "./assets/scss/main.scss";

Vue.use(VueChatScroll);
Vue.prototype.$socket = socket;
Vue.prototype.$apolloClient = apolloClient;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
