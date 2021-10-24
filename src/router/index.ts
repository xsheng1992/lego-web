import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Index from '../views/Index.vue'
import Home from '../views/Home.vue'
// () => import(/* webpackChunkName: "some-page" */ '../path/to/page/Page.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: Index,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: 'template/:id',
        name: 'template',
        component: import(/* webpackChunkName: "template" */ '../views/TemplateDetail.vue')
      }
    ]
  },
  {
    path: '/editor',
    name: 'editor',
    component: import(/* webpackChunkName: "editor" */ '../views/Editor.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
