<template>
  <div v-if="userStore.user" class="row">
    <!-- User Info Card -->
    <div class="col-md-4 mb-4">
      <div class="card border-primary">
        <div class="card-header bg-primary text-white">
          <h3 class="card-title m-0">User Profile</h3>
        </div>
        <div class="card-body">
          <p class="mb-2"><strong>Username:</strong> {{ userStore.user.username }}</p>
          <p class="mb-2"><strong>Email:</strong> {{ userStore.user.email }}</p>
          <p class="mb-0">
            <strong>Role:</strong> 
            <span :class="userStore.user.isAdmin ? 'badge bg-danger ms-2' : 'badge bg-success ms-2'">
              {{ userStore.user.isAdmin ? 'Admin' : 'Member' }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- User's Posts Column -->
    <div class="col-md-8">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>My Posts</h2>
        <span class="badge bg-primary fs-6">{{ myPosts.length }} Posts</span>
      </div>

      <div v-if="loading" class="text-muted">Loading your posts...</div>

      <div v-else-if="myPosts.length === 0" class="alert alert-info">
        You haven't created any posts yet.
      </div>

      <div v-else v-for="post in myPosts" :key="post._id" class="card mb-3">
        <div class="card-body">
          <h4 class="card-title text-primary">{{ post.title }}</h4>
          <h6 class="card-subtitle mb-2 text-muted">
            Created on {{ new Date(post.creationDate).toLocaleDateString() }}
          </h6>
          <p class="card-text">{{ post.content.substring(0, 150) }}...</p>
          
          <div class="d-flex justify-content-between align-items-center">
            <router-link :to="`/posts/${post._id}`" class="btn btn-outline-primary btn-sm">
              View & Edit Post
            </router-link>
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-danger">❤️ {{ post.likes?.length || 0 }}</span>
              <span class="badge bg-secondary">💬 {{ post.comments?.length || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Notyf } from 'notyf';
import api from '../api';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const allPosts = ref([]);
const loading = ref(true);
const notyf = new Notyf({ duration: 3000 });

// Filter posts matching the current logged-in user's username
const myPosts = computed(() => {
  return allPosts.value.filter(post => post.author === userStore.user?.username);
});

const fetchPosts = async () => {
  try {
    const res = await api.get('/posts');
    allPosts.value = res.data;
  } catch (err) {
    notyf.error('Failed to load your posts');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (userStore.token && !userStore.user) {
    userStore.fetchProfile().then(fetchPosts);
  } else {
    fetchPosts();
  }
});
</script>