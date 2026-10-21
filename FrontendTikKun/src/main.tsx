// Punto de entrada: monta React y carga los estilos globales.
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from '@/aplicacion/App';
import '@/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
