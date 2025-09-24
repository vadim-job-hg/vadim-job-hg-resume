<template>
  <div class="cv-template">
    <div class="header">
      <div class="logo">
        <span>V</span>
        <span>K</span>
      </div>
      <div class="name">VADYM KUZNETSOV</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ cv: any }>();
</script>

<style scoped>
.header {
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
}

.logo {
  position: absolute;
  width: 149px;
  height: 325px;
  background-image: url('@/assets/pdf/bookmark.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  left: 0;
  top: 0;
  z-index: 1;
}

.logo span {
  line-height: 1;
}

.name {
  font-size: 28px;
  font-weight: bold;
}
</style>
