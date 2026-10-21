// Aísla las consultas y cambios del catálogo de alojamientos.
import type { Cabana, GuardarCabanaDTO } from '@/compartido/tipos';
import { api } from '@/compartido/api/api';

// Las fechas las genera Neon/Prisma y la API las devuelve como metadatos de lectura.
function stripServerTimestamps<T extends object>(record: T): T {
  const payload = { ...record } as T & { createdAt?: unknown; updatedAt?: unknown };
  delete payload.createdAt;
  delete payload.updatedAt;
  return payload;
}

export const accommodationsService = {
  list(): Promise<Cabana[]> { return api.get('/cabins'); },
  create(cabin: GuardarCabanaDTO): Promise<Cabana> {
    const { id: _temporaryId, ...payload } = cabin;
    return api.post('/cabins', payload);
  },
  update(cabin: GuardarCabanaDTO): Promise<Cabana> {
    return api.put(`/cabins/${encodeURIComponent(cabin.id)}`, stripServerTimestamps(cabin));
  },
  async remove(id: string): Promise<void> { await api.delete(`/cabins/${encodeURIComponent(id)}`); },
};
