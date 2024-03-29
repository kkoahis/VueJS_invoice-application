import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import notFound from '../components/NotFound.vue'
import NewInvoice from '../components/NewInvoice.vue'
import ShowInvoice from '../components/ShowInvoice.vue'
import EditInvoice from '../components/EditInvoice.vue'
import SuccessPayment from '../components/SuccessPayment.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/:pathMath(.*)*',
    component: notFound
  },
  {
    path: '/invoice/new',
    name: 'new-invoice',
    component: NewInvoice
  },
  {
    path: '/invoice/show/:id',
    name: 'show-invoice',
    component: ShowInvoice,
    props: true
  },
  {
    path: '/invoice/edit/:id',
    name: 'edit-invoice',
    component: EditInvoice,
    props: true
  },
  {
    path: '/success',
    name: 'success',
    component: SuccessPayment,
    props: route => ({ session_id: route.query.session_id })
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
