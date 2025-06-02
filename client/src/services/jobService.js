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
const mockJobs = [
  {
    id: "job-101",
    name: "Frontend Developer",
    postedAt: "2025-05-01T08:00:00Z",
    views: 245,
    applications: 18,
    description: "<p>We are looking for a skilled Frontend Developer to join our team.</p>",
    jobLevel: "Mid-level",
    jobType: "Full-time",
    jobCategory: "Software Development",
    status: "active",
    company: {
      name: "Tech Solutions",
      logo: "https://via.placeholder.com/50"
    },
    location: "Hà Nội",
    salary: {
      min: 15000000,
      max: 25000000,
      currency: "VND"
    }
  },
  
];
const mockEmployerJobs = [
  {
    id: "job-101",
    name: "Frontend Developer",
    postedAt: "2025-05-01T08:00:00Z",
    views: 245,
    applications: 18,
    status: "active",
    company: {
      name: "Tech Solutions",
      logo: "https://via.placeholder.com/50"
    },
    location: "Hà Nội",
    salary: {
      min: 15000000,
      max: 25000000,
      currency: "VND"
    }
  },
  
];
export const jobService = {
  // Hàm tìm kiếm công việc
  searchJobs: async (filters) => {
    // Giả lập delay API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Trả về danh sách công việc đã lọc (có thể thêm logic lọc ở đây)
    return mockJobs.map(job => ({
      id: job.id,
      name: job.name,
      company: job.company,
      location: job.location,
      description: job.description,
      salary: job.salary,
      type: "Full-time", // Thêm trường này vì JobCard component cần nó
      postedAt: new Date().toISOString().split('T')[0], // Giả lập ngày đăng
      // tags: job.requirements.slice(0, 3) // Lấy 3 yêu cầu đầu tiên làm tags
      tags: [job.jobLevel, job.jobEducation, job.jobFromwork] // Giả lập tags
      
    }));
  },
  
  // Hàm lấy chi tiết công việc theo ID
  getJobDetails: async (id) => {
    // Giả lập delay API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Tìm công việc theo ID
    const job = mockJobs.find(job => job.id === id);
    if (!job) {
      throw new Error('Job not found');
    }
    return job;
  },

   getEmployerJobs: async (employerId) => {
    // Giả lập delay API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Trả về danh sách công việc của nhà tuyển dụng
    return mockEmployerJobs;
  },
  
  deleteJob: async (jobId) => {
    // Giả lập delay API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Trả về kết quả thành công
    return { success: true, message: "Xóa tin tuyển dụng thành công" };
  }
};
