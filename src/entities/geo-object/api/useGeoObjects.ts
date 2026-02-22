import { useQuery } from '@tanstack/react-query';
import type { Feature, FeatureCollection } from 'geojson';

export const useGeoObjects = () =>
  useQuery<FeatureCollection>({
    queryKey: ['geo'],
    queryFn: async () => {
      const res = await fetch('/api/geo');
      const data = await res.json();

      const features: Feature[] = data.map((d: any) => ({
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
