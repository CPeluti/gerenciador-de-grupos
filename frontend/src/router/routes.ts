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
    path: '/crudMaterias',
    name: 'crudMaterias',
    component: () => import('pages/cruds/MateriasPage.vue'),
    // children: [{ path: '', component: () => materiasPage}],
  },
  {
    path: '/crudDepartamentos',
    name: 'crudDepartamentos',
    component: () => import('pages/cruds/DepartamentosPage.vue'),
    // children: [{ path: '', component: () => materiasPage}],
  },
  {
    path: '/crudTurmas',
    name: 'crudTurmas',
    component: () => import('pages/cruds/TurmasPage.vue'),
    // children: [{ path: '', component: () => materiasPage}],
  },
  {
    path: '/crudParticipantes',
    name: 'crudParticipantes',
    component: () => import('pages/cruds/ParticipantesPage.vue'),
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
