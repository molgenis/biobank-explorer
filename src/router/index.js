import Vue from 'vue'
import Router from 'vue-router'
import BiobankExplorerContainer from 'components/BiobankExplorerContainer'
import BiobankReport from 'components/BiobankReport'
import { INITIAL_STATE } from '../store/state'

Vue.use(Router)
export default new Router({
  mode: 'history',
  base: INITIAL_STATE.baseUrl,
  routes: [
    {
      name: 'biobanks',
      path: '/biobanks',
      component: BiobankExplorerContainer
    },
    {
      name: 'biobank',
      path: '/biobanks/:id',
      component: BiobankReport
    },
    // catch all redirect
    { path: '/', redirect: '/biobanks' }
  ]
})
