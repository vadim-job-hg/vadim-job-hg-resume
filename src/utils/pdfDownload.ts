import html2pdf from 'html2pdf.js';
import { nextTick } from 'vue';

export async function generateAndDownloadPdf({
  element,
  filename = 'resume.pdf',
  margin = 0,
  lang = 'en',
}: {
  element: HTMLElement | null;
  filename?: string;
  margin?: number;
  lang?: string;
}) {
  if (!element) return;
  await nextTick();
  await html2pdf()
    .from(element)
    .set({
      margin,
      filename: filename || `resume_${lang}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .save();
  window.close();
}

