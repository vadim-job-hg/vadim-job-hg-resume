<template>
  <div class="map-container">
    <div class="map-controls">
      <!-- City selector and button -->
      <select v-model="selectedCity" class="city-select">
        <option v-for="(coords, name) in cities" :key="name" :value="name">{{ name }}</option>
      </select>
      <button class="city-button" @click="flyToCity">Go to City</button>
      <button class="story-button" @click="showCityStory">Show Story</button>
    </div>
    <div id="map" style="height: 500px;"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx';
import 'leaflet-easybutton';
import 'leaflet-providers';
import 'leaflet.fullscreen';
import 'leaflet.fullscreen/Control.FullScreen.css';
import { parseTrackFile } from '../utils/trackParser';
import { playStory } from '../utils/storyPlayer';

const cities = {
  Kharkiv: [49.9935, 36.2304],
  Kyiv: [50.4501, 30.5234],
  Odesa: [46.4825, 30.7233],
  Cherkasy: [49.4444, 32.0598],
  Mukachevo: [48.4392, 22.7182],
  Budapest: [47.4979, 19.0402],
  Bucharest: [44.4268, 26.1025],
  Varna: [43.2141, 27.9147],
  Sofia: [42.6977, 23.3219],
};

const selectedCity = ref('Kharkiv');
const mapInstance = ref(null);

const flyToCity = () => {
  if (mapInstance.value && cities[selectedCity.value]) {
    mapInstance.value.flyTo(cities[selectedCity.value], 12);
  }
};

const showCityStory = async () => {
  if (!mapInstance.value) return;
  const cityFile = `/files/${selectedCity.value.toLowerCase()}.json`;
  await playStory(mapInstance.value, cityFile);
};

onMounted(async () => {
  const map = L.map('map', {
    center: [34.0522, -118.243],
    zoom: 10,
    preferCanvas: true,
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: 'topleft'
    }
  });

  mapInstance.value = map;

  L.tileLayer.provider('CartoDB.DarkMatter').addTo(map);

  L.easyButton('fa-camera', () => {
    window.alert('Export as PNG not implemented');
  }, 'Export as PNG').addTo(map);

  L.easyButton('fa-filter', () => {
    window.alert('Filter tracks not implemented');
  }, 'Filter tracks').addTo(map);

  L.easyButton('fa-expand', () => {
    map.toggleFullscreen();
  }, 'Toggle fullscreen').addTo(map);

  // Removed story button
});
</script>

<style>
.map-container {
  width: 100%;
}

.map-controls {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.city-select {
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.2);
  font-size: 14px;
}

.city-button,
.story-button {
  padding: 5px 10px;
  background-color: white;
  color: #333;
  border: 2px solid rgba(0,0,0,0.2);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: normal;
  box-shadow: 0 1px 5px rgba(0,0,0,0.65);
}

.city-button:hover,
.story-button:hover {
  background-color: #f4f4f4;
}

#map {
  width: 100%;
  height: 500px;
}

/* Make map take full screen when in fullscreen mode */
.leaflet-container.leaflet-fullscreen-on {
  width: 100%;
  height: 100vh !important;
}
</style>
