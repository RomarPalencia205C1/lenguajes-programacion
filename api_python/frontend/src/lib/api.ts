import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = Cookies.get('token');
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Set content-type to application/json if sending a body and it's NOT FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Optional: Clear token and redirect to login if unauthorized
      Cookies.remove('token');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'An error occurred');
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  get: (endpoint: string) => apiFetch(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) => 
    apiFetch(endpoint, { 
      method: 'POST', 
      body: body instanceof FormData ? body : JSON.stringify(body),
      // If it's FormData (like for OAuth2 login), we don't want to set Content-Type manually
      // fetch will set it correctly with the boundary
      headers: body instanceof FormData ? {} : { 'Content-Type': 'application/json' }
    }),
  put: (endpoint: string, body: any) => 
    apiFetch(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(body) 
    }),
  delete: (endpoint: string) => apiFetch(endpoint, { method: 'DELETE' }),
};
