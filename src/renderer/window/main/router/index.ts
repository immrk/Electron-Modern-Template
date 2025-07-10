import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/home.vue'
import System from '../components/system.vue'
import Window from '../components/window.vue'
import ApiTest from '../components/apiTest.vue'
import { MenuEnum } from '../constants'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: MenuEnum.HOME,
    component: Home
  },
  {
    path: '/system',
    name: MenuEnum.SYSTEM,
    component: System
  },
  {
    path: '/window',
    name: MenuEnum.WINDOW,
    component: Window
  },
  {
    path: '/api-test',
    name: MenuEnum.API_TEST,
    component: ApiTest
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 