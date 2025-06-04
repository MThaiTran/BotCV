// 
// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock user data
const mockUser = {
  id: "user123",
  fullName: "Nguyễn Văn A",
  password: "password",
  email: "nguyenvana@example.com",
  role: "admin", // candidate | employer
  education: {
    school: "Đại học Bách Khoa Hà Nội",
    major: "Công nghệ thông tin"
  },
  experience: {
    company: "Tech Solutions Vietnam",
    position: "Frontend Developer"
  },
  cvUrl: "https://example.com/cv/nguyenvana.pdf",
  createdAt: "2024-10-15"
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
