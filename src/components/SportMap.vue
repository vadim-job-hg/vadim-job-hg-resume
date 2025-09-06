<template>
  <div id="map" style="height: 500px;"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx';
import 'leaflet-easybutton';
import 'leaflet-providers';
import 'leaflet.fullscreen';
import 'leaflet.fullscreen/Control.FullScreen.css';
import { parseTrackFile } from '../utils/trackParser';

const LINE_COLORS = {
  Hike: '#efdc07',
  Walk: '#f1d205',
  Run: '#ff0000',
  Ride: '#a30a0a',
  Default: '#e8aa0c'
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {
  const map = L.map('map', {
    center: [49.9935, 36.2304],
    zoom: 10,
    preferCanvas: true,
    fullscreenControl: true
  });

  L.tileLayer.provider('CartoDB.DarkMatter').addTo(map);

  L.easyButton('fa-camera', () => {
    window.alert('Export as PNG not implemented');
  }, 'Export as PNG').addTo(map);

  L.easyButton('fa-filter', () => {
    window.alert('Filter tracks not implemented');
  }, 'Filter tracks').addTo(map);

  const response = await fetch('/files/story.json');
  const data = await response.json();

  if (data.timeline && Array.isArray(data.timeline)) {
    for (const item of data.timeline) {
      if (item.type === 'track') {
        const res = await fetch(item.path);
        const blob = await res.blob();
        blob.name = item.path.split('/').pop();
        try {
          const tracks = await parseTrackFile(blob);
          tracks.forEach(track => {
            let color = LINE_COLORS.Default;
            if (item.activity_type === 'Hike' || item.activity_type === 'Walk') color = LINE_COLORS.Hike;
            else if (item.activity_type === 'Run') color = LINE_COLORS.Run;
            else if (item.activity_type === 'Ride') color = LINE_COLORS.Ride;
            const polyline = L.polyline(track.points, {
              color,
              weight: 1,
              opacity: 0.5
            }).addTo(map);
          });
        } catch (e) {
          console.error('Track parse error:', e);
          console.log(item);
        }
      } else if (item.type === 'image') {
        if (typeof item.lat !== 'number' || typeof item.lng !== 'number') continue;
        const marker = L.marker([item.lat, item.lng]).addTo(map);
        marker.on('click', () => {
          L.popup({ minWidth: 256 })
            .setLatLng([item.lat, item.lng])
            .setContent(`<img src="${item.path}" alt="Image" style="max-width:240px;max-height:240px;">`)
            .openOn(map);
        });
      } else if (item.type === 'pause') {
        await sleep(item.seconds * 1000);
      } else if (item.type === 'map') {
        map.flyTo(item.center, item.zoom, { animate: true, duration: item.duration });
      }
    }
  }
});
</script>

<style>
#map {
  width: 100%;
  height: 500px;
}
.leaflet-container:fullscreen {
  width: 100vw !important;
  height: 100vh !important;
}
</style>
