<template>
  <div v-if="post" class="row justify-content-center">
    <div class="col-md-10">
      <div v-if="!isEditing" class="card mb-4 border-dark">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start border-bottom pb-2 mb-3">
            <div>
              <h1 class="card-title text-primary mb-1">
                {{ post.title }}
                <span v-if="!post.isActive" class="badge bg-secondary fs-6 ms-2">Archived</span>
              </h1>
              <p class="text-muted mb-0">
                By <strong>{{ post.author }}</strong> | Published on {{ new Date(post.creationDate).toLocaleString() }}
              </p>
            </div>

            <div v-if="canManage" class="dropdown">
              <button 
                class="btn btn-outline-secondary btn-sm dropdown-toggle" 
                type="button" 
                id="postActionsDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                ☰
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="postActionsDropdown">
                <li v-if="isOwner">
                  <button @click="isEditing = true" class="dropdown-item">
                    ✏️ Edit Post
                  </button>
                </li>
                <li>
                  <button v-if="post.isActive" @click="archivePost" class="dropdown-item text-warning">
                    📦 Archive Post
                  </button>
                  <button v-else @click="activatePost" class="dropdown-item text-success">
                    ✅ Activate Post
                  </button>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button @click="deletePost" class="dropdown-item text-danger">
                    🗑️ Delete Post
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <p class="card-text fs-5 my-4" style="white-space: pre-line;">{{ post.content }}</p>

          <div class="d-flex gap-2 mb-3">
            <button @click="handleLike" :disabled="!userStore.token" class="btn btn-outline-danger">
              ❤️ {{ post.likes?.length || 0 }} Likes
            </button>
          </div>

          <div class="mt-4 pt-3 border-top">
            <h4>Comments ({{ post.comments?.length || 0 }})</h4>
            
            <div v-if="userStore.token" class="input-group mb-3 mt-3">
              <input v-model="newComment" type="text" class="form-control" placeholder="Write a comment..." />
              <button @click="addComment" class="btn btn-primary">Submit</button>
            </div>

            <div v-if="post.comments?.length === 0" class="text-muted">No comments yet.</div>

            <div v-for="c in post.comments" :key="c._id" class="card my-2 bg-light">
              <div class="card-body py-2">
                <strong>{{ c.username }}</strong>
                <p class="mb-0">{{ c.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="card border-warning">
        <div class="card-header bg-warning text-dark">
          <h3 class="m-0">Edit Post</h3>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Title</label>
            <input v-model="editTitle" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Content</label>
            <textarea v-model="editContent" class="form-control" rows="5"></textarea>
          </div>
          <button @click="updatePost" class="btn btn-success me-2">Save Changes</button>
          <button @click="isEditing = false" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import api from '../api';
import { useUserStore } from '../stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const notyf = new Notyf({ duration: 3000 });

const post = ref(null);
const isEditing = ref(false);
const editTitle = ref('');
const editContent = ref('');
const newComment = ref('');

const isOwner = computed(() => userStore.user?.username === post.value?.author);
const canManage = computed(() => isOwner.value || userStore.user?.isAdmin);

const fetchPost = async () => {
  try {
    const res = await api.get(`/posts/${route.params.id}`);
    post.value = res.data;
    editTitle.value = res.data.title;
    editContent.value = res.data.content;
  } catch (err) {
    notyf.error('Post not found');
  }
};

const updatePost = async () => {
  try {
    await api.patch(`/posts/${route.params.id}`, { title: editTitle.value, content: editContent.value });
    notyf.success('Post updated');
    isEditing.value = false;
    fetchPost();
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Update failed');
  }
};

const archivePost = async () => {
  try {
    await api.patch(`/posts/${route.params.id}/archive`);
    notyf.success('Post archived');
    fetchPost();
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Archive failed');
  }
};

const activatePost = async () => {
  try {
    await api.patch(`/posts/${route.params.id}/activate`);
    notyf.success('Post activated');
    fetchPost();
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Activation failed');
  }
};

const deletePost = async () => {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      await api.delete(`/posts/${route.params.id}`);
      notyf.success('Post deleted');
      router.push('/');
    } catch (err) {
      notyf.error(err.response?.data?.message || 'Delete failed');
    }
  }
};

const handleLike = async () => {
  try {
    const res = await api.patch(`/posts/${route.params.id}/like`);
    notyf.success(res.data.message);
    fetchPost();
  } catch (err) {
    notyf.error('Like failed');
  }
};

const addComment = async () => {
  if (!newComment.value.trim()) return;
  try {
    await api.post(`/posts/${route.params.id}/comment`, { comment: newComment.value });
    notyf.success('Comment added');
    newComment.value = '';
    fetchPost();
  } catch (err) {
    notyf.error('Comment failed');
  }
};

onMounted(fetchPost);
</script>