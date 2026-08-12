<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card border-secondary mb-3">
        <div class="card-header bg-secondary text-white">
          <h3 class="card-title m-0">Register</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input v-model="username" type="text" class="form-control" placeholder="choose username" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input v-model="email" type="email" class="form-control" placeholder="enter email" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" placeholder="enter password" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Confirm Password</label>
              <input v-model="confirmPassword" type="password" class="form-control" placeholder="confirm password" required />
            </div>
            <button type="submit" class="btn btn-secondary w-100">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import api from '../api';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();
const notyf = new Notyf({ duration: 3000 });

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    return notyf.error('Passwords do not match');
  }

  try {
    await api.post('/users/register', {
      username: username.value,
      email: email.value,
      password: password.value
    });
    notyf.success('Registration successful! Please login.');
    router.push('/login');
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Registration failed');
  }
};
</script>