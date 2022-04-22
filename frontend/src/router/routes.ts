import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
    // children: [{ path: '', component: () => materiasPage}],
  },
  {
    path: '/',
    name: 'home',
    component: () => import('pages/HomePage.vue'),
    // children: [{ path: '', component: () => materiasPage}],
  },
  {
    path: '/grupo/:id',
    name: 'grupo',
    component: () => import('pages/GroupPage.vue'),
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
