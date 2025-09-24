<script setup lang="ts">
import HeroIcon from './HeroIcon.vue';
import CvPdfTemplate from './CvPdfTemplate.vue';
import { useResumeStore } from '@/stores/ResumeStore';
import { storeToRefs } from 'pinia';
const resumeStore = useResumeStore();
const { resume } = storeToRefs(resumeStore);

// PDF generation logic
import { ref } from 'vue';
import html2pdf from 'html2pdf.js';
const isGenerating = ref(false);

async function generatePdf() {
  isGenerating.value = true;
  try {
    const element = document.getElementById('resume-pdf-content');
    if (element) {
      await html2pdf().from(element).set({
        margin: 10,
        filename: 'resume.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).save();
    }
  } finally {
    isGenerating.value = false;
  }
}
</script>

<template>
  <div class="card">
    <h2 class="mb-4 text-lg font-semibold dark:text-night-50">{{ $t('resume') }}</h2>
    <div id="resume-pdf-content">
      <CvPdfTemplate :cv="resume.cv" />
    </div>
    <button
      @click="generatePdf"
      :disabled="isGenerating"
      class="ml-2 rounded bg-primary-500 text-white px-3 py-1 text-sm hover:bg-primary-600 disabled:opacity-50">
      {{ isGenerating ? $t('generating') : $t('generate_pdf') }}
    </button>
  </div>
</template>
