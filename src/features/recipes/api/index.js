import { apiFetch } from '@/shared/api/client';

export const fetchFilterOptions = async () => {
  return await apiFetch('/recipes/filters', {
    method: 'GET',
  });
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

  return await apiFetch(`/recipes/?${params.toString()}`, {
    method: 'GET',
  });
};

export const fetchFeaturedRecipes = async () => {
  return await apiFetch('/recipes/featured', {
    method: 'GET',
  });
};

export const fetchTrendingRecipes = async () => {
  return await apiFetch('/recipes/trending', {
    method: 'GET',
  });
};

export const fetchRecipeDetails = async (id) => {
  return await apiFetch(`/recipes/${id}`, {
    method: 'GET',
  });
};

export const fetchScaledServings = async (id, count) => {
  return await apiFetch(`/recipes/${id}/servings?count=${count}`, {
    method: 'GET',
  });
};