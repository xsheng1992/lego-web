import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// () => import(/* webpackChunkName: "some-page" */ '../path/to/page/Page.vue')

const routes: Array<RouteRecordRaw> = []

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
