export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('cookbook_token');
  return {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const apiFetch = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const headers = {
    ...getAuthHeaders(isFormData),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error(`401 Unauthorized: ${errorData.detail || 'Session expired'}`);
    }
    throw new Error(errorData.detail || `API Error: ${response.statusText || response.status}`);
  }

  return await response.json();
};
