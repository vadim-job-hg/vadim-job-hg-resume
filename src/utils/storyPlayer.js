import L from 'leaflet';
import { parseTrackFile } from './trackParser';

const LINE_COLORS = {
  Hike: '#bd07ef',
  Walk: '#f1d205',
  Run: '#ff0000',
  Ride: '#ff3a00',
  Default: '#e8aa0c'
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
              if (item.activity_type === 'Hike' || item.activity_type === 'Walk') color = LINE_COLORS.Hike;
              else if (item.activity_type === 'Run') color = LINE_COLORS.Run;
              else if (item.activity_type === 'Ride') color = LINE_COLORS.Ride;
              L.polyline(track.points, {
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
  } catch (error) {
    console.error('Error playing story:', error);
  }
}
