import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/books/711/editions/884',
      name: 'Main',
    },
    {
      path: '/books/:book/editions/:edition',
      name: 'Manifest',
      component: Main,
      props: true
    },
    {
      path: '/books/:book/editions/:edition/pages/:page',
      name: 'PageLink',
      component: Main,
      props: true
    },
    {
      path: '/books/:book/editions/:edition/images/:image',
      name: 'ImageLink',
      component: Main,
      props: true
    },
    {
      path: '/books/:book/editions/:edition/artworks/:tab',
      name: 'ArtworkLink',
      component: Main,
      props: true
    }
  ]
})
