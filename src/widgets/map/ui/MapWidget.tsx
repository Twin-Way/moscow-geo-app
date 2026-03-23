import { useMemo, useCallback } from 'react';
import { useGeoObjects } from '../../../entities/geo-object/api';
import { useUIStore } from '../../../entities/geo-object/model';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import { GeoObjectModal } from './GeoObjectModal';
import { AddObjectForm } from '../../add-object-form';
import { Button } from '@mui/material';
import type { Feature } from 'geojson';

function getColorByType(type: string): [number, number, number] {
  switch (type) {
    case 'custom':
      return [150, 150, 150];
    case 'metro':
      return [0, 0, 255];
    case 'bus_tram':
      return [255, 0, 0];
    case 'mcd':
      return [0, 200, 0];
    case 'mck':
      return [255, 165, 0];
    case 'pedestrian':
      return [255, 0, 255];
    case 'district':
      return [0, 150, 255, 50];
    default:
      return [150, 150, 150];
  }
}

export const MapWidget = () => {
  const { data } = useGeoObjects();
  const features = data?.features || [];
  const { select, addMode, tempCoords, setTempCoords, setAddMode } = useUIStore();
  const isAdding = addMode;

  const osmLayer = useMemo(
    () =>
      new TileLayer({
        id: 'osm',
        data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
        minZoom: 0,
        maxZoom: 19,
        tileSize: 256,
        renderSubLayers: (props) => {
          const bbox = props.tile.bbox as any;
          const { west, south, east, north } = bbox;

          return new BitmapLayer(props, {
            data: undefined,
            image: props.data,
            bounds: [west, south, east, north],
          });
        },
      }),
    []
  );

  const districtLayer = useMemo(
    () =>
      new GeoJsonLayer({
        id: 'districts',
        data: features.filter((f) => f.properties?.type === 'district'),
        filled: true,
        stroked: true,
        getFillColor: (d: Feature) => getColorByType(d.properties?.type as string),
        getLineColor: [0, 0, 0],
        pickable: true,
        onClick: (info) => {
          if (info.object) {
            select(info.object);
          }
        },
      }),
    [features, select]
  );

  const pedestrianLayer = useMemo(
    () =>
      new GeoJsonLayer({
        id: 'pedestrian',
        data: features.filter((f) => f.properties?.type === 'pedestrian'),
        stroked: true,
        filled: false,
        getLineColor: (d: Feature) => getColorByType(d.properties?.type as string),
        getLineWidth: 2,
        pickable: true,
        onClick: (info) => {
          if (info.object) {
            select(info.object);
          }
        },
      }),
    [features, select]
  );

  const pointsLayer = useMemo(
    () =>
      new GeoJsonLayer({
        id: 'points',
        data: features.filter(
          (f) => f.properties?.type !== 'district' && f.properties?.type !== 'pedestrian'
        ),
        pointRadiusMinPixels: 4,
        pointRadiusMaxPixels: 8,
        getFillColor: (d: Feature) => getColorByType(d.properties?.type as string),
        pickable: !isAdding,
        onClick: (info) => {
          if (info.object) {
            select(info.object);
          }
        },
      }),
    [features, isAdding, select]
  );

  const prewiewLayer = useMemo(
    () =>
      tempCoords
        ? new GeoJsonLayer({
            id: 'preview',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: tempCoords,
              },
              properties: {
                type: 'preview',
              },
            },
            pointRadiusMinPixels: 4,
            pointRadiusMaxPixels: 8,
            getFillColor: [0, 0, 0],
            pickable: false,
          })
        : null,
    [tempCoords]
  );

  const layers = useMemo(
    () => [osmLayer, districtLayer, pedestrianLayer, prewiewLayer, pointsLayer].filter(Boolean),
    [osmLayer, districtLayer, pedestrianLayer, prewiewLayer, pointsLayer]
  );

  const handleDeckClick = useCallback(
    (info: any) => {
      if (addMode) {
        if (info.coordinate) {
          setTempCoords(info.coordinate as [number, number]);
        }
        return;
      }
      if (info.object) {
        select(info.object);
      }
    },
    [addMode, setTempCoords, select]
  );

  const getCursor = useCallback(() => (addMode ? 'crosshair' : 'grab'), [addMode]);

  const handleAddButtonClick = useCallback(() => setAddMode(true), [setAddMode]);

  return (
    <>
      <Button
        variant={addMode ? 'outlined' : 'contained'}
        onClick={handleAddButtonClick}
        sx={{ position: 'fixed', top: 20, left: 20, zIndex: 1000 }}
      >
        Добавить точку
      </Button>
      <DeckGL
        initialViewState={{
          longitude: 37.6173,
          latitude: 55.7558,
          zoom: 10,
        }}
        controller
        layers={layers}
        onClick={handleDeckClick}
        getCursor={getCursor}
      />
      <GeoObjectModal />
      <AddObjectForm />
    </>
  );
};
