// 
// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock user data
const mockUser = {
  ID: 1,
  fullName: "Nguyen Van An",
  phoneNumber: "0123456789",
  emailContact: "nguyen.van.an@example.com",
  UserAccountID: 1,
  userAcc: {
    ID: 1,
    email: "nguyen.van.an@example.com",
    password: "matkhau123",
    profileImage: "http://localhost:5000/api/upload/fb.png",
    userType: "Seeker",
    registrationDate: "2025-01-01T00:00:00.000Z"
  },
  cvUrl: "http://localhost:5000/api/upload/NguyenVanAn.pdf"
};

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Giả lập việc tải thông tin người dùng khi component được mount
  useEffect(() => {
    // Giả lập API call để lấy thông tin người dùng
    const fetchUser = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập delay
      setCurrentUser(mockUser);
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Hàm cập nhật thông tin profile
  const updateProfile = async (profileData) => {
    // Giả lập API call để cập nhật thông tin
    await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập delay
    
    // Cập nhật state với dữ liệu mới
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...profileData
    }));
    
    return { success: true };
  };

  // Hàm đăng nhập (mock)
  const login = async (email, password) => {
    // Giả lập API call đăng nhập
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === "nguyenvana@example.com" && password === "password") {
      setCurrentUser(mockUser);
      // console.log("Đăng nhập thành công:", currentUser.role);
      return mockUser; // Trả về thông tin người dùng đã đăng nhập
    } else {
      throw new Error("Email hoặc mật khẩu không đúng");
    }
  };

  // Hàm đăng xuất (mock)
  const logout = async () => {
    // Giả lập API call đăng xuất
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentUser(null);
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