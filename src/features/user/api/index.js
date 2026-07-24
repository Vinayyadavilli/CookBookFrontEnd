const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('cookbook_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const fetchUserProfile = async () => {
  const response = await fetch(`${BASE_URL}/profile/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error(`401 Unauthorized: ${errorData.detail}`);
    throw new Error(errorData.detail || 'Failed to fetch user profile');
  }
  return await response.json();
};

export const updateUserProfile = async (data) => {
  const response = await fetch(`${BASE_URL}/profile/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to update user profile');
  }
  return await response.json();
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('cookbook_token');
  const response = await fetch(`${BASE_URL}/profile/upload-image`, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error(`401 Unauthorized: ${errorData.detail}`);
    throw new Error(errorData.detail || 'Failed to upload image');
  }
  return await response.json();
};