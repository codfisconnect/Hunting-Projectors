const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `HTTP Error ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.message || errorMsg;
      } catch {
        // use default
      }
      throw new ApiError(response.status, errorMsg);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or server unreachable
    throw new ApiError(0, error instanceof Error ? error.message : 'Network request failed');
  }
}

export { API_BASE_URL };
