import { useState, useEffect } from 'react';
import { post, put } from '../api/client';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isOfflineMode, setOfflineMode] = useState(
    localStorage.getItem('offlineMode') === 'true'
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  function storeTokens(response) {
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
      setToken(response.access_token);
    }
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    if (response.user) {
      setUser(response.user);
    }
  }

  async function login(email, password) {
    try {
      const response = await post('/auth/login', { email, password });
      storeTokens(response);
      setOfflineMode(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function register(email, password, displayName) {
    try {
      const response = await post('/auth/register', {
        email,
        password,
        display_name: displayName,
      });
      storeTokens(response);
      setOfflineMode(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function updateProfile({ display_name, email }) {
    try {
      const response = await put('/auth/profile', { display_name, email });
      if (response.user) {
        setUser(response.user);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    setOfflineMode(false);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('offlineMode');
  }

  const handleSetOfflineMode = (mode) => {
    setOfflineMode(mode);
    if (mode) {
      localStorage.setItem('offlineMode', 'true');
    } else {
      localStorage.removeItem('offlineMode');
    }
  };

  return {
    user,
    token,
    isAuthenticated: !!token || isOfflineMode,
    login,
    register,
    updateProfile,
    logout,
    isOfflineMode,
    setOfflineMode: handleSetOfflineMode,
  };
}
