import { apiFetch } from '@/shared/api/client';

export const adminLogin = async (email, password) => {
  const data = await apiFetch('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data?.access_token) {
    sessionStorage.setItem('cb_admin_token', data.access_token);
    localStorage.setItem('cookbook_token', data.access_token);
    sessionStorage.setItem('cb_admin_user', JSON.stringify({ id: data.user_id, role: data.role }));
  }
  return data;
};

export const fetchAdminAnalytics = async () => {
  return await apiFetch('/admin/analytics', { method: 'GET' });
};

export const fetchAdminUsers = async ({ page = 1, limit = 20, search = '', role = '' } = {}) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (search) params.append('search', search);
  if (role) params.append('role', role);
  return await apiFetch(`/admin/users?${params.toString()}`, { method: 'GET' });
};

export const updateAdminUser = async (userId, data) => {
  return await apiFetch(`/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteAdminUser = async (userId) => {
  return await apiFetch(`/admin/users/${userId}`, { method: 'DELETE' });
};

export const fetchAdminRecipes = async ({ page = 1, limit = 50, search = '' } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append('search', search);
  return await apiFetch(`/admin/recipes?${params.toString()}`, { method: 'GET' });
};

export const createAdminRecipe = async (recipeData) => {
  return await apiFetch('/admin/recipes', {
    method: 'POST',
    body: JSON.stringify(recipeData),
  });
};

export const updateAdminRecipe = async (recipeId, recipeData) => {
  return await apiFetch(`/admin/recipes/${recipeId}`, {
    method: 'PUT',
    body: JSON.stringify(recipeData),
  });
};

export const deleteAdminRecipe = async (recipeId) => {
  return await apiFetch(`/admin/recipes/${recipeId}`, { method: 'DELETE' });
};

export const createAdminCategory = async (categoryData) => {
  return await apiFetch('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
};

export const updateAdminCategory = async (catId, categoryData) => {
  return await apiFetch(`/admin/categories/${catId}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });
};

export const deleteAdminCategory = async (catId) => {
  return await apiFetch(`/admin/categories/${catId}`, { method: 'DELETE' });
};

export const createAdminState = async (stateData) => {
  return await apiFetch('/admin/states', {
    method: 'POST',
    body: JSON.stringify(stateData),
  });
};

export const createAdminCuisine = async (cuisineData) => {
  return await apiFetch('/admin/cuisines', {
    method: 'POST',
    body: JSON.stringify(cuisineData),
  });
};