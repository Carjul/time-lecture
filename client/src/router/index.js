import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '../views/Homeview.vue'
import AboutView from '../views/UploadView.vue'
import PosFact from '../views/PosFact.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/upload', component: AboutView },
  {path: '/calcular_pos', component: PosFact}
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router