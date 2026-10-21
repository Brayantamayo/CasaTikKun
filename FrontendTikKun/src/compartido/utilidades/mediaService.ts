// Lee y actualiza las listas de imágenes públicas en NestJS.
import type { ConfiguracionMultimediaDTO } from '@/compartido/tipos';
import { api } from '@/compartido/api/api';

export const mediaService = {
  get(): Promise<ConfiguracionMultimediaDTO> { return api.get('/media'); },
  update(config: Partial<ConfiguracionMultimediaDTO>): Promise<ConfiguracionMultimediaDTO> {
    return api.put('/media', config);
  },
};
