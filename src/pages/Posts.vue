<template>
  <div class="row">
    <!-- Create Post Card -->
    <div v-if="userStore.token" class="col-12 mb-4">
      <div class="card border-info">
        <div class="card-header bg-info text-white">
          <h4 class="m-0">Create New Post</h4>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <input v-model="newTitle" type="text" class="form-control" placeholder="Post Title" />
          </div>
          <div class="mb-3">
            <textarea v-model="newContent" class="form-control" rows="3" placeholder="Write your content..."></textarea>
          </div>
          <button @click="createPost" class="btn btn-info text-white">Publish Post</button>
        </div>
      </div>
    </div>

    <!-- Posts Feed -->
    <div class="col-12">
      <h2 class="mb-3">Active Posts</h2>
      <div v-if="posts.length === 0" class="alert alert-warning">No active posts found.</div>
      
      <div v-for="post in posts" :key="post._id" class="card mb-3">
        <div class="card-body">
          <h3 class="card-title text-primary">{{ post.title }}</h3>
          <h6 class="card-subtitle mb-2 text-muted">
            By <strong>{{ post.author }}</strong> on {{ new Date(post.creationDate).toLocaleDateString() }}
          </h6>
          <p class="card-text">{{ post.content.substring(0, 150) }}...</p>
          <div class="d-flex justify-content-between align-items-center">
            <router-link :to="`/posts/${post._id}`" class="btn btn-outline-primary btn-sm">
              Read Details & Comments ({{ post.comments?.length || 0 }})
            </router-link>
            <span class="badge bg-danger">❤️ {{ post.likes?.length || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Notyf } from 'notyf';
import api from '../api';
import { useUserStore } from '../stores/user';

const posts = ref([]);
const newTitle = ref('');
const newContent = ref('');
const userStore = useUserStore();
const notyf = new Notyf({ duration: 3000 });

const fetchPosts = async () => {
  try {
    const res = await api.get('/posts/active');
    posts.value = res.data;
  } catch (err) {
    notyf.error('Failed to load posts');
  }
};

const createPost = async () => {
  if (!newTitle.value || !newContent.value) {
    return notyf.error('Title and content are required');
  }
  try {
    await api.post('/posts', { title: newTitle.value, content: newContent.value });
    notyf.success('Post created successfully!');
    newTitle.value = '';
    newContent.value = '';
    fetchPosts();
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Failed to create post');
  }
};

onMounted(fetchPosts);
</script>