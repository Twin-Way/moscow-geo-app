import { Box, Typography, Stack, Paper, Button } from '@mui/material';
import { useUIStore } from '../../../entities/geo-object/model';

export const GeoObjectModal = () => {
  const selected = useUIStore((s) => s.selectedFeature);

  if (!selected) return null;

  const props = selected.properties || {};
  const type = props.type;

  const stationFields = [
    { label: 'Название станции', key: 'name_station' },
    { label: 'Линия', key: 'name_line' },
    { label: 'Статус', key: 'status' },
    { label: 'Тип', key: 'type' },
    { label: 'Зона', key: 'area' },
    { label: 'Адм. район', key: 'administrative_district' },
    { label: 'Номер линии', key: 'no_line' },
  ];

  const fieldConfig: Record<string, { label: string; key: string }[]> = {
    bus_tram: [
      { label: 'Название остановки', key: 'name_mpv' },
      { label: 'Район', key: 'rayon' },
      { label: 'Округ', key: 'ao' },
      { label: 'Адресс остановки', key: 'address_mpv' },
      { label: 'Маршрут', key: 'marshrut' },
    ],
    metro: stationFields,
    mcd: stationFields,
    mck: stationFields,
    district: [
      { label: 'Название района', key: 'NAME' },
      { label: 'Название округа', key: 'NAME_AO' },
    ],
    pedestrian: [
      { label: 'Название улицы', key: 'ST_NAME' },
      { label: 'Тип улицы', key: 'ST_TYP_BEF' },
    ],
    custom: [
      { label: 'Название', key: 'name' },
      { label: 'Выбранный тип', key: 'selectedType' },
      { label: 'Описание', key: 'description' },
    ],
  };

  const displayFields = fieldConfig[type] || [];

  // Проверяем, есть ли хотя бы одно значимое поле для отображения
  const hasData = displayFields.some(({ key }) => props[key]);

  if (!hasData) return null;

  return (
    <Paper
      sx={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        zIndex: 1000,
        maxWidth: 500,
        width: '90%',
        maxHeight: '70vh',
        overflowY: 'auto',
      }}
    >
      <Stack spacing={2}>
        {displayFields.map(({ label, key }) => {
          const value = props[key];
          if (!value) return null;

          return (
            <Box key={key}>
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="body1">{String(value)}</Typography>
            </Box>
          );
        })}

        <Button
          onClick={() => useUIStore.getState().select(null)}
          variant="contained"
          sx={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Закрыть
        </Button>
      </Stack>
    </Paper>
  );
};
