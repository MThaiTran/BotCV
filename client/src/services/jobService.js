// // src/services/jobService.js
// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
// export const jobService = {
//   searchJobs: async (filters) => {
//     try {
//       const response = await axios.get(`${API_URL}/jobs`, { params: filters });
//       return response.data;
//     } catch (error) {
//       console.error('Error searching jobs:', error);
//       throw error;
//     }
//   },

//   getJobDetails: async (jobId) => {
//     try {
//       const response = await axios.get(`${API_URL}/jobs/${jobId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching job details:', error);
//       throw error;
//     }
//   },

//   createJob: async (formData) => {
//     return axios.post('/api/jobs', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//   },

//   updateJob: async (id, formData) => {
//     return axios.put(`/api/jobs/${id}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//   },

//   deleteJob: async (id) => {
//     return axios.delete(`/api/jobs/${id}`);
//   },

//   getJobById: async (id) => {
//     return axios.get(`/api/jobs/${id}`);
//   },

//   getEmployerJobs: async (employerId) => {
//     // Giả lập API call
//     return [
//       {
//         id: '1',
//         title: 'Frontend Developer',
//         postedAt: '2024-05-01T08:00:00Z',
//         views: 245,
//         applications: 15,
//         status: 'active',
//       },
//       {
//         id: '2',
//         title: 'Backend Engineer',
//         postedAt: '2024-04-20T08:00:00Z',
//         views: 189,
//         applications: 8,
//         status: 'expired',
//       }
//     ];
//   },
//   deleteJob: async (jobId) => {
//     // Giả lập API call
//     return new Promise(resolve => setTimeout(resolve, 500));
//   }
// };



// src/services/jobService.js
// src/services/jobService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const mockJobs = [
  {
    "ID": 1,
    "name": "Frontend Developer",
    "jobExperience": "2-3 năm",
    "salaryRange": "15-25 triệu/tháng",
    "expirationDate": "2025-12-31T00:00:00.000Z",
    "jobDescription": "Phát triển giao diện người dùng với React và các công nghệ web hiện đại.",
    "jobLevel": "Trung cấp",
    "jobEducation": "Cử nhân Công nghệ thông tin",
    "jobFromWork": "Tại văn phòng",
    "jobHireNumber": "2",
    "CompanyID": 1
  },
  {
    "ID": 2,
    "name": "Quản lý tiếp thị",
    "jobExperience": "Trên 5 năm",
    "salaryRange": "25-35 triệu/tháng",
    "expirationDate": "2025-11-30T00:00:00.000Z",
    "jobDescription": "Dẫn dắt các chiến dịch tiếp thị.",
    "jobLevel": "Cao cấp",
    "jobEducation": "Cử nhân Tiếp thị",
    "jobFromWork": "Tại văn phòng",
    "jobHireNumber": "1",
    "CompanyID": 2
  }
];

const mockEmployerJobs = [
  {
    "id": "job-101",
    "title": "Frontend Developer",
    "postedAt": "2025-05-01T08:00:00Z",
    "views": 245,
    "applications": 18,
    "status": "active",
    "company": {
      "name": "Tech Solutions",
      "logo": "https://via.placeholder.com/50"
    },
    "location": "Hà Nội",
    "salary": {
      "min": 15000000,
      "max": 25000000,
      "currency": "VND"
    }
  },
  {
    "id": "job-102",
    "title": "Backend Developer",
    "postedAt": "2025-05-05T09:30:00Z",
    "views": 187,
    "applications": 12,
    "status": "active",
    "company": {
      "name": "Tech Solutions",
      "logo": "https://via.placeholder.com/50"
    },
    "location": "Hà Nội",
    "salary": {
      "min": 20000000,
      "max": 30000000,
      "currency": "VND"
    }
  },
  {
    "id": "job-103",
    "title": "UI/UX Designer",
    "postedAt": "2025-04-15T10:15:00Z",
    "views": 320,
    "applications": 25,
    "status": "expired",
    "company": {
      "name": "Tech Solutions",
      "logo": "https://via.placeholder.com/50"
    },
    "location": "Hồ Chí Minh",
    "salary": {
      "min": 12000000,
      "max": 18000000,
      "currency": "VND"
    }
  },
  {
    "id": "job-104",
    "title": "DevOps Engineer",
    "postedAt": "2025-05-10T14:20:00Z",
    "views": 156,
    "applications": 8,
    "status": "active",
    "company": {
      "name": "Tech Solutions",
      "logo": "https://via.placeholder.com/50"
    },
    "location": "Đà Nẵng",
    "salary": {
      "min": 25000000,
      "max": 40000000,
      "currency": "VND"
    }
  },
  {
    "id": "job-105",
    "title": "Mobile Developer",
    "postedAt": "2025-04-20T11:45:00Z",
    "views": 210,
    "applications": 15,
    "status": "expired",
    "company": {
      "name": "Tech Solutions",
      "logo": "https://via.placeholder.com/50"
    },
    "location": "Hồ Chí Minh",
    "salary": {
      "min": 18000000,
      "max": 28000000,
      "currency": "VND"
    }
  }
];

export const jobService = {
  // Tìm kiếm công việc
  searchJobs: async (filters) => {
    try {
      const response = await axios.get(`${API_URL}/job`);
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm công việc:', error);
      throw error;
    }
  },

  // Lấy chi tiết công việc theo ID
  getJobDetails: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/job/${id}`);
      return response.data;
      return mock[id];
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết công việc:', error);
      throw error;
    }
  },

  // Tạo công việc mới
  createJob: async (jobData) => {
    try {
      const response = await axios.post(`${API_URL}/jobs`, jobData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo công việc:', error);
      throw error;
    }
  },

  // Cập nhật công việc
  updateJob: async (id, jobData) => {
    try {
      const response = await axios.put(`${API_URL}/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật công việc:', error);
      throw error;
    }
  },

  // Xóa công việc
  deleteJob: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa công việc:', error);
      throw error;
    }
  },

  // Lấy danh sách công việc của nhà tuyển dụng
  getEmployerJobs: async (employerId) => {
    try {
      const response = await axios.get(`${API_URL}/employer/${employerId}/jobs`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách công việc của nhà tuyển dụng:', error);
      throw error;
    }
  }
};
