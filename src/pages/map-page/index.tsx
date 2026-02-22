import { Box } from '@mui/material';
import { AddObjectForm } from '../../widgets/add-object-form';
import { MapWidget } from '../../widgets/map';

export const MapPage = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flex: 1 }}>
        <MapWidget />
      </Box>
      <AddObjectForm />
    </Box>
  );
};
