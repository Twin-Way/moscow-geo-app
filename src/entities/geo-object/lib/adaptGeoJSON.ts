import type { FeatureCollection, Feature } from 'geojson';
import type { AdaptedGeoObject } from '../model';

export function adaptGeoJSON(geojson: FeatureCollection, type: string): AdaptedGeoObject[] {
  return geojson.features.map((feature: Feature): AdaptedGeoObject => {
    const props = feature.properties;
    const name = props?.name ?? 'Без названия';

    return {
      id: String(props?.id ?? props?.fid ?? crypto.randomUUID()),
      type,
      name,
      description: props?.description ?? '',
      geometry: feature.geometry,
      meta: {
        lines: props?.lines,
        ...props,
      },
    };
  });
}
