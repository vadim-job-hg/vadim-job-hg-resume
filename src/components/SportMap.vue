<template>
  <div id="map" style="height: 500px;"></div>
</template>

<script setup>
import { onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gpx";
import "leaflet-easybutton";
import "leaflet-providers";
import { parseTrackFile } from "../utils/trackParser";

const INIT_COORDS = [34.0522, -118.243];
const LINE_COLORS = {
  Hike: "#ffc0cb",
  Walk: "#ffc0cb",
  Run: "#ff0000",
  Ride: "#00ffff",
  Default: "#0CB1E8"
};

onMounted(async () => {
  const map = L.map("map", {
    center: INIT_COORDS,
    zoom: 10,
    preferCanvas: true
  });

  L.tileLayer.provider("CartoDB.DarkMatter").addTo(map);

  // Add export and filter buttons (placeholders)
  L.easyButton("fa-camera", () => {
    window.alert("Export as PNG not implemented");
  }, "Export as PNG").addTo(map);

  L.easyButton("fa-filter", () => {
    window.alert("Filter tracks not implemented");
  }, "Filter tracks").addTo(map);

  // Fetch track file list
  const response = await fetch("/files/files.json");
  const data = await response.json();

  if (data.story && Array.isArray(data.story)) {
    for (const url of data.story) {

      const res = await fetch(url);
      const blob = await res.blob();
      blob.name = url.split("/").pop();

      try {
        const tracks = await parseTrackFile(blob);

        tracks.forEach(track => {
          // Color detection based on filename
          let color = LINE_COLORS.Default;
          if (/-(Hike|Walk)\.gpx/.test(blob.name)) color = LINE_COLORS.Hike;
          else if (/-Run\.gpx/.test(blob.name)) color = LINE_COLORS.Run;
          else if (/-Ride\.gpx/.test(blob.name)) color = LINE_COLORS.Ride;

          const polyline = L.polyline(track.points, {
            color,
            weight: 1,
            opacity: 0.5
          }).addTo(map);

          // Center map on track
          map.fitBounds(polyline.getBounds(), { padding: [50, 20] });
        });
      } catch (e) {
        console.error("Track parse error:", e);
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