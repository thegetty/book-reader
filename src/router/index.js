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
      path: '/book/:book/edition/:edition',
      name: 'Manifest',
      component: Main
    },
    {
      path: '/book/:book/edition/:edition/image/:image',
      name: 'ImageLink',
      component: Main
    }
  ]
})
