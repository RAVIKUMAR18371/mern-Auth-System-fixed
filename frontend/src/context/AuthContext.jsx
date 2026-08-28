import React, { createContext, useContext, useState, useEffect } from 'react';
import API, { setAccessToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session on app startup
  const checkAuth = async () => {
    try {
      let res;
      try {
        res = await API.get('/auth/me');
      } catch (err) {
        // If initial /auth/me fails with 401, try refresh once
        if (err.response?.status === 401) {
          const refreshRes = await API.post('/auth/refresh');
          const newToken = refreshRes.data?.data?.accessToken || refreshRes.data?.accessToken;
          if (newToken) {
            setAccessToken(newToken);
            res = await API.get('/auth/me');
          } else {
            throw err;
          }
        } else {
          throw err;
        }
      }

      if (res?.data && res.data.data?.user) {
        setUser(res.data.data.user);
      } else if (res?.data && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Pre-registration Verification API calls
  const sendEmailOtp = async (email, phone) => {
    const res = await API.post('/auth/register-verification/send-email-otp', { email, phone });
    return res.data;
  };

  const verifyEmailOtp = async (email, otp) => {
    const res = await API.post('/auth/register-verification/verify-email', { email, otp });
    return res.data;
  };

  const sendPhoneOtp = async (email, phone) => {
    const res = await API.post('/auth/register-verification/send-phone-otp', { email, phone });
    return res.data;
  };

  const verifyPhoneOtp = async (email, otp) => {
    const res = await API.post('/auth/register-verification/verify-phone', { email, otp });
    return res.data;
  };

  // Final Registration
  const registerUser = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    return res.data;
  };

  // Login (supports Email or Phone identifier)
  const loginUser = async (identifier, password) => {
    const isEmail = typeof identifier === 'string' && identifier.includes('@');
    const payload = isEmail
      ? { email: identifier, password }
      : { phone: identifier, identifier, password };

    const res = await API.post('/auth/login', payload);
    const token = res.data?.data?.accessToken || res.data?.accessToken;
    if (token) {
      setAccessToken(token);
    }
    if (res.data?.data?.user) {
      setUser(res.data.data.user);
    }
    return res.data;
  };

  // Logout
  const logoutUser = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        checkAuth,
        sendEmailOtp,
        verifyEmailOtp,
        sendPhoneOtp,
        verifyPhoneOtp,
        registerUser,
        loginUser,
        logoutUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
