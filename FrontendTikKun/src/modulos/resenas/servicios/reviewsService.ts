// Encapsula la comunicación con los endpoints de reseñas.
import type { CrearResenaDTO, Resena, ResenaAdministracion } from '@/compartido/tipos';
import { api } from '@/compartido/api/api';

export const reviewsService = {
  list(): Promise<Resena[]> { return api.get('/reviews'); },

  create(input: CrearResenaDTO): Promise<{ recibido: boolean; pendienteAprobacion: boolean }> {
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

  listForAdmin(): Promise<ResenaAdministracion[]> { return api.get('/reviews/admin'); },

  approve(id: string): Promise<Resena> {
    return api.post(`/reviews/${encodeURIComponent(id)}/approve`, {});
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/reviews/${encodeURIComponent(id)}`);
  },
};
