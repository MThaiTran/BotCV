// src/mocks/savedJobsData.js
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
    // Giả lập API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockSavedJobs;
  },
  
  // Bỏ lưu công việc
  unsaveJob: async (jobId, userId) => {
    // Giả lập API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};
