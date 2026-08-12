<template>
  <div class="row">
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>👑 Admin Dashboard</h2>
        <span class="badge bg-danger fs-6">{{ posts.length }} Total Posts</span>
      </div>

      <div class="table-responsive">
        <table class="table table-hover table-bordered align-middle">
          <thead class="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Creation Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post._id">
              <td><strong>{{ post.title }}</strong></td>
              <td>{{ post.author }}</td>
              <td>{{ new Date(post.creationDate).toLocaleDateString() }}</td>
              <td>
                <span v-if="post.isActive !== false" class="badge bg-success">Active</span>
                <span v-else class="badge bg-secondary">Archived</span>
              </td>
              <td>
                <div class="btn-group btn-group-sm" role="group">
                  <button 
                    v-if="post.isActive !== false" 
                    @click="archivePost(post._id)" 
                    class="btn btn-warning"
                  >
                    Archive
                  </button>
                  <button 
                    v-else 
                    @click="activatePost(post._id)" 
                    class="btn btn-success"
                  >
                    Activate
                  </button>
                  <button @click="deletePost(post._id)" class="btn btn-danger">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Notyf } from 'notyf';
import api from '../api';

const posts = ref([]);
const notyf = new Notyf({ duration: 3000 });

const fetchPosts = async () => {
  try {
    const res = await api.get('/posts');
    posts.value = res.data;
  } catch (err) {
    notyf.error('Failed to load posts');
  }
};

const archivePost = async (id) => {
  try {
    await api.patch(`/posts/${id}/archive`);
    notyf.success('Post archived');
    fetchPosts();
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Archive failed');
  }
};

const activatePost = async (id) => {
  try {
    await api.patch(`/posts/${id}/activate`);
    notyf.success('Post activated');
    fetchPosts();
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Activation failed');
  }
};

const deletePost = async (id) => {
  if (confirm('Admin Action: Permanently delete this post?')) {
    try {
      await api.delete(`/posts/${id}`);
      notyf.success('Post removed by Admin');
      fetchPosts();
    } catch (err) {
      notyf.error(err.response?.data?.message || 'Delete failed');
    }
  }
};

onMounted(fetchPosts);
</script>