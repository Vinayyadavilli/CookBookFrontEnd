const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export const loginWithPassword = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to login with password');
  }
  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem('cookbook_token', data.access_token);
  }
  return data;
};

export const sendOtp = async (email, purpose = 'login') => {
  const response = await fetch(`${BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, purpose }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to send OTP');
  }
  return await response.json();
};

export const loginWithOtp = async (email, otpCode) => {
  const response = await fetch(`${BASE_URL}/auth/login-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp_code: otpCode }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to login with OTP');
  }
  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem('cookbook_token', data.access_token);
  }
  return data;
};

export const register = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
      password: userData.password
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to register');
  }
  return await response.json();
};

export const verifyEmailOtp = async (email, otpCode, purpose = 'register') => {
  const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp_code: otpCode, purpose }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to verify OTP');
  }
  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem('cookbook_token', data.access_token);
  }
  return data;
};

export const logout = async () => {
  localStorage.removeItem('cookbook_token');
  return { success: true };
};