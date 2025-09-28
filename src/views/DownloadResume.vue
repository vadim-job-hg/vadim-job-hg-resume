<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import CvPdfTemplate from '@/components/CvPdfTemplate.vue';
import { useResumeStore } from '@/stores/ResumeStore';
import { storeToRefs } from 'pinia';
import { generateAndDownloadPdf } from '@/utils/pdfDownload';

const route = useRoute();
const resumeStore = useResumeStore();
const { resume } = storeToRefs(resumeStore);

const lang = route.query.lang || 'en';
const pdfContentRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  await resumeStore.loadResume(lang);
  await generateAndDownloadPdf({
    element: pdfContentRef.value,
    filename: `VadymKuznetsov${lang}.pdf`,
    lang: lang as string,
  });
});
</script>

<template>
  <div ref="pdfContentRef">
    <CvPdfTemplate :resume="resume" />
  </div>
</template>
