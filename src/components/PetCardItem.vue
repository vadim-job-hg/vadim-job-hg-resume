<script setup lang="ts">
import type { Pet } from '@/models/Pet';
import HeroIcon from './HeroIcon.vue';
import { getImagePath } from '@/helpers/Helper';

defineProps<{ item: Pet; separator: boolean }>();
</script>

<template>
  <div class="mb-5 flex items-start">
    <img
      :src="getImagePath(item.image)"
      alt="pet project logo"
      class="h-14 w-14 shrink-0 rounded-xl border-2 border-gray-50 shadow-sm dark:border-night-700" />
    <div class="ml-3 w-full space-y-5">
      <div class="flex justify-between">
        <div class="space-y-1.5">
          <div class="font-medium dark:text-night-50">{{ item.name }}</div>
          <div v-if="item.language" class="flex items-center gap-1 text-sm font-medium text-gray-400 dark:text-night-400">
            <HeroIcon :icon="'CodeBracketIcon'" class="h-4 w-4 shrink-0 stroke-2" />
            <span>{{ item.language }}</span>
          </div>
        </div>
      </div>
      <p class="text-sm text-gray-600 dark:text-night-300">
        {{ item.description }}
      </p>
      <div class="flex flex-wrap gap-2">
        <a
          v-for="(link, i) in item.url"
          :key="i"
          :href="link"
          target="_blank"
          class="inline-flex cursor-pointer items-center gap-1 rounded-lg border-2 border-gray-100 px-2 py-1.5 text-xs font-medium text-gray-400 hover:border-primary-500 hover:bg-primary-500 hover:text-white dark:border-night-700 dark:text-night-400 dark:hover:border-primary-500 dark:hover:bg-primary-500/20 dark:hover:text-primary-500">
          <HeroIcon :icon="'LinkIcon'" class="h-4 w-4 shrink-0 stroke-2" />
          <span>Link {{ i + 1 }}</span>
        </a>
      </div>
      <div v-if="separator" class="border-b border-dashed border-gray-200 dark:border-night-600"></div>
    </div>
  </div>
</template>
