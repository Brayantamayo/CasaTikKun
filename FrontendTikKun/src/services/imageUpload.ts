// Carpetas disponibles para clasificar los recursos subidos desde el panel administrativo.
type CloudinaryUploadFolder = 'hero' | 'gallery' | 'cabins';

const AUTH_API_BASE_URL = (import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:3001').replace(/\/+$/, '');

interface CloudinaryApiResponse {
  success?: boolean;
  data?: { url?: string; deleted?: boolean };
  message?: string | string[];
  error?: string;
}

/** Sube una imagen comprimida por el backend autenticado; las credenciales permanecen en el servidor. */
export async function uploadImageToCloudinary(dataUrl: string, folder: CloudinaryUploadFolder): Promise<string> {
  const response = await fetch(`${AUTH_API_BASE_URL}/api/cloudinary/images`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: dataUrl, folder }),
  });
  const result = await response.json() as CloudinaryApiResponse;
  if (!response.ok || !result.success || !result.data?.url) {
    const message = Array.isArray(result.message) ? result.message[0] : result.message;
    throw new Error(result.error || message || 'No se pudo subir la imagen a Cloudinary.');
  }
  return result.data.url;
}

/** Elimina de Cloudinary los recursos administrados; URLs externas solo salen de la lista visible. */
export async function deleteImageFromCloudinary(url: string): Promise<boolean> {
  const response = await fetch(`${AUTH_API_BASE_URL}/api/cloudinary/images`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const result = await response.json() as CloudinaryApiResponse;
  if (!response.ok || !result.success) {
    const message = Array.isArray(result.message) ? result.message[0] : result.message;
    throw new Error(result.error || message || 'No se pudo eliminar la imagen de Cloudinary.');
  }
  return result.data?.deleted ?? false;
}

/** Sube varias imágenes en paralelo y conserva el orden de la lista recibida. */
export async function uploadImagesToCloudinary(dataUrls: string[], folder: CloudinaryUploadFolder): Promise<string[]> {
  const results = await Promise.allSettled(dataUrls.map((dataUrl) => uploadImageToCloudinary(dataUrl, folder)));
  const uploadedUrls = results.flatMap((result) => result.status === 'fulfilled' ? [result.value] : []);
  const failedUpload = results.find((result) => result.status === 'rejected');

  // Si una carga del lote falla, limpia las que sí alcanzaron Cloudinary para no dejar archivos huérfanos.
  if (failedUpload?.status === 'rejected') {
    await Promise.allSettled(uploadedUrls.map((url) => deleteImageFromCloudinary(url)));
    throw failedUpload.reason;
  }

  return uploadedUrls;
}
