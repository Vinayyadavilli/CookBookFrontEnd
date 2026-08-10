import { apiFetch } from '@/shared/api/client';

export const loginWithPassword = async (email, password) => {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.access_token) {
    localStorage.setItem('cookbook_token', data.access_token);
  }
  return data;
};

export const sendOtp = async (email, purpose = 'login') => {
  return await apiFetch('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email, purpose }),
  });
};

export const loginWithOtp = async (email, otpCode) => {
  const data = await apiFetch('/auth/login-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp_code: otpCode }),
  });
  if (data.access_token) {
    localStorage.setItem('cookbook_token', data.access_token);
  }
  return data;
};

export const register = async (userData) => {
  return await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      full_name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
      password: userData.password
    }),
  });
};

export const verifyEmailOtp = async (email, otpCode, purpose = 'register') => {
  const data = await apiFetch('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp_code: otpCode, purpose }),
  });
  if (data.access_token) {
    localStorage.setItem('cookbook_token', data.access_token);
  }
  return data;
};

export const logout = async () => {
  localStorage.removeItem('cookbook_token');
  return { success: true };
};