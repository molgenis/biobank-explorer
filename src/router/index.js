import Vue from 'vue'
import VueRouter from 'vue-router'
import BiobankExplorerContainer from '../components/BiobankExplorerContainer'
import BiobankReportCard from '../components/cards/BiobankReportCard'
import CollectionReport from '../views/CollectionReport'
import NetworkReportCard from '../components/cards/NetworkReportCard'
import { INITIAL_STATE } from '../store/state'

Vue.use(VueRouter)
export default new VueRouter({
  mode: 'hash',
  base: INITIAL_STATE.baseUrl,
  routes: [
    {
      path: '/biobankexplorer',
      component: BiobankExplorerContainer
    },
    {
      path: '/biobank/report/:id',
      redirect: '/biobank/:id'
    },
    {
      path: '/biobank/:id',
      name: 'biobank',
      component: BiobankReportCard
    },
    {
      path: '/collection/:id',
      name: 'collection',
      component: CollectionReport
    },
    {
      path: '/network/:id',
      name: 'network',
      component: NetworkReportCard
    },
    {
      path: '/:mode/',
      component: BiobankExplorerContainer,
      props: true
    },
    {
      path: '/',
      redirect: '/biobankview/'
    }
  ]
})
