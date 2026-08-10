import { apiFetch } from '@/shared/api/client';

export const fetchFavorites = async () => {
  return await apiFetch('/favorites', {
    method: 'GET',
  });
};

export const addFavorite = async (recipeId) => {
  return await apiFetch(`/favorites/${recipeId}`, {
    method: 'POST',
  });
};

export const removeFavorite = async (recipeId) => {
  return await apiFetch(`/favorites/${recipeId}`, {
    method: 'DELETE',
  });
};

export const rateRecipe = async (recipeId, rating) => {
  return await apiFetch(`/recipes/${recipeId}/rate`, {
    method: 'POST',
    body: JSON.stringify({ rating }),
  });
};

export const submitReview = async (recipeId, comment, ratingId = null) => {
  return await apiFetch(`/recipes/${recipeId}/review`, {
    method: 'POST',
    body: JSON.stringify({ comment, rating_id: ratingId }),
  });
};

export const fetchReviews = async (recipeId) => {
  return await apiFetch(`/recipes/${recipeId}/reviews`, {
    method: 'GET',
  });
};

export const likeRecipe = async (recipeId, type = 'like') => {
  return await apiFetch(`/recipes/${recipeId}/like`, {
    method: 'POST',
    body: JSON.stringify({ type }),
  });
};
