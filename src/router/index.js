import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Bugun' } },
    { path: '/plan', name: 'plan', component: () => import('../views/PlanView.vue'), meta: { title: 'Reja' } },
    { path: '/day/:n(\\d+)', name: 'day', component: () => import('../views/DayView.vue'), meta: { title: 'Kun' } },
    { path: '/learn/:domain?', name: 'learn', component: () => import('../views/KnowledgeView.vue'), meta: { title: 'Bilim bazasi' } },
    { path: '/learn/:domain/:topic', name: 'topic', component: () => import('../views/TopicView.vue'), meta: { title: 'Mavzu' } },
    { path: '/problems', name: 'problems', component: () => import('../views/ProblemsView.vue'), meta: { title: 'Masalalar' } },
    { path: '/practice', name: 'practice', component: () => import('../views/PracticeView.vue'), meta: { title: 'Mock interview' } },
    { path: '/phrases', name: 'phrases', component: () => import('../views/PhrasesView.vue'), meta: { title: 'Iboralar' } },
    { path: '/speak', name: 'speak', component: () => import('../views/SpeakView.vue'), meta: { title: 'Gapirish' } },
    { path: '/notebook', name: 'notebook', component: () => import('../views/NotebookView.vue'), meta: { title: 'Daftar' } },
    { path: '/reference', name: 'reference', component: () => import('../views/ReferenceView.vue'), meta: { title: "Ma'lumotnoma" } },
    { path: '/more', name: 'more', component: () => import('../views/MoreView.vue'), meta: { title: 'Yana' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: 72, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'Interview Prep'} · Interview Prep`
})

export default router
