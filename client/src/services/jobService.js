// src/services/jobService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const jobService = {
  searchJobs: async (filters) => {
    try {
      const response = await axios.get(`${API_URL}/jobs`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },

  getJobDetails: async (jobId) => {
    try {
      const response = await axios.get(`${API_URL}/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  },

  createJob: async (formData) => {
    return axios.post('/api/jobs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  updateJob: async (id, formData) => {
    return axios.put(`/api/jobs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  deleteJob: async (id) => {
    return axios.delete(`/api/jobs/${id}`);
  },

  getJobById: async (id) => {
    return axios.get(`/api/jobs/${id}`);
  },

  getEmployerJobs: async (employerId) => {
    // Giả lập API call
    return [
      {
        id: '1',
        title: 'Frontend Developer',
        postedAt: '2024-05-01T08:00:00Z',
        views: 245,
        applications: 15,
        status: 'active',
      },
      {
        id: '2',
        title: 'Backend Engineer',
        postedAt: '2024-04-20T08:00:00Z',
        views: 189,
        applications: 8,
        status: 'expired',
      }
    ];
  },
  deleteJob: async (jobId) => {
    // Giả lập API call
    return new Promise(resolve => setTimeout(resolve, 500));
  }
};
