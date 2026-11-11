import test from 'node:test';
import assert from 'node:assert/strict';
import { MapMarker } from '../types/pda';
import { createUkraineWorldMarkers, ensureUkraineWorldMarkers, getMapMarkerCoordinates, randomizeMapObjectPositions } from './mapWorld';

test('creates fictional artifact locations in every Ukrainian oblast and city', () => {
  const generated = createUkraineWorldMarkers();
  const regions = new Set(generated.map((marker) => marker.regionId));

  assert.equal(regions.size, 27);
  assert.equal(generated.length, 81);
  assert.ok(generated.every((marker) => marker.geoLat! >= 44 && marker.geoLat! <= 52));
  assert.ok(generated.every((marker) => marker.geoLon! >= 22 && marker.geoLon! <= 41));
  assert.ok(generated.some((marker) => marker.loot?.some((item) => item.includes('Артефакт'))));
});

test('reshuffles world artifacts in their oblast and retains fixed landmarks', () => {
  const ivanoMarker = createUkraineWorldMarkers().find((marker) => marker.regionId === 'ivano-frankivsk')!;
  const markers: MapMarker[] = [
    ivanoMarker,
    { id: 'landmark', nameUk: '', nameEn: '', type: 'landmark', sector: 'zhytomyr-osm', x: 50, y: 50, geoLat: 50.25, geoLon: 28.66 }
  ];

  const [anomaly, landmark] = randomizeMapObjectPositions(markers);
  const [lat, lon] = getMapMarkerCoordinates(anomaly);

  assert.ok(lat >= 48.4 && lat <= 49.05);
  assert.ok(lon >= 24.5 && lon <= 25.3);
  assert.equal(anomaly.regionId, 'ivano-frankivsk');
  assert.equal(landmark.geoLat, 50.25);
  assert.equal(landmark.geoLon, 28.66);
});

test('falls back to the marker sector for markers without GPS coordinates', () => {
  const marker: MapMarker = { id: 'waypoint', nameUk: '', nameEn: '', type: 'custom', sector: 'lesser-zone', x: 50, y: 50 };
  const [lat, lon] = getMapMarkerCoordinates(marker);

  assert.equal(lat, 51.285);
  assert.equal(lon, 30.205);
});

test('adds world content once when upgrading existing saved maps', () => {
  const initial: MapMarker[] = [
    { id: 'stash', nameUk: '', nameEn: '', type: 'stash', x: 0, y: 0 },
    { id: 'ukraine-world-ivano-frankivsk-1', nameUk: 'Saved anomaly', nameEn: 'Saved anomaly', type: 'anomaly', x: 50, y: 50, geoLat: 48.9, geoLon: 24.7 }
  ];
  const migrated = ensureUkraineWorldMarkers(initial);

  assert.equal(migrated.length, 82);
  assert.equal(migrated[1].regionId, 'ivano-frankivsk');
  assert.equal(migrated[1].nameUk, 'Saved anomaly');
  assert.equal(migrated[1].geoLat, 48.9);
  assert.equal(ensureUkraineWorldMarkers(migrated).length, migrated.length);
});
