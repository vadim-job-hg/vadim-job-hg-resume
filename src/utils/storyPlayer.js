import L from 'leaflet';
import { parseTrackFile } from './trackParser';

const LINE_COLORS = {
  Hike: '#bd07ef',
  Walk: '#f1d205',
  Run: '#ff0000',
  Ride: '#ff3a00',
  Default: '#e8aa0c',
  SUPER: '#ef8900',
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clearMap(map) {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });
}

function getLineStyle(item) {
  if (item?.style) {
    return {
      color: item.style.color || LINE_COLORS.Default,
      weight: item.style.weight || 1,
      opacity: item.style.opacity || 0.5,
    };
  }
  switch (item.activity_type) {
    case 'Hike':
    case 'Walk':
      return { color: LINE_COLORS.Hike, weight: 1, opacity: 0.5 };
    case 'Run':
      return { color: LINE_COLORS.Run, weight: 1, opacity: 0.5 };
    case 'Ride':
      return { color: LINE_COLORS.Ride, weight: 1, opacity: 0.5 };
    default:
      return { color: LINE_COLORS.Default, weight: 1, opacity: 0.5 };
  }
}

async function drawTrack(map, item) {
  try {
    const res = await fetch(item.path);
    const blob = await res.blob();
    blob.name = item.path.split('/').pop();
    const tracks = await parseTrackFile(blob);
    tracks.forEach((track) => {
      const style = getLineStyle(item);
      L.polyline(track.points, style).addTo(map);
    });
  } catch (e) {
    console.error('Track parse error:', e);
    console.log(item);
  }
}

function addImageMarker(map, item, onImageClick) {
  try {
    const lat = item.lat;
    const lng = item.lng;
    if (lat && lng) {
      const markerOptions = {
        color: '#00FF00',
        weight: 3,
        radius: 5,
        opacity: 0.5,
      };
      L.circleMarker([lat, lng], markerOptions)
        .on('click', () => {
          if (onImageClick) {
            onImageClick(item.path);
          }
        })
        .addTo(map);
    }
  } catch (e) {
    console.error('Image geolocation error:', e);
  }
}

async function handleTimelineItem(map, item, onImageClick) {
  if (item.type === 'track') {
    await drawTrack(map, item);
  } else if (item.type === 'image') {
    addImageMarker(map, item, onImageClick);
  } else if (item.type === 'pause') {
    await sleep(item.seconds * 1000);
  } else if (item.type === 'map') {
    map.flyTo(item.center, item.zoom, { animate: true, duration: item.duration });
  }
}

export async function playStory(map, storyFile = '/files/kharkiv.json', onImageClick) {
  try {
    clearMap(map);
    const response = await fetch(storyFile);
    const data = await response.json();
    if (data.timeline && Array.isArray(data.timeline)) {
      for (const item of data.timeline) {
        await handleTimelineItem(map, item, onImageClick);
      }
    }
  } catch (error) {
    console.error('Error playing story:', error);
  }
}
