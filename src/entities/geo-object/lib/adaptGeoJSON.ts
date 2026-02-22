export function adaptGeoJSON(geojson: any, type: string) {
  return geojson.features.map((feature: any) => {
    const props = feature.properties;
    const name = props.name ?? 'Без названия';

    return {
      id: String(props.id ?? props.fid ?? crypto.randomUUID()),
      type,
      name,
      description: props.description ?? '',
      geometry: feature.geometry,
      meta: {
        lines: props.lines,
        ...props,
      },
    };
  });
}
