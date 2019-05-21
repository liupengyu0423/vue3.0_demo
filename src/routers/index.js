module.exports = [
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('@/views/help.vue')
  }
]
