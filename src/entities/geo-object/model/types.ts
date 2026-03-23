import type { Geometry } from 'geojson';

export interface AdaptedGeoObject {
  id: string;
  type: string;
  name: string;
  description: string;
  geometry: Geometry;
  meta: Record<string, unknown>;
}
