import { RouteRecordRaw } from 'vue-router'
import IndexPage from 'pages/IndexPage.vue'
import CuentaPage from 'src/pages/CuentaPage.vue'
import TransaccionPage from 'src/pages/TransaccionPage.vue'
import TransferenciaPage from 'src/pages/TransferenciaPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: IndexPage },
      { path: 'cuenta', component: CuentaPage },
      { path: 'transaccion', component: TransaccionPage },
      { path: 'transferencia', component: TransferenciaPage }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
