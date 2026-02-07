import { useState, useEffect } from 'react';
import { post } from '../api/client';

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

  async function login(email, password) {
    try {
      const response = await post('/auth/login', { email, password });
      setToken(response.access_token);
      setUser(response.user);
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
      setToken(response.access_token);
      setUser(response.user);
      setOfflineMode(false);
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
    logout,
    isOfflineMode,
    setOfflineMode: handleSetOfflineMode,
  };
}
