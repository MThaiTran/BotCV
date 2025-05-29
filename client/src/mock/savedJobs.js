// src/mocks/savedJobsData.js
const mockSavedJobs = [
  {
    "id": "job-001",
    "title": "Frontend Developer",
    "company": {
      "name": "Tech Solutions",
      "logo": "https://via.placeholder.com/50"
    },
    "location": "Hà Nội",
    "salary": {
      "min": 15000000,
      "max": 25000000,
      "currency": "VND"
    },
    "type": "Full-time",
    "postedAt": "2025-05-10",
    "tags": ["React", "JavaScript", "TypeScript"]
  },
  {
    "id": "job-003",
    "title": "UI/UX Designer",
    "company": {
      "name": "Creative Minds",
      "logo": "https://via.placeholder.com/50"
    },
    "location": "Đà Nẵng",
    "salary": {
      "min": 12000000,
      "max": 18000000,
      "currency": "VND"
    },
    "type": "Part-time",
    "postedAt": "2025-05-15",
    "tags": ["Figma", "Adobe XD", "User Research"]
  },
  {
    "id": "job-005",
    "title": "Mobile Developer",
    "company": {
      "name": "App Factory",
      "logo": "https://via.placeholder.com/50"
    },
    "location": "Hồ Chí Minh",
    "salary": {
      "min": 18000000,
      "max": 28000000,
      "currency": "VND"
    },
    "type": "Remote",
    "postedAt": "2025-05-17",
    "tags": ["React Native", "Flutter", "iOS"]
  }
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
