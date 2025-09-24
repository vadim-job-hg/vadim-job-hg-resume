<script setup lang="ts">
import HeroIcon from './HeroIcon.vue';
import CvPdfTemplate from './CvPdfTemplate.vue';
import { useResumeStore } from '@/stores/ResumeStore';
import { storeToRefs } from 'pinia';
const resumeStore = useResumeStore();
const { resume } = storeToRefs(resumeStore);

// PDF generation logic
import { ref, nextTick } from 'vue';
import html2pdf from 'html2pdf.js';
import InfoCardItem from '@/components/InfoCardItem.vue';
const isGenerating = ref(false);
const pdfContentRef = ref<HTMLElement | null>(null);
const showPdfContent = ref(false);

async function generatePdf() {
  isGenerating.value = true;
  showPdfContent.value = true;
  try {
    await nextTick(); // Ensure DOM is updated
    const element = pdfContentRef.value;
    if (element) {
      await html2pdf()
        .from(element)
        .set({
          margin: 10,
          filename: 'resume.pdf',
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .save();
    }
  } finally {
    showPdfContent.value = false;
    isGenerating.value = false;
  }
}
</script>

<template>
  <div class="card">
    <h2 class="mb-4 text-lg font-semibold dark:text-night-50">{{ $t('resume') }}</h2>
    <InfoCardItem :key="0" :item="resume.cv">
      <button
        @click="generatePdf"
        :disabled="isGenerating"
        class="ml-0 cursor-pointer rounded-full bg-primary-500/20 py-2.5 px-2.5 text-primary-500">
        <HeroIcon :icon="'ArrowDownTrayIcon'" class="stroke- h-5 w-5 hover:animate-pulse" />
      </button>
    </InfoCardItem>
    <div v-if="showPdfContent" ref="pdfContentRef">
      <CvPdfTemplate :cv="resume.cv" />
    </div>
  </div>
</template>
