import L from 'leaflet';
import { parseTrackFile } from './trackParser';
import Image from './image.js';

const LINE_COLORS = {
  Hike: '#bd07ef',
  Walk: '#f1d205',
  Run: '#ff0000',
  Ride: '#ff3a00',
  Default: '#e8aa0c',
  SUPER: '#ef8900'
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clearMap(map) {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });
}

export async function playStory(map, storyFile = '/files/kharkiv.json') {
  try {
    // Очищаем карту перед запуском новой истории
    clearMap(map);

    const response = await fetch(storyFile);
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
              let weight = 1;
              let opacity = 0.5;
              if (item?.style) {
                color = item?.style?.color || LINE_COLORS.Default;
                weight = item?.style?.weight || 1;
                opacity = item?.style?.opacity || 0.5;
              }
              else if (item.activity_type === 'Hike' || item.activity_type === 'Walk') color = LINE_COLORS.Hike;
              else if (item.activity_type === 'Run') color = LINE_COLORS.Run;
              else if (item.activity_type === 'Ride') color = LINE_COLORS.Ride;
              L.polyline(track.points, {
                color,
                weight: weight,
                opacity: opacity
              }).addTo(map);
            });
          } catch (e) {
            console.error('Track parse error:', e);
            console.log(item);
          }
        } else if (item.type === 'image') {
          try {
            const lat = await item.lat;
            const lng = await item.lng;
            const markerOptions = {
              color: '#00FF00',
              weight: 3,
              radius: 5,
              opacity: 0.5
            };
            const marker = L.circleMarker([lat, lng], markerOptions)
              .on('click', async () => {
                L.popup({ maxWidth: 400 })
                  .setLatLng([lat, lng])
                  .setContent(`<img src="${item.path}" width="512" height="100%">`)
                  .openOn(map);
              })
              .addTo(map);
          } catch (e) {
            console.error('Image geolocation error:', e);
          }
        } else if (item.type === 'pause') {
          await sleep(item.seconds * 1000);
        } else if (item.type === 'map') {
          map.flyTo(item.center, item.zoom, { animate: true, duration: item.duration });
        }
      }
    }
  } catch (error) {
    console.error('Error playing story:', error);
  }
}
