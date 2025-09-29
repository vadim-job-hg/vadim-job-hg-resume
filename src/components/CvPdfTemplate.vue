<template>
  <div class="container">
    <div class="bookmark">
      <span>V</span>
      <span>K</span>
    </div>
    <div class="header">
      <h1 class="title">{{ resume?.profile?.name?.toUpperCase() || '' }}</h1>
    </div>
    <div class="content-split">
      <div class="left-panel">
        <div class="section left-section section-1">
          <div class="info-list">
            <div v-for="(info, idx) in resume?.information" :key="idx" class="info-item">
              <span class="info-icon" v-if="info.icon === 'svg'" v-html="info.svg"></span>
              <HeroIcon v-else :icon="info.icon" class="info-icon h-5 w-5 stroke-1" />
              <div class="info-text text-justify">
                <div class="info-main">
                  <template v-if="info.icon === 'EnvelopeIcon'">
                    <a :href="`mailto:${info.value}`" class="email-link">{{ info.value }}</a>
                  </template>
                  <template v-else-if="info.icon === 'DevicePhoneMobileIcon'">
                    <a :href="`tel:${info.value.replace(/[^\d+]/g, '')}`" class="phone-link">{{ info.value }}</a>
                  </template>
                  <template v-else>{{ info.value }}</template>
                </div>
                <div class="info-label">{{ info.name }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="section left-section section-2">
          <div class="lang-list-block">
            <div class="section-title">{{ t('language') }}</div>
            <div class="lang-list">
              <div v-for="lang in resume.language" :key="lang.code" class="lang-item">
                <span class="lang-avatar">{{ lang.prefix }}</span>
                <div class="lang-info">
                  <div class="lang-name">{{ lang.name }}</div>
                  <div class="lang-level text-justify">{{ lang.level }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="section left-section section-3">
          <div class="skills-block">
            <div class="section-title">{{ t('skills') }}</div>
            <div class="skills-list">
              <div v-for="(skill, idx) in resume.skill" :key="idx" class="skill-badge">
                <span class="skill-text">{{ skill }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-panel">
        <div class="section right-section section-1">
          <div class="content-wrapper">
            <div class="heading">{{ resume?.profile?.professionalSummaryTitle || '' }}</div>
            <div class="card">
              <div class="card-description">
                {{ resume?.profile?.aboutMe || '' }}
              </div>
            </div>
          </div>
        </div>
        <div class="section right-section section-2">
          <div class="content-wrapper">
            <div class="heading">{{ t('experience') }}</div>
            <div v-for="(exp, index) in resume?.experience" :key="index" class="card">
              <div class="card-header">
                <div class="card-title">{{ exp.job }}</div>
                <div class="card-period">{{ exp.start }} ‐ {{ exp.end }}</div>
              </div>
              <div class="card-subtitle">{{ exp.company }}</div>
              <div class="card-description" v-html="exp.description"></div>
            </div>
          </div>
        </div>
        <div class="section right-section section-3">
          <div class="content-wrapper">
            <div class="heading">{{ t('education') }}</div>
            <div v-for="(edu, idx) in resume?.education" :key="idx" class="card">
              <div class="card-header">
                <div class="card-title">{{ edu.college }}</div>
                <div class="card-period">{{ edu.start }} - {{ edu.end }}</div>
              </div>
              <div class="card-subtitle mb-24">{{ edu.institution }}</div>
              <div v-if="edu.course" class="card-footer">{{ edu.course }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import HeroIcon from './HeroIcon.vue';

defineProps<{ resume: any }>();
const { t } = useI18n({ useScope: 'global' });
</script>

<style scoped>
body {
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #f7f7f7;
  margin: 0;
  padding: 0;
}
.container {
  width: 794px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  padding: 0;
  position: relative;
}
.header {
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  height: 122px;
  width: 100%;
  margin: 0;
  padding: 0;
}
.bookmark {
  position: absolute;
  width: 73px;
  height: 156px;
  background-image: url('@/assets/pdf/bookmark.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: bottom center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  left: 33px;
  top: 0;
  z-index: 10000;
}
.bookmark span {
  color: #fff;
  font-size: 33px;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  width: 100%;
  text-align: center;
  letter-spacing: 2px;
}
.title {
  font-size: 40px;
  font-weight: 700;
  padding: 0;
  margin: 0 0 0 130px;
  text-align: left;
  line-height: 1;
  height: 32px;
  display: flex;
  align-items: center;
}
.content-split {
  display: flex;
  width: 100%;
  min-height: 400px;
}
.left-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.section {
  flex: 1 1 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 12px;
  background: #fff;
  box-sizing: border-box;
  min-height: 27px;
  border-bottom: 1px solid #ccc;
}
.section:last-child {
  border-bottom: none;
}
.section {
  padding-top: 33px;
  padding-bottom: 40px;
}
.left-section {
  padding-left: 56px;
  padding-right: 27px;
}
.right-section {
  flex: 0 1 auto;
  padding-left: 27px !important;
  padding-right: 60px !important;
}
.section-1.left-section {
  padding-top: 73px;
  height: 370px;
  min-height: 370px;
  max-height: 370px;
  overflow: hidden;
}
.section-2.left-section {
  height: 232px;
  min-height: 232px;
  max-height: 232px;
  overflow: hidden;
}
.section-3.left-section {
  display: flex;
  flex-direction: column;
  height: 270px;
  min-height: 270px;
  max-height: 270px;
  overflow: hidden;
}
.left-panel {
  width: 275px;
  min-height: 270px;
  border-right: 1px solid #ccc;
  box-sizing: border-box;
}
.right-panel {
  flex: 1;
  min-height: 270px;
}
.info-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.info-item {
  display: flex;
  align-items: center;
  gap: 9px;
}
.info-icon {
  font-size: 15px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: inherit;
  filter: none;
  font-weight: 700;
}
.info-item:nth-child(2) .info-icon {
  filter: grayscale(1) brightness(0.7);
  opacity: 0.7;
}
.info-item:last-child .info-icon {
  background: transparent;
  color: #1976d2;
  filter: none;
  opacity: 1;
}
.section-title {
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 16px;
  color: #000;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.lang-list-block {
  width: 100%;
}
.lang-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.lang-item {
  display: flex;
  align-items: center;
  gap: 11px;
}
.lang-avatar {
  width: 24px;
  height: 24px;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  font-weight: 700;
}
.lang-info {
  display: flex;
  flex-direction: column;
}
.lang-name {
  font-size: 10px;
  color: #000;
  font-weight: 500;
}
.lang-level {
  font-size: 8px;
  color: #888;
}
.skills-block {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-content: flex-start;
  justify-content: flex-start;
  flex: 1;
}
.skill-badge {
  background: transparent;
  color: #222;
  font-size: 9px;
  font-weight: 700;
  padding: 0;
  margin: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  min-width: 40px;
}
.skill-text {
  display: block;
  line-height: 1;
}
.skill-badge:hover {
  background: #10b981;
  color: #fff;
}
.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0;
  padding: 0;
  width: 100%;
}
.heading {
  margin-bottom: 16px;
  letter-spacing: 2px;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  border: none;
  padding: 0;
  margin-left: 0;
  color: #222;
}
.card {
  background: none;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  margin-bottom: 21px;
  margin-left: 0;
  width: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 4px;
}
.card-title {
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 0;
  color: #222;
  border: none;
  padding: 0;
  letter-spacing: 0;
  text-transform: none;
  flex: 1;
}
.card-period {
  font-style: italic;
  font-size: 11px;
  color: #666;
  text-align: right;
  flex-shrink: 0;
  min-width: 93px;
}
.card-subtitle {
  font-style: italic;
  font-size: 12px;
  color: #666;
  margin-bottom: 7px;
}
.card-description {
  font-size: 14px;
  color: #444;
  margin-bottom: 8px;
  text-align: justify;
}
.card-footer {
  font-size: 10px;
  color: #444;
  margin-bottom: 5px;
  text-align: justify;
}
.link {
  color: #1976d2;
  text-decoration: underline;
}
.email-link {
  color: #000;
  text-decoration: none;
}
.mb-24 {
  margin-bottom: 16px;
}
.text-justify {
  text-align: justify !important;
}
@media (max-width: 800px) {
  .container {
    width: 100%;
    padding: 5px;
    border-radius: 0;
  }
}
</style>
