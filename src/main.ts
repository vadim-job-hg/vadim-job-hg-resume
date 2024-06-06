import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';
import VueEasyLightbox from 'vue-easy-lightbox';

import './assets/css/main.css';

import enUS from './assets/i18n/en-EN.json';
import bgBG from './assets/i18n/bg-BG.json';

type MessageSchema = typeof enUS;

const i18n = createI18n<[MessageSchema], 'en-US' | 'bg-BG'>({
  globalInjection: true,
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en',
  messages: {
    'en-US': enUS,
    'bg-BG': bgBG,
  },
});

const app = createApp(App);

app.use(i18n);
app.use(VueEasyLightbox);
app.use(router);
app.use(createPinia());

app.mount('#app');
