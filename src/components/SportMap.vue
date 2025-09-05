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
import { parseTrackFile } from '../utils/trackParser';

const LINE_COLORS = {
  Hike: '#ffc0cb',
  Walk: '#ffc0cb',
  Run: '#ff0000',
  Ride: '#00ffff',
  Default: '#0CB1E8'
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {
  const map = L.map('map', {
    center: [34.0522, -118.243],
    zoom: 10,
    preferCanvas: true
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
            if (/-(Hike|Walk)\.gpx/.test(blob.name)) color = LINE_COLORS.Hike;
            else if (/-Run\.gpx/.test(blob.name)) color = LINE_COLORS.Run;
            else if (/-Ride\.gpx/.test(blob.name)) color = LINE_COLORS.Ride;
            const polyline = L.polyline(track.points, {
              color,
              weight: 1,
              opacity: 0.5
            }).addTo(map);
            map.fitBounds(polyline.getBounds(), { padding: [50, 20] });
          });
        } catch (e) {
          console.error('Track parse error:', e);
        }
      } else if (item.type === 'image') {
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
</style>