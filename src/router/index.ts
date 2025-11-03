import { createRouter, createWebHistory } from 'vue-router';
import ExperienceView from '../views/ExperienceView.vue';
import EducationView from '../views/EducationView.vue';
import ProjectView from '../views/ProjectView.vue';
import GalleryView from '../views/GalleryView.vue';
import SportView from '../views/SportView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass:
    'bg-primary-500 text-white dark:text-primary-500 dark:bg-primary-500/20 dark:border-primary-500/20 border-primary-500',
  routes: [
    {
      path: '/',
      name: 'experience',
      component: ExperienceView,
    },
    {
      path: '/education',
      name: 'education',
      component: EducationView,
    },
    {
      path: '/project',
      name: 'project',
      component: ProjectView,
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: GalleryView,
    },
    {
      path: '/sport',
      name: 'sport',
      component: SportView,
    },
  ],
});

export default router;
