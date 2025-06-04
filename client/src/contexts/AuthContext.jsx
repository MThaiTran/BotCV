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
  createdAt: "2024-10-15",
  companyId: 1,
};

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm chung để fetch user và seeker profile
  const fetchUserAndProfile = async (userId) => {
    try {
      // Lấy thông tin từ bảng UserAccount
      const userData = await userService.getUserById(userId);

      // Lấy danh sách từ bảng seekerProfile
      const seekerProfiles = await userService.getSeekerProfiles();

      // Tìm seekerProfile có UserAccountID khớp với userId
      const seekerProfileData = seekerProfiles.find(profile => profile.UserAccountID === parseInt(userId));

      // Kết hợp dữ liệu từ cả hai nguồn
      let mergedUserData = userData; // Bắt đầu với dữ liệu UserAccount (bao gồm email)
      if (seekerProfileData) {
        mergedUserData = {
          ...mergedUserData,
          ...seekerProfileData,
          // Ánh xạ các trường từ seekerProfile
          seekerProfileID: seekerProfileData.ID, // Lưu SeekerProfile ID
          fullName: seekerProfileData.fullName,
          phoneNumber: seekerProfileData.phoneNumber,
          emailContact: seekerProfileData.emailContact, // Giữ lại emailContact từ seekerProfile
          UserAccountID_from_SeekerProfile: seekerProfileData.UserAccountID,
          // Các trường khác từ UserAccount đã có trong mergedUserData ban đầu
          // Ví dụ: email từ userData được giữ lại
          // email: userData.email, // Không cần dòng này vì userData đã được spread trước
        };
      }

      // Logic fetch CV nếu cần
      // const cvData = await userService.getCVBySeekerProfileId(seekerProfileData.ID);
      // mergedUserData.cvUrl = cvData?.CVFilePath;

      setCurrentUser(mergedUserData);
      return mergedUserData;

    } catch (error) {
      console.error('Error fetching user or seeker profile:', error);
      setCurrentUser(null);
      throw error;
    }
  };

  // Effect chạy khi component mount lần đầu để fetch user ban đầu
  useEffect(() => {
    const loadInitialUser = async () => {
      const userId = "1"; // Tạm thời dùng ID cứng
      if (userId) {
        await fetchUserAndProfile(userId);
      }
      setLoading(false);
    };

    loadInitialUser();
  }, []);

  // Hàm cập nhật thông tin profile
  const updateProfile = async (profileData) => {
    try {
      if (!currentUser?.ID) throw new Error('No user ID available');
      if (!currentUser?.seekerProfileID) throw new Error('No SeekerProfile ID available');

      // Tách dữ liệu để gửi đến API cập nhật SeekerProfile
      const seekerProfileDataToUpdate = {
        fullName: profileData.fullName,
        phoneNumber: profileData.phoneNumber,
        // Bỏ việc gửi emailContact vì không cập nhật qua form này
        // emailContact: profileData.email,
        UserAccountID: currentUser.ID,
      };

      // Gọi API cập nhật SeekerProfile
      await userService.updateSeekerProfile(currentUser.seekerProfileID, seekerProfileDataToUpdate);

      // Fetch lại thông tin user sau khi cập nhật thành công để đồng bộ state
      await fetchUserAndProfile(currentUser.ID);

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

  // Hàm đăng nhập
  const login = async (email, password) => {
    try {
      const response = await userService.login(email, password);
      const loggedInUserId = response.user?.ID; 
      if (loggedInUserId) {
         // Sau khi đăng nhập thành công, fetch lại toàn bộ thông tin user và seeker profile
         await fetchUserAndProfile(loggedInUserId); // Sử dụng hàm chung
      } else {
          console.warn("Login successful but no user ID returned.");
          setCurrentUser(null);
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Hàm đăng xuất
  const logout = async () => {
    try {
      await userService.logout();
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
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
