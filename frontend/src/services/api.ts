// ============================================================
// Centralized API Client with Transparent Production URL Resolution
// ============================================================

/**
 * Determine the backend API URL without silently masking configuration gaps.
 * Priority:
 * 1. import.meta.env.VITE_API_URL
 * 2. import.meta.env.VITE_API_BASE_URL
 * 3. Relative '/api' (if running on same domain / proxy)
 * 4. Development fallback: http://localhost:4000/api only when import.meta.env.DEV is true
 */
function resolveApiBaseUrl(): string {
  // Local development mode (e.g. `npm run dev`)
  if (import.meta.env.DEV) {
    const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
      return envUrl.trim().replace(/\/+$/, '');
    }
    return 'http://localhost:4000/api';
  }

  // Production and Vercel Preview builds: ALWAYS same-origin relative '/api'
  // Vercel edge proxy rewrites in vercel.json route '/api/*' to Cloud Run
  return '/api';
}

const API_BASE_URL = resolveApiBaseUrl();

export class ApiError extends Error {
  public status: number;
  public isNetworkError: boolean;
  public details?: any;

  constructor(status: number, message: string, isNetworkError = false, details?: any) {
    super(message);
    this.status = status;
    this.isNetworkError = isNetworkError;
    this.details = details;
    this.name = 'ApiError';
  }
}

export async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const token = typeof window !== 'undefined' ? localStorage.getItem('hunting_auth_token') : null;
  const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMsg = `Server returned status ${response.status} (${response.statusText})`;
      let errorDetails: any = undefined;
      try {
        const errorText = await response.text();
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.message || errorJson.error || errorMsg;
        errorDetails = errorJson.details;
      } catch {
        // use default
      }
      throw new ApiError(response.status, errorMsg, false, errorDetails);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Meaningful connection error instead of generic "Failed to fetch"
    const isFailedToFetch = error instanceof Error && (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('Load failed')
    );

    const diagnosticMsg = isFailedToFetch
      ? `Cannot connect to API server at ${url}. Please ensure backend service is online and CORS is configured.`
      : error instanceof Error ? error.message : 'Network request failed';

    throw new ApiError(0, diagnosticMsg, true);
  }
}

export { API_BASE_URL };
