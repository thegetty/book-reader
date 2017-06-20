import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/books/:book/editions/:edition',
      name: 'Manifest',
      component: Main
    },
    {
      path: '/books/:book/editions/:edition/pages/:page',
      name: 'PageLink',
      component: Main
    },
    {
      path: '/books/:book/editions/:edition/images/:image',
      name: 'ImageLink',
      component: Main
    }
  ]
})
