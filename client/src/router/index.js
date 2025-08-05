import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '../views/homeview.vue'
import AboutView from '../views/UploadView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/upload', component: AboutView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router