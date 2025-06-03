// src/mocks/savedJobsData.js
import axios from 'axios';

const FIXED_SEEKER_PROFILE_ID = 1;

const mockSavedJobs = [
  {
    id: "w1",
    addedDate: "2025-05-30T10:00:00Z",
    job: {
      id: 88,
      name: "Frontend Developer",
      company: { name: "Công ty ABC" },
      location: "Hà Nội",
      salary: "15-25 triệu",
      type: "Toàn thời gian",
      postedAt: "2025-05-28T09:00:00Z",
      tags: ["React", "JavaScript"]
    }    
  },
];

// Giả lập API service
export const savedJobsService = {
  // Lấy danh sách công việc đã lưu
  getSavedJobs: async (userId) => {
    try {
      const response = await axios.get('/api/wishlistJob');
      const arr = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];
      const filtered = arr.filter(job => job.SeekerProfileID === FIXED_SEEKER_PROFILE_ID);

      // Lấy thông tin Job cho từng WishListJob
      const jobsData = await Promise.all(
        filtered.map(async (wish) => {
          try {
            const jobRes = await axios.get(`/api/job/${wish.JobID}`);
            return {
              WishListJob: wish,
              Job: jobRes.data.data || jobRes.data
            };
          } catch (err) {
            return {
              WishListJob: wish,
              Job: null
            };
          }
        })
      );

      return jobsData;
    } catch (error) {
      console.error('Lỗi tải danh sách công việc đã lưu:', error);
      return [];
    }
  },
  
  // Bỏ lưu công việc
  unsaveJob: async (jobId, userId) => {
    // Giả lập API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};
