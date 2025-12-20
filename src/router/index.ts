import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Dashboard from '@/components/views/dashboard.vue'
import Lock from '@/components/views/lock.vue'
import Settings from '@/components/views/settings.vue'
import NoteList from '@/components/views/note-list.vue'
import EditNote from '@/components/views/edit-note.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Dashboard
  },
  {
    path: '/lock',
    name: 'lock',
    component: Lock
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  },
  {
    path: '/notes',
    name: 'note_list',
    component: NoteList
  },
  {
    path: '/note/edit',
    name: 'edit_note',
    component: EditNote
  },
  {
    path: '/search',
    name: 'search',
    component: Dashboard // Placeholder - zmień na komponent Search gdy zostanie stworzony
  },
  {
    path: '/month',
    name: 'month',
    component: Dashboard // Placeholder - zmień na komponent Month gdy zostanie stworzony
  },
  {
    path: '/year',
    name: 'year',
    component: Dashboard // Placeholder - zmień na komponent Year gdy zostanie stworzony
  },
  {
    path: '/about',
    name: 'about',
    component: Dashboard // Placeholder - zmień na komponent About gdy zostanie stworzony
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
