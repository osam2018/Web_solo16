import Vue from 'vue'
import Router from 'vue-router'
import Main from './view/main.vue'
import Login from './view/login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },{
        path: '/login',
          name: 'login',
          component: Login
    }
    ]
})
