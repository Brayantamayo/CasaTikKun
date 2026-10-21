// Cliente HTTP común: conecta con NestJS y normaliza las respuestas y errores.
/** Cliente HTTP único del frontend: centraliza URL base, cookies y errores de NestJS. */
const API_ORIGIN = (import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly details?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback;
  const data = payload as { message?: unknown; error?: unknown; detail?: unknown };
  const candidate = data.message ?? data.detail ?? data.error;
  if (Array.isArray(candidate)) return candidate.filter((item) => typeof item === 'string').join(' ') || fallback;
  return typeof candidate === 'string' ? candidate : fallback;
}

/** Desenvuelve el formato { data } del backend y conserva también respuestas simples. */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const endpoint = `${API_ORIGIN}/api${path.startsWith('/') ? path : `/${path}`}`;
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(endpoint, { ...init, headers, credentials: 'include' });
  } catch (error) {
    throw new ApiError(
      `No se pudo conectar con la API (${API_ORIGIN}). Comprueba que NestJS esté iniciado.`,
      0,
      error,
    );
  }

  const payload = response.status === 204 ? undefined : await response.json().catch(() => undefined);
  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload, `La solicitud falló (${response.status}).`), response.status, payload);
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, {
    method: 'POST',
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }),
  put: <T>(path: string, body?: unknown) => request<T>(path, {
    method: 'PUT',
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, {
    method: 'PATCH',
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }),
  delete: <T>(path: string, body?: unknown) => request<T>(path, {
    method: 'DELETE',
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }),
};
