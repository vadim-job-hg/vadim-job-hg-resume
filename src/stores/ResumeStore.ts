import { defineStore } from 'pinia';
import type { Resume } from '../models/Resume';
/** Resume files */
import enUS from '@/assets/json/resume.en.json';
import bgBG from '@/assets/json/resume.bg.json';
import ruRU from '@/assets/json/resume.ru.json';
import fiFI from '@/assets/json/resume.fi.json';
import jaJA from '@/assets/json/resume.ja.json';
import zhCH from '@/assets/json/resume.zh.json';

const languages = [
  { code: 'en-US', data: enUS },
  { code: 'bg-BG', data: bgBG },
  { code: 'ru-RU', data: ruRU },
  { code: 'fi-FI', data: fiFI },
  { code: 'ja-JA', data: jaJA },
  { code: 'zh-CH', data: zhCH },
];

export const useResumeStore = defineStore('resume', {
  state: () => {
    return {
      resume: languages[0].data as Resume,
    };
  },
  actions: {
    loadResume() {
      if ('locale' in localStorage) {
        const selected = languages.find((lang) => lang.code == localStorage.locale)?.data;
        if (selected) this.resume = selected;
      }
    },
  },
});
