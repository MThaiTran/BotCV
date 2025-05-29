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
    "description": "<p>Chúng tôi đang tìm kiếm Frontend Developer có kinh nghiệm làm việc với React và các công nghệ web hiện đại.</p><p>Bạn sẽ tham gia vào đội ngũ phát triển sản phẩm, xây dựng giao diện người dùng hấp dẫn và tối ưu hóa trải nghiệm người dùng.</p>",
    "requirements": [
      "Có kinh nghiệm với React.js",
      "Hiểu biết về JavaScript ES6+",
      "Kỹ năng làm việc nhóm tốt",
      "Có khả năng giải quyết vấn đề"
    ],
    "applicationUrl": "https://techsolutions.com/jobs/frontend-developer"
  },
  {
    "id": "job-002",
    "title": "Backend Developer",
    "company": {
      "name": "Innovatech",
      "logo": "https://via.placeholder.com/50"
    },
    "location": "Hồ Chí Minh",
    "salary": {
      "min": 20000000,
      "max": 30000000,
      "currency": "VND"
    },
    "description": "<p>Vị trí Backend Developer làm việc với Node.js và các công nghệ server-side.</p><p>Bạn sẽ phát triển và duy trì các API, tối ưu hóa hiệu suất hệ thống và đảm bảo tính bảo mật của ứng dụng.</p>",
    "requirements": [
      "Kinh nghiệm với Node.js và Express",
      "Hiểu biết về cơ sở dữ liệu MongoDB",
      "Kỹ năng API RESTful",
      "Khả năng làm việc độc lập"
    ],
    "applicationUrl": "https://innovatech.com/jobs/backend-developer"
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
    "description": "<p>Chúng tôi đang tìm kiếm UI/UX Designer có khả năng thiết kế giao diện người dùng thân thiện và trực quan.</p><p>Bạn sẽ làm việc với đội ngũ phát triển để tạo ra các sản phẩm có trải nghiệm người dùng tuyệt vời.</p>",
    "requirements": [
      "Thành thạo Figma và Adobe XD",
      "Kinh nghiệm thiết kế giao diện web và mobile",
      "Hiểu biết về UX research",
      "Portfolio thể hiện kỹ năng thiết kế"
    ],
    "applicationUrl": "https://creativeminds.com/jobs/uiux-designer"
  },
  {
    "id": "job-004",
    "title": "DevOps Engineer",
    "company": {
      "name": "Cloud Systems",
      "logo": "https://via.placeholder.com/50"
    },
    "location": "Hà Nội",
    "salary": {
      "min": 25000000,
      "max": 40000000,
      "currency": "VND"
    },
    "description": "<p>Vị trí DevOps Engineer sẽ quản lý hạ tầng cloud và tự động hóa quy trình phát triển phần mềm.</p><p>Bạn sẽ làm việc với các công nghệ container, CI/CD và các công cụ quản lý cấu hình.</p>",
    "requirements": [
      "Kinh nghiệm với AWS hoặc Google Cloud",
      "Thành thạo Docker và Kubernetes",
      "Kinh nghiệm với CI/CD pipelines",
      "Kỹ năng scripting (Python, Bash)"
    ],
    "applicationUrl": "https://cloudsystems.com/jobs/devops-engineer"
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
    "description": "<p>Chúng tôi cần Mobile Developer có kinh nghiệm phát triển ứng dụng đa nền tảng.</p><p>Bạn sẽ tham gia vào quá trình phát triển ứng dụng từ khâu thiết kế đến triển khai.</p>",
    "requirements": [
      "Kinh nghiệm với React Native hoặc Flutter",
      "Hiểu biết về native iOS/Android development",
      "Kỹ năng tối ưu hóa hiệu suất ứng dụng",
      "Khả năng làm việc trong môi trường agile"
    ],
    "applicationUrl": "https://appfactory.com/jobs/mobile-developer"
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
  // Hàm tìm kiếm công việc
  searchJobs: async (filters) => {
    // Giả lập delay API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Trả về danh sách công việc đã lọc (có thể thêm logic lọc ở đây)
    return mockJobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: "Full-time", // Thêm trường này vì JobCard component cần nó
      postedAt: new Date().toISOString().split('T')[0], // Giả lập ngày đăng
      tags: job.requirements.slice(0, 3) // Lấy 3 yêu cầu đầu tiên làm tags
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
