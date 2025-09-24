<template>
  <div class="cv-template">
    <h1>{{ cv.name }}</h1>
    <p>{{ cv.title }}</p>
    <p>{{ cv.email }}</p>
    <ul>
      <li v-for="item in cv.items" :key="item.id">
        <strong>{{ item.title }}</strong>: {{ item.description }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{ cv: any }>();
</script>

<style scoped>
.cv-template {
  font-family: Arial, sans-serif;
  padding: 24px;
}
h1 {
  color: #b91c1c;
  margin-bottom: 8px;
}
ul {
  margin-top: 16px;
}
li {
  margin-bottom: 6px;
}
</style>

