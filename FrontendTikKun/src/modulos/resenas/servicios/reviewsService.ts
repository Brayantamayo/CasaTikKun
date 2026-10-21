// Encapsula la comunicación con los endpoints de reseñas.
import type { CrearResenaDTO, Resena } from '@/compartido/tipos';
import { api } from '@/compartido/api/api';

export const reviewsService = {
  list(): Promise<Resena[]> { return api.get('/reviews'); },

  create(input: CrearResenaDTO): Promise<Resena> {
    return api.post('/reviews', {
      guestName: input.nombreHuesped,
      email: input.correoHuesped,
      guestCity: input.ciudadHuesped,
      rating: input.calificacion,
      cabinId: input.cabanaId,
      comment: input.comentario,
      travelType: input.tipoViaje || 'En Pareja',
    });
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/reviews/${encodeURIComponent(id)}`);
  },
};
