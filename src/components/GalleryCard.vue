<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useResumeStore } from '@/stores/ResumeStore';
import { getImagePath } from '@/helpers/Helper';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

import { storeToRefs } from 'pinia';

const resumeStore = useResumeStore();
const { resume } = storeToRefs(resumeStore);

const imagesList = resume.value.gallery;

const galleryID = 'galleryId';
onMounted(() => {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '#' + galleryID,
    children: 'a',
    maxWidthToAnimate: 800,
    pswpModule: () => import('photoswipe'),
  });

  lightbox.init();
});
</script>

<template>
  <div :id="galleryID">
    <div :key="key1" v-for="(imageData, key1) in imagesList" class="card my-4">
      <h2 class="mb-4 text-lg font-semibold dark:text-night-50">{{ imageData.name }}</h2>
      <div class="flex w-full flex-row">
        <a
          v-for="(image, key2) in imageData.images"
          :key="key2"
          :href="getImagePath(image.src)"
          :data-pswp-width="image.width"
          :data-pswp-height="image.height"
          target="_blank"
          rel="noreferrer">
          <img :src="getImagePath(image.src)" :alt="image.alt" width="200" class="mx-px" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
