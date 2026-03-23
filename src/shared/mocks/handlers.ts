import { http, HttpResponse } from 'msw';
import { adaptGeoJSON } from '../../entities/geo-object/lib';
import type { AdaptedGeoObject } from '../../entities/geo-object/model';
import type { Geometry } from 'geojson';
import metroRaw from './data/metro_station.geojson?raw';
import busRaw from './data/bus_tram_stops.geojson?raw';
import mcdRaw from './data/mcd_station.geojson?raw';
import mckRaw from './data/mck_station.geojson?raw';
import streetsRaw from './data/streets_pedestrian.geojson?raw';
import districtRaw from './data/district_layer.geojson?raw';

const metro = JSON.parse(metroRaw);
const bus = JSON.parse(busRaw);
const mcd = JSON.parse(mcdRaw);
const mck = JSON.parse(mckRaw);
const streets = JSON.parse(streetsRaw);
const district = JSON.parse(districtRaw);

// Функция для загрузки кастомных точек из localStorage
const loadCustomObjects = (): AdaptedGeoObject[] => {
  try {
    const stored = localStorage.getItem('customGeoObjects');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Ошибка загрузки кастомных точек:', e);
    return [];
  }
};

// Функция для сохранения кастомных точек в localStorage
const saveCustomObjects = (customObjects: AdaptedGeoObject[]) => {
  try {
    localStorage.setItem('customGeoObjects', JSON.stringify(customObjects));
  } catch (e) {
    console.error('Ошибка сохранения кастомных точек:', e);
  }
};

const objects = [
  ...adaptGeoJSON(metro, 'metro'),
  ...adaptGeoJSON(bus, 'bus_tram'),
  ...adaptGeoJSON(mcd, 'mcd'),
  ...adaptGeoJSON(mck, 'mck'),
  ...adaptGeoJSON(streets, 'pedestrian'),
  ...adaptGeoJSON(district, 'district'),
  ...loadCustomObjects(), // Загружаем сохранённые кастомные точки
];

export const handlers = [
  http.get('/api/geo', () => {
    return HttpResponse.json(objects);
  }),

  http.post('/api/geo', async ({ request }) => {
    const featureData = (await request.json()) as {
      properties?: Record<string, unknown>;
      geometry?: Geometry;
    };
    const selectedType = featureData.properties?.type;
    const newObj: AdaptedGeoObject = {
      id: crypto.randomUUID(),
      type: 'custom',
      name: String(featureData.properties?.name || 'Без названия'),
      description: String(featureData.properties?.description || ''),
      geometry: featureData.geometry!,
      meta: {
        selectedType,
        ...featureData.properties,
      },
    };
    objects.push(newObj);

    // Сохраняем кастомные точки в localStorage
    const customObjects = objects.filter((obj) => obj.type === 'custom');
    saveCustomObjects(customObjects);

    return HttpResponse.json(newObj);
  }),
];
