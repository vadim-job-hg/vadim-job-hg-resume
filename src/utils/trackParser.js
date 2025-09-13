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

function extractTCXTracks(tcx) {
  const tracks = [];
  const activities = tcx.Activities?.Activity
    ? Array.isArray(tcx.Activities.Activity)
      ? tcx.Activities.Activity
      : [tcx.Activities.Activity]
    : [];

  activities.forEach(activity => {
    const laps = activity.Lap
      ? Array.isArray(activity.Lap)
        ? activity.Lap
        : [activity.Lap]
      : [];
    laps.forEach(lap => {
      const track = lap.Track;
      if (!track || !track.Trackpoint) return;
      const trackpoints = Array.isArray(track.Trackpoint)
        ? track.Trackpoint
        : [track.Trackpoint];
      tracks.push({
        points: trackpoints.map(tp => ({
          lat: parseFloat(tp.Position?.LatitudeDegrees),
          lng: parseFloat(tp.Position?.LongitudeDegrees)
        })).filter(pt => pt.lat && pt.lng)
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
    if (result.TrainingCenterDatabase) return extractTCXTracks(result.TrainingCenterDatabase);
    return [];
  }
  if (format === 'fit') {
    const buffer = await file.arrayBuffer();
    return []; // FIT support can be added if needed
  }
  throw new Error('Unsupported file format');
}
