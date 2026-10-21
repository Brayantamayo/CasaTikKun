// Sube y elimina imágenes de Cloudinary mediante el backend seguro.
import { ApiError, api } from '@/compartido/api/api';

// Carpetas disponibles para clasificar los recursos subidos desde el panel administrativo.
type CloudinaryUploadFolder = 'hero' | 'gallery' | 'cabins';

/** Sube una imagen comprimida por el backend autenticado; las credenciales permanecen en el servidor. */
export async function uploadImageToCloudinary(dataUrl: string, folder: CloudinaryUploadFolder): Promise<string> {
  try {
    const result = await api.post<{ url: string }>('/cloudinary/images', { image: dataUrl, folder });
    return result.url;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 403) {
        throw new Error('Tu sesión de administrador venció o no tiene permisos. Inicia sesión nuevamente e inténtalo otra vez.');
      }
      if (error.status === 413) {
        throw new Error('La imagen optimizada aún excede el límite del servidor. Usa una imagen con menos dimensiones o menor tamaño.');
      }
    }
    throw error;
  }
}

/** Elimina de Cloudinary los recursos administrados; URLs externas solo salen de la lista visible. */
export async function deleteImageFromCloudinary(url: string): Promise<boolean> {
  try {
    if (new URL(url).hostname !== 'res.cloudinary.com') return false;
  } catch {
    return false;
  }

  const result = await api.delete<{ deleted: boolean }>('/cloudinary/images', { url });
  return result.deleted;
}

/** Sube las imágenes una por una para limitar memoria y tráfico, conservando el orden. */
export async function uploadImagesToCloudinary(
  dataUrls: string[],
  folder: CloudinaryUploadFolder,
  onProgress?: (completed: number, total: number) => void,
): Promise<string[]> {
  const uploadedUrls: string[] = [];
  for (const dataUrl of dataUrls) {
    try {
      uploadedUrls.push(await uploadImageToCloudinary(dataUrl, folder));
      onProgress?.(uploadedUrls.length, dataUrls.length);
    } catch (error) {
      const cause = error instanceof Error ? error.message : 'Error desconocido al subir la imagen.';
      await Promise.allSettled(uploadedUrls.map((url) => deleteImageFromCloudinary(url)));
      throw new Error(`${cause} No se guardó el lote; se intentó limpiar ${uploadedUrls.length} imagen(es) ya cargada(s).`);
    }
  }
  return uploadedUrls;
}
