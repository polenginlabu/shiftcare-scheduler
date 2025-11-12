import { createRouter, createWebHistory } from 'vue-router'
import Doctors from '@/views/Doctors.vue';
import DoctorDetail from '@/views/DoctorDetail.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'doctors', component: Doctors },
    { path: '/doctor/:id', name: 'doctor-detail', component: DoctorDetail, props: true },
  ],
})

export default router
