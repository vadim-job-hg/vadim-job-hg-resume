<template>
  <div class="map-container">
    <div class="map-controls">
      <button class="story-button" @click="handlePlayStory">Play Story</button>
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

const LINE_COLORS = {
  Hike: '#efdc07',
  Walk: '#f1d205',
  Run: '#ff0000',
  Ride: '#a30a0a',
  Default: '#e8aa0c'
};

const mapInstance = ref(null);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const handlePlayStory = () => {
  if (mapInstance.value) {
    playStory(mapInstance.value);
  }
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

  // Add fullscreen button
  L.easyButton('fa-expand', () => {
    map.toggleFullscreen();
  }, 'Toggle fullscreen').addTo(map);

  // Story button is now outside the map
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
}

.story-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.story-button:hover {
  background-color: #45a049;
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
