<script setup lang="ts">
import { useResumeStore } from '@/stores/ResumeStore';
import { storeToRefs } from 'pinia';
import { onMounted } from "vue";

const resumeStore = useResumeStore();
const { resume } = storeToRefs(resumeStore);
const backgroundMapId = 'backgroundMapId';
onMounted(() => {});
</script>

<template>
  <div class="card">
    <h2 class="mb-4 text-lg font-semibold dark:text-night-50">{{ $t('activities') }}</h2>
    <div class="-m-2 flex flex-wrap" id="backgroundMapId"></div>
  </div>
</template>
