import { XMLParser } from 'fast-xml-parser';
import EasyFit from 'easy-fit';
import Pako from 'pako';

function extractGPXTracks(gpx) {
  const tracks = [];
  const trks = Array.isArray(gpx.trk) ? gpx.trk : gpx.trk ? [gpx.trk] : [];
  trks.forEach(trk => {
    const trksegs = Array.isArray(trk.trkseg) ? trk.trkseg : trk.trkseg ? [trk.trkseg] : [];
    trksegs.forEach(trkseg => {
      const points = Array.isArray(trkseg.trkpt) ? trkseg.trkpt : trkseg.trkpt ? [trkseg.trkpt] : [];
      tracks.push({
        points: points.map(pt => ({
          lat: parseFloat(pt['@_lat']),
          lng: parseFloat(pt['@_lon'])
        }))
      });
    });
  });
  return tracks;
}

export async function parseTrackFile(file) {
  const isGzipped = /\.gz$/i.test(file.name);
  const strippedName = file.name.replace(/\.gz$/i, '');
  const format = strippedName.split('.').pop().toLowerCase();

  if (format === 'gpx' || format === 'tcx') {
    const text = await file.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const result = parser.parse(text);
    if (result.gpx) return extractGPXTracks(result.gpx);
    // Add TCX support if needed
    return [];
  }
  if (format === 'fit') {
    const buffer = await file.arrayBuffer();
    return []; // FIT support can be added if needed
  }
  throw new Error('Unsupported file format');
}