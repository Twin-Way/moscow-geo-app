import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { worker } from './shared/mocks';
import { CssBaseline } from '@mui/material';

const queryClient = new QueryClient();

async function enableMocking() {
  if (import.meta.env.DEV) {
    await worker.start();
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <App />
      </QueryClientProvider>
    </StrictMode>
  );
});
