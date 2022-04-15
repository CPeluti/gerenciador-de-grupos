import { RouteRecordRaw } from 'vue-router';
import materiasPage from 'pages/cruds/MateriasPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/cruds/MateriasPage.vue'),
    // children: [{ path: '', component: () => materiasPage}],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
