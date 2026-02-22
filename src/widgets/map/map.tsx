import { useGeoObjects } from '../../entities/geo-object/api';
import { useUIStore } from '../../entities/geo-object/model';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, PolygonLayer, PathLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import type { FeatureCollection } from 'geojson';

function getColorByType(type: string) {
    switch (type) {
        case "metro": return [0, 0, 255];
        case "bus_tram": return [255, 0, 0];
        case "mcd": return [0, 200, 0];
        case "mck": return [255, 165, 0];
        case "pedestrian": return [255, 0, 255];
        case "district": return [0, 255, 255];
        default: return [150, 150, 150];
    }
}


export const MapWidget = () => {
    const { data = { type: 'FeatureCollection', features: [] } as FeatureCollection } = useGeoObjects();
    const { select } = useUIStore();
    const features = data?.features || [];

    const osmLayer = new TileLayer({
    id: "osm",
    data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    renderSubLayers: (props) => {
      const tile = props.tile as any;
      const { west, south, east, north } = tile.bbox;

      return new BitmapLayer(props, {
        data: undefined,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  });

    const layers = [
        osmLayer,
        new ScatterplotLayer({
            id: 'points',
            data: (features || []).filter((d: any)=> d.geometry.type === "Point"),
            getPosition: (d: any) => d.geometry.coordinates as [number, number], //number
            radiusMinPixels: 4,
            radiusMaxPixels: 8,
            pickable: true,
            getFillColor: (d: any) => getColorByType(d.properties?.type as string) as any,
            onClick: (info) => {
                if (info.object) {
                    select(info.object.id);
                }
            }
        }),
        new PolygonLayer({
            id: 'polygons',
            data: (features || []).filter((d: any)=> d.geometry.type === "Polygon"),
            getPolygon: (d: any) => d.geometry.coordinates, //number
            getFillColor: [0, 200, 0, 80],
        }),
        new PathLayer({
            id: 'lines',
            data: (features || []).filter((d: any)=> d.geometry.type === "LineString"),
            getPath: (d: any) => d.geometry.coordinates, //number
            getColor: [200, 120, 0],
            getWidth: 3,
        })
    ]

  return (
    <DeckGL initialViewState={{
        longitude: 37.6173,
        latitude: 55.7558,
        zoom: 10,
    }} controller layers={layers} />
  )
}