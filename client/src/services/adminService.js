// src/services/adminService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const adminService = {
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/userAccount?page=1&limit=100`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      throw error;
    }
  },
  
  updateUserStatus: async (userId, newStatus) => {
    try {
      const response = await axios.put(`${API_URL}/userAccount/${userId}`, 
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error.response?.data || error.message);
      throw error;
    }
  },
  
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_URL}/userAccount/${userId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`${API_URL}/userAccount/${userId}`, 
        userData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error.message);
      throw error;
    }
  },

  getAllJobs: async () => {
    try {
      const response = await axios.get(`${API_URL}/job?page=1&limit=100`);
      console.log('Jobs data:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching jobs:', error.response?.data || error.message);
      throw error;
    }
  },
  
  getJobById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/job/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching job details:', error.response?.data || error.message);
      throw error;
    }
  },
  
  updateJobStatus: async (id, status, reason = '') => {
    try {
      const response = await axios.put(`${API_URL}/job/${id}`, 
        { status, rejectionReason: reason },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating job status:', error.response?.data || error.message);
      throw error;
    }
  },
  
  updateJob: async (id, jobData) => {
    try {
      const response = await axios.put(`${API_URL}/job/${id}`, 
        jobData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error.response?.data || error.message);
      throw error;
    }
  },
  
  deleteJob: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/job/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting job:', error.response?.data || error.message);
      throw error;
    }
  },

  createJob: async (jobData) => {
    try {
      const response = await axios.post(`${API_URL}/job`, jobData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error.response?.data || error.message);
      throw error;
    }
  },

  getBasicStats: async () => {
    // Mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        totalUsers: 2458,
        totalJobs: 876,
        totalApplications: 3254,
        totalCompanies: 345,
        pendingJobs: 23,
        pendingCompanies: 12,
        pendingReports: 5
    };
  },

  getAllCompanies: async () => {
    try {
      const response = await axios.get(`${API_URL}/company?page=1&limit=100`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log('Companies data:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching companies:', error.response?.data || error.message);
      throw error;
    }
  },

  createCompany: async (companyData) => {
    try {
      const dataToSend = { ...companyData, UserAccountID: 1 };
      const response = await axios.post(`${API_URL}/company`, 
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating company:', error.response?.data || error.message);
      throw error;
    }
  },

  updateCompany: async (id, companyData) => {
    try {
      const response = await axios.put(`${API_URL}/company/${id}`, 
        companyData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating company:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteCompany: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/company/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting company:', error.response?.data || error.message);
      throw error;
    }
  },

  updateCompanyStatus: async (id, status) => {
    try {
      const response = await axios.put(`${API_URL}/company/${id}`, 
        { status },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating company status:', error.response?.data || error.message);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await axios.post('/api/userAccount', 
        userData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error.response?.data || error.message);
      throw error;
    }
  }
};
