import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import 'bootswatch/dist/journal/bootstrap.min.css';
import 'bootstrap';
import 'notyf/notyf.min.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');