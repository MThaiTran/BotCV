// 
// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm lấy dữ liệu user thực tế
  const fetchUserData = async (userAccountId) => {
    setLoading(true);
    try {
      // 1. Lấy toàn bộ seekerProfile
      const seekerProfilesRes = await axios.get('/api/seekerProfile');
      const seekerProfiles = seekerProfilesRes.data.data;

      // 2. Tìm seekerProfile theo UserAccountID
      const seekerProfile = seekerProfiles.find(profile => profile.UserAccountID === userAccountId);

      if (!seekerProfile) throw new Error('Không tìm thấy seekerProfile phù hợp');
      // console.log(seekerProfile);
      // 3. Lấy userAcc
      const userAccRes = await axios.get(`/api/userAccount/${userAccountId}`);
      const userAcc = userAccRes.data;
      // 4. Lấy cvUrl (có thể null)
      let cvUrl = null;
      try {
        // Lấy toàn bộ danh sách CV
        const cvListRes = await axios.get('/api/cv');
        const cvList = cvListRes.data.data;
        // Tìm CV có SeekerProfileID = seekerProfile.ID
        const cv = cvList.find(item => item.SeekerProfileID === seekerProfile.ID);
        cvUrl = cv ? cv.CVFilePath : null;
      } catch (cvErr) {
        cvUrl = null;
      }
      // 5. Gộp lại thành user object
      const user = {
        ...seekerProfile,
        userAcc,
        cvUrl
      };
      console.log(user);
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
      console.error('Lỗi lấy dữ liệu user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ví dụ: lấy từ localStorage, query param, hoặc props
    const userAccountId = Number(new URLSearchParams(window.location.search).get('userAccountId')) || 1;
    fetchUserData(userAccountId);
  }, []);

  // Hàm cập nhật thông tin profile
  const updateProfile = async (profileData) => {
    // Giả lập API call để cập nhật thông tin
    await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập delay
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...profileData
    }));
    return { success: true };
  };

  // Hàm đăng nhập (sửa để nhận user object)
  const login = async (authenticatedUser) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập delay API
    setCurrentUser(authenticatedUser); // Set user đã xác thực
    return authenticatedUser; // Trả về thông tin người dùng đã đăng nhập
  };

  // Hàm đăng xuất (mock)
  const logout = async () => {
    console.log('Attempting to logout...');
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentUser(null);
    console.log('currentUser after logout:', currentUser);
    return { success: true };
  };

  const value = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser ,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};