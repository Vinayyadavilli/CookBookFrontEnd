const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('cookbook_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error(`401 Unauthorized: ${errorData.detail}`);
    throw new Error(errorData.detail || 'API Error');
  }
  return await response.json();
};

export const fetchFilterOptions = async () => {
  const response = await fetch(`${BASE_URL}/recipes/filters`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const fetchRecipes = async ({ category_id, cuisine_id, food_type, state_id, difficulty, max_time, min_time, search, page = 1, limit = 20 } = {}) => {
  const params = new URLSearchParams();
  if (category_id) params.append('category_id', category_id);
  if (cuisine_id) params.append('cuisine_id', cuisine_id);
  if (food_type) params.append('food_type', food_type);
  if (state_id) params.append('state_id', state_id);
  if (difficulty) params.append('difficulty', difficulty);
  if (max_time != null) params.append('max_time', max_time);
  if (min_time != null) params.append('min_time', min_time);
  if (search) params.append('search', search);
  params.append('page', page);
  params.append('limit', limit);

  const response = await fetch(`${BASE_URL}/recipes/?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const fetchFeaturedRecipes = async () => {
  const response = await fetch(`${BASE_URL}/recipes/featured`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const fetchTrendingRecipes = async () => {
  const response = await fetch(`${BASE_URL}/recipes/trending`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const fetchRecipeDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/recipes/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const fetchScaledServings = async (id, count) => {
  const response = await fetch(`${BASE_URL}/recipes/${id}/servings?count=${count}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};