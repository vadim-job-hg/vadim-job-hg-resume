<template>
  <div class="cv-template">
    <!-- Sidebar -->
    <aside class="cv-sidebar">
      <div class="cv-initials">
        <span>{{ cv.initials }}</span>
      </div>

      <section class="block">
        <h2>CONTACT</h2>
        <p>{{ cv.phone }}</p>
        <p>{{ cv.email }}</p>
        <p>{{ cv.location }}</p>
      </section>

      <section class="block">
        <h2>LANGUAGE</h2>
        <ul>
          <li v-for="lang in cv.languages" :key="lang.name">
            <strong>{{ lang.name }}</strong>, {{ lang.level }}
          </li>
        </ul>
      </section>

      <section class="block">
        <h2>SKILLS</h2>
        <ul>
          <li v-for="skill in cv.skills" :key="skill">{{ skill }}</li>
        </ul>
      </section>
    </aside>

    <!-- Main content -->
    <main class="cv-main">
      <header class="cv-header">
        <h1>{{ cv.name }}</h1>
      </header>

      <section class="block">
        <h2>PROFESSIONAL SUMMARY</h2>
        <p>{{ cv.summary }}</p>
      </section>

      <section class="block">
        <h2>EXPERIENCE</h2>
        <div
          v-for="job in cv.experience"
          :key="job.company + job.period"
          class="item"
        >
          <div class="job-header">
            <h3>{{ job.title }}</h3>
            <span class="period">{{ job.period }}</span>
          </div>
          <p class="company">{{ job.company }}</p>
          <p>{{ job.description }}</p>
          <p class="tech">Technologies: {{ job.tech.join(', ') }}</p>
        </div>
      </section>

      <section class="block">
        <h2>EDUCATION</h2>
        <div
          v-for="edu in cv.education"
          :key="edu.degree + edu.year"
          class="item"
        >
          <div class="edu-header">
            <h3>{{ edu.degree }}</h3>
            <span class="year">{{ edu.year }}</span>
          </div>
          <p class="institution">{{ edu.institution }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
defineProps<{ cv: any }>();
</script>

<style scoped>
.cv-template {
  display: grid;
  grid-template-columns: 260px 1fr;
  width: 100%;
  max-width: 1000px;
  margin: auto;
  font-family: 'Roboto', Arial, sans-serif;
  background: #fff;
  color: #222;
}

/* Sidebar */
.cv-sidebar {
  background: #000;
  color: #fff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.cv-initials {
  background: #111;
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  padding: 24px 0;
}
.block h2 {
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
  border-bottom: 1px solid #555;
  padding-bottom: 4px;
  text-transform: uppercase;
}
.block p,
.block li {
  font-size: 13px;
  margin: 2px 0;
}
ul {
  padding-left: 16px;
}

/* Main */
.cv-main {
  padding: 32px;
}
.cv-header {
  text-align: center;
  margin-bottom: 32px;
}
.cv-header h1 {
  font-size: 28px;
  text-transform: uppercase;
  margin: 0;
}

/* Sections */
.block {
  margin-bottom: 28px;
}
.block h2 {
  font-size: 14px;
  font-weight: bold;
  color: #000;
  margin-bottom: 12px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
}
.item {
  margin-bottom: 16px;
}
.job-header,
.edu-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.job-header h3,
.edu-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: bold;
}
.period,
.year {
  font-size: 12px;
  font-style: italic;
  color: #555;
}
.company,
.institution {
  font-weight: bold;
  margin-bottom: 6px;
}
.tech {
  font-size: 13px;
  color: #333;
}
</style>

