import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';
import VueEasyLightbox from 'vue-easy-lightbox';

import './assets/css/main.css';

import enUS from './assets/i18n/en-US.json';
import bgBG from './assets/i18n/bg-BG.json';
import ruRU from './assets/i18n/ru-RU.json';
import fiFI from './assets/i18n/fi-FI.json';
import jaJA from './assets/i18n/ja-JA.json';
import zhCH from './assets/i18n/zh-CH.json';

type MessageSchema = typeof enUS;

// @ts-ignore
const i18n = createI18n<[MessageSchema], 'en-US' | 'bg-BG' | 'ru-RU' | 'fi-FI' | 'ja-JA' | 'zh-CH'>({
  globalInjection: true,
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en',
  messages: {
    'en-US': enUS,
    'bg-BG': bgBG,
    'ru-RU': ruRU,
    'fi-FI': fiFI,
    'ja-JA': jaJA,
    'zh-CH': zhCH,
  },
});

const app = createApp(App);

app.use(i18n);
app.use(VueEasyLightbox);
app.use(router);
app.use(createPinia());

app.mount('#app');
