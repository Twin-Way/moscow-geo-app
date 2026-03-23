import { useQuery } from '@tanstack/react-query';
import type { Feature, FeatureCollection } from 'geojson';
import type { AdaptedGeoObject } from '../model';

export const useGeoObjects = () =>
  useQuery<FeatureCollection>({
    queryKey: ['geo'],
    queryFn: async () => {
      const res = await fetch('/api/geo');
      const data: AdaptedGeoObject[] = await res.json();

      const features: Feature[] = data.map((d: AdaptedGeoObject) => ({
        type: 'Feature',
        geometry: d.geometry,
        properties: {
          id: d.id,
          ...d.meta,
          name: d.name,
          description: d.description,
          type: d.type,
        },
      }));
      return { type: 'FeatureCollection', features };
    },
  });
