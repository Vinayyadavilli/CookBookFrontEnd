import { apiFetch } from '@/shared/api/client';

export const fetchUserProfile = async () => {
  return await apiFetch('/profile/', {
    method: 'GET',
  });
};

export const updateUserProfile = async (data) => {
  return await apiFetch('/profile/', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return await apiFetch('/profile/upload-image', {
    method: 'POST',
    body: formData,
  });
};