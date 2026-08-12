<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
    <div class="container">
      <router-link to="/" class="navbar-brand">✍️ BloggersApp</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarMain">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Posts</router-link>
          </li>
          <li class="nav-item" v-if="userStore.token">
            <router-link to="/profile" class="nav-link">Profile</router-link>
          </li>
          <li class="nav-item" v-if="userStore.user?.isAdmin">
            <router-link to="/admin" class="nav-link">Admin Dashboard</router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-3">
          <template v-if="!userStore.token">
            <router-link to="/login" class="btn btn-outline-light btn-sm">Login</router-link>
            <router-link to="/register" class="btn btn-dark btn-sm">Register</router-link>
          </template>

          <template v-else>
            <router-link to="/profile" class="btn btn-outline-light btn-sm">
              👤 My Profile ({{ userStore.user?.username }})
            </router-link>
            <button @click="handleLogout" class="btn btn-danger btn-sm">Logout</button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
</script>