import { defineStore } from 'pinia';
import type { Resume } from '../models/Resume';
/** Resume files */
import enUS from '@/assets/json/resume.en.json';
import bgBG from '@/assets/json/resume.bg.json';
import ruRU from '@/assets/json/resume.ru.json';

const languages = [
  { code: 'en-US', data: enUS },
  { code: 'bg-BG', data: bgBG },
  { code: 'ru-RU', data: ruRU },
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
