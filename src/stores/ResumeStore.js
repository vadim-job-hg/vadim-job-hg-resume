import { defineStore } from 'pinia';
/** Resume files */
import bgBG from '@/assets/json/resume.bg.json';
import enUS from '@/assets/json/resume.en.json';
const languages = [
    { code: 'en-US', data: enUS },
    { code: 'bg-BG', data: bgBG }
];
export const useResumeStore = defineStore('resume', {
    state: () => {
        return {
            resume: languages[0].data,
        };
    },
    actions: {
        loadResume() {
            if ('locale' in localStorage) {
                const selected = languages.find((lang) => lang.code == localStorage.locale)?.data;
                if (selected)
                    this.resume = selected;
            }
        },
    },
});
