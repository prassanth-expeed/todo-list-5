import { createApp } from 'vue';
import App from './App.vue';
import './styles/base.css';

import { createStore, STORE_KEY } from './store';

async function bootstrap() {
  const app = createApp(App);

  const store = createStore();
  await store.boot();

  app.provide(STORE_KEY, store);

  app.mount('#app');
}

bootstrap();
