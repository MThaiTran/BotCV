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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const jobService = {
  // Hàm tìm kiếm công việc
  searchJobs: async (filters) => {
    try {
      const response = await axios.get(`${API_URL}/job`, { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },
  
  // Hàm lấy chi tiết công việc theo ID
  getJobDetails: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/job/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  },

  getEmployerJobs: async (employerId) => {
    try {
      const response = await axios.get(`${API_URL}/jobs/employer/${employerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employer jobs:', error);
      throw error;
    }
  },
  
  deleteJob: async (jobId) => {
    try {
      const response = await axios.delete(`${API_URL}/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  createJob: async (jobData) => {
    try {
      const response = await axios.post(`${API_URL}/job`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  updateJob: async (jobId, jobData) => {
    try {
      const response = await axios.put(`${API_URL}/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }
};
