<script setup lang="ts">
import { computed, ref } from 'vue';
import ProjectCardItem from './ProjectCardItem.vue';
import PetCardItem from './PetCardItem.vue';
import { useResumeStore } from '@/stores/ResumeStore';
import { storeToRefs } from 'pinia';
import MyPaginate from './MyPaginate.vue';

const itemsPerPage = 3;
const currentPage = ref(1);
const currentPetPage = ref(1);

const resumeStore = useResumeStore();
const { resume } = storeToRefs(resumeStore);

const totalProjects = computed(() => resume.value.project.length);
const totalPets = computed(() => resume.value.pets.length);

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return resume.value.project.slice(start, end);
});

const paginatedPets = computed(() => {
  const start = (currentPetPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return resume.value.pets.slice(start, end);
});

function onProjectPageChange(page: number) {
  currentPage.value = page;
}
function onPetPageChange(page: number) {
  currentPetPage.value = page;
}
</script>

<template>
  <div class="card">
    <!-- PROJECTS -->
    <h2 class="mb-5 text-lg font-semibold dark:text-night-50">{{ $t('project') }}</h2>
    <ProjectCardItem
      v-for="(item, index) of paginatedProjects"
      :item="item"
      :key="`proj-${index}`"
      :separator="paginatedProjects.length > index + 1" />
    <MyPaginate
      :totalItems="totalProjects"
      :itemsPerPage="itemsPerPage"
      :maxVisibleButtons="3"
      @pagechanged="onProjectPageChange" />

    <!-- PET PROJECTS -->
    <h2 class="mt-10 mb-5 text-lg font-semibold dark:text-night-50">{{ $t('pet_projects') }}</h2>
    <PetCardItem
      v-for="(item, index) of paginatedPets"
      :item="item"
      :key="`pet-${index}`"
      :separator="paginatedPets.length > index + 1" />
    <MyPaginate
      :totalItems="totalPets"
      :itemsPerPage="itemsPerPage"
      :maxVisibleButtons="3"
      @pagechanged="onPetPageChange" />
  </div>
</template>
