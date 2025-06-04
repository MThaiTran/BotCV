import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const userService = {
  // Lấy thông tin user theo ID
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/userAccount/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      // throw error; // Có thể không throw để cho phép phần seeker profile tiếp tục
      return null; // Trả về null nếu lỗi
    }
  },

  // Lấy danh sách seeker profile
  getSeekerProfiles: async () => {
    try {
      const response = await axios.get(`${API_URL}/seekerProfile`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching seeker profiles:', error);
      // throw error;
      return []; // Trả về mảng rỗng nếu lỗi
    }
  },

  // Cập nhật thông tin UserAccount
  updateUserAccount: async (userId, userData) => {
    try {
      const response = await axios.put(`${API_URL}/userAccount/${userId}`, userData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating user account:', error);
      throw error;
    }
  },

  // Cập nhật thông tin SeekerProfile
  updateSeekerProfile: async (seekerProfileId, profileData) => {
    try {
      const response = await axios.put(`${API_URL}/seekerProfile/${seekerProfileId}`, profileData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating seeker profile:', error);
      throw error;
    }
  },

  // Đăng nhập
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/logout`);
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}; 