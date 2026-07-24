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

export const fetchFavorites = async () => {
  const response = await fetch(`${BASE_URL}/favorites`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const addFavorite = async (recipeId) => {
  const response = await fetch(`${BASE_URL}/favorites/${recipeId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const removeFavorite = async (recipeId) => {
  const response = await fetch(`${BASE_URL}/favorites/${recipeId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const rateRecipe = async (recipeId, rating) => {
  const response = await fetch(`${BASE_URL}/recipes/${recipeId}/rate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ rating }),
  });
  return handleResponse(response);
};

export const submitReview = async (recipeId, comment, ratingId = null) => {
  const response = await fetch(`${BASE_URL}/recipes/${recipeId}/review`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ comment, rating_id: ratingId }),
  });
  return handleResponse(response);
};

export const likeRecipe = async (recipeId, type = 'like') => {
  const response = await fetch(`${BASE_URL}/recipes/${recipeId}/like`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ type }),
  });
  return handleResponse(response);
};
