import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import routerConf from './config/routerConf'
// if (process.env.NODE_ENV != 'production') {
//   require('../test');
// }
Vue.use(VueRouter);
Vue.use(Element);

Vue.config.debug = true;

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: routerConf
})

router.beforeEach((to, from, next) => {
  document.title = '社会工作和志愿服务政策规划落实情况填报系统';
  next() // 确保一定要调用 next()
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
