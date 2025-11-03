<script setup lang="ts">
import HeroIcon from './HeroIcon.vue';
import { useResumeStore } from '@/stores/ResumeStore';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import InfoCardItem from '@/components/InfoCardItem.vue';

const resumeStore = useResumeStore();
const { resume } = storeToRefs(resumeStore);
const { locale } = useI18n({ useScope: 'global' });

const openPdfViewer = () => {
  window.open(`/cvpdf.html?lang=${locale.value}`, '_blank');
};
</script>

<template>
  <div class="card">
    <h2 class="mb-4 text-lg font-semibold dark:text-night-50">{{ $t('resume') }}</h2>
    <InfoCardItem :key="0" :item="resume.cv">
      <button
        @click="openPdfViewer"
        class="cursor-pointer rounded-full bg-primary-500/20 py-2.5 px-2.5 text-primary-500"
        :title="$t('download')">
        <HeroIcon :icon="'ArrowDownTrayIcon'" class="stroke- h-5 w-5 hover:animate-pulse" />
      </button>
    </InfoCardItem>
  </div>
</template>
