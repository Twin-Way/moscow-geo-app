import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '../../entities/geo-object/model';
import { useState } from 'react';
import { Box, Button, Drawer, TextField, MenuItem } from '@mui/material';

export const AddObjectForm = () => {
  const { addMode, tempCoords, setAddMode, setTempCoords } = useUIStore();
  const [name, setName] = useState('');
  const [type, setType] = useState('custom');
  const [description, setDescription] = useState('');

  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!tempCoords) return;

      await fetch('/api/geo', {
        method: 'POST',
        body: JSON.stringify({
          type: 'Feature',
          properties: {
            name: name,
            type,
            description,
          },
          geometry: {
            type: 'Point',
            coordinates: tempCoords,
          },
        }),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['geo'] });
      setAddMode(false);
      setTempCoords(null);
      setName('');
      setType('custom');
      setDescription('');
    },
  });

  if (!addMode) return null;

  return (
    <Drawer anchor="right" open variant="persistent">
      <Box sx={{ p: 3, width: 300 }}>
        <TextField
          label="Название"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          select
          label="Тип"
          fullWidth
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="metro">Метро</MenuItem>
          <MenuItem value="mcd">МЦД</MenuItem>
          <MenuItem value="mck">МЦК</MenuItem>
          <MenuItem value="bus_tram">Автобус/Трамвай</MenuItem>
          <MenuItem value="street">Улица</MenuItem>
          <MenuItem value="district">Район</MenuItem>
          <MenuItem value="custom">Другое</MenuItem>
        </TextField>
        <TextField
          label="Описание"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ mt: 2 }}>
          {tempCoords ? (
            <>
              Координаты: {tempCoords[0].toFixed(5)}, {tempCoords[1].toFixed(5)}
            </>
          ) : (
            'Кликните по карте, чтобы выбрать координаты'
          )}
        </Box>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          fullWidth
          disabled={!name || !tempCoords}
          onClick={() => mutation.mutate()}
        >
          Сохранить
        </Button>
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          fullWidth
          onClick={() => {
            setAddMode(false);
            setTempCoords(null);
          }}
        >
          Отмена
        </Button>
      </Box>
    </Drawer>
  );
};
