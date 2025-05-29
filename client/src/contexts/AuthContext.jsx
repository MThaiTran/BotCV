// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
  const checkAuthStatus = () => {
    try {
      // Kiểm tra xem localStorage có sẵn không
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const user = JSON.parse(localStorage.getItem('user_info'));

        if (token && user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Lỗi khi khôi phục phiên đăng nhập:', error);
      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
      } catch (removeError) {
        console.warn('Không thể xóa localStorage:', removeError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  checkAuthStatus();
}, []);

  
  const login = async (email, password, rememberMe = false) => {
    try {
      // Giả lập gọi API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const responseData = {
        token: 'fake-auth-token',
        user: {
          id: '1',
          fullName: 'Nguyễn Văn A',
          email: email
        }
      };
      
      if (rememberMe) {
        localStorage.setItem('auth_token', responseData.token);
        localStorage.setItem('user_info', JSON.stringify(responseData.user));
      }
      
      setCurrentUser(responseData.user);
      setIsAuthenticated(true);
      
      return responseData.user;
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      throw error;
    }
  };
  
  const register = async (fullName, email, password) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const responseData = {
        token: 'fake-auth-token',
        user: {
          id: Math.random().toString(36).substr(2, 9),
          fullName: fullName,
          email: email
        }
      };
      
      localStorage.setItem('auth_token', responseData.token);
      localStorage.setItem('user_info', JSON.stringify(responseData.user));
      
      setCurrentUser(responseData.user);
      setIsAuthenticated(true);
      
      return responseData.user;
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      throw error;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };
  
  const sendOTP = async (email) => {
    try {
      const response = await axiosInstance.post('/auth/send-otp', { email });
      return response.data;
    } catch (error) {
      // Xử lý lỗi chi tiết
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      // Gọi API xác minh OTP
      const response = await axios.post('/api/auth/verify-otp', { email, otp });
      return response.data.token;
    } catch (error) {
      throw new Error('OTP không hợp lệ');
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      // Gọi API đặt lại mật khẩu
      await axios.post('/api/auth/reset-password', { token, newPassword });
      return true;
    } catch (error) {
      throw new Error('Đặt lại mật khẩu thất bại');
    }
  };
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Lỗi cập nhật hồ sơ:', error);
    }
  };
  
  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    // forgotPassword,
    sendOTP,
    verifyOTP,
    resetPassword,
    updateProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
    
  );
  
};

export const useAuth = () => {
  return useContext(AuthContext);
};

