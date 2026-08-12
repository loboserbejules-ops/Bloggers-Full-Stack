import { createRouter, createWebHistory } from 'vue-router';
import Posts from '../pages/Posts.vue';
import PostDetails from '../pages/PostDetails.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import AdminDashboard from '../pages/AdminDashboard.vue';
import Profile from '../pages/Profile.vue';

const routes = [
  { path: '/', component: Posts },
  { path: '/posts/:id', component: PostDetails },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/admin', component: AdminDashboard },
  { path: '/profile', component: Profile }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;