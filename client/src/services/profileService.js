// export const updateProfile = async (formData) => {
//   // Implement API call
//   console.log('Updating profile:', formData);
//   return { success: true };
// };

// export const uploadCV = async (file) => {
//   // Implement file upload
//   console.log('Uploading CV:', file.name);
//   return { url: '/uploads/cv.pdf' };
// };


// src/services/profileService.js
import mockProfile from '../mock/profile';

export const profileService = {
  getProfile: async () => {
    await new Promise(r => setTimeout(r, 200)); // giả lập delay
    return mockProfile;
  }
};
