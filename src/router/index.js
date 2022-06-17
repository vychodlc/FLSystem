import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/home',
    component: () => import('../views/home/index.vue'),
    children: [
      {
        path: '/',
        redirect: '/home/index'
      },
      {
        path: '/home/index',
        component: () => import('../views/index/index.vue'),
      },
      {
        path: '/home/equipment',
        component: () => import('../views/equipment/index.vue'),
      },
      {
        path: '/home/active_test',
        component: () => import('../views/active_test/index.vue'),
        children: [
          { path: '/', redirect: 'commit' },
          { path: 'commit', name: 'Commit', component: () => import('../views/active_test/commit.vue') },
          { path: 'result', name: 'Result', component: () => import('../views/active_test/result.vue') },
          { path: 'form', name: 'Form', component: () => import('../views/active_test/form.vue') },
        ]
      },
      {
        path: '/home/passive_test',
        component: () => import('../views/passive_test/index.vue'),
        children: [
          { path: '/', redirect: 'traffic' },
          { path: 'traffic', name: 'Traffic', component: () => import('../views/passive_test/traffic.vue') },
          { path: 'monitor', name: 'Monitor', component: () => import('../views/passive_test/monitor.vue') },
          { path: 'pressure', name: 'Pressure', component: () => import('../views/passive_test/pressure.vue') },
        ]
      },
      {
        path: '/home/security',
        component: () => import('../views/security/index.vue'),
        children: [
          { path: '/', redirect: 'equipments' },
          { path: 'equipments', name: 'equipments', component: () => import('../views/security/equipments.vue') },
          { path: 'warning', name: 'warning', component: () => import('../views/security/warning.vue') },
        ]
      },
      {
        path: '/home/system',
        component: () => import('../views/system/index.vue'),
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
