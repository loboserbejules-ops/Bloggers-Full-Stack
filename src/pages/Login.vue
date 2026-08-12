<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card border-primary mb-3">
        <div class="card-header bg-primary text-white">
          <h3 class="card-title m-0">Login</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input v-model="email" type="email" class="form-control" placeholder="enter email" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" placeholder="enter password" required />
            </div>
            <button type="submit" class="btn btn-primary w-100">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const email = ref('');
const password = ref('');
const userStore = useUserStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    await userStore.login(email.value, password.value);
    router.push('/');
  } catch (err) {
    // Handled by Notyf in user store
  }
};
</script>