// src/services/candidateService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const candidateService = {
  // Original getCandidates function is broken due to missing backend endpoint.
  // We will implement a multi-step fetch and filter approach in ManageCandidatesPage instead.
  // Keeping a placeholder or removing this depends on whether it's used elsewhere.
  // Let's rename it or remove if it's only used in ManageCandidatesPage now.
  // Given the user's instruction, we'll implement the logic in ManageCandidatesPage
  // using lower-level fetch functions in candidateService.

  // Function to fetch all jobs
  getAllJobs: async () => {
    try {
      const response = await axios.get(`${API_URL}/job`); // Assuming /api/job endpoint
      return response.data.data;
    } catch (error) {
      console.error('Error fetching all jobs:', error);
      throw error;
    }
  },

  // Function to fetch all applied jobs
  getAllAppliedJobs: async () => {
    try {
      const response = await axios.get(`${API_URL}/appliedJob`); // Assuming /api/appliedJob endpoint
      return response.data.data;
    } catch (error) {
      console.error('Error fetching all applied jobs:', error);
      throw error;
    }
  },

  // Function to fetch all seeker profiles
  getAllSeekerProfiles: async () => {
    try {
      const response = await axios.get(`${API_URL}/seekerProfile`); // Assuming /api/seekerProfile endpoint
      return response.data.data;
    } catch (error) {
      console.error('Error fetching all seeker profiles:', error);
      throw error;
    }
  },

  getCandidateById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/candidates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching candidate details for ID ${id}:`, error);
      throw error;
    }
  },

  sendCandidateEmail: async ({ email, type, position, candidateName }) => {
    // This function seems to already be making an API call, assuming /api/send-email is correct
    try {
      const emailContent = {
        invite: `Kính gửi ${candidateName},...`,
        reject: `Kính gửi ${candidateName},...`
      };

      const response = await axios.post('/api/send-email', {
        to: email,
        subject: `Thông báo kết quả ứng tuyển ${position}`,
        body: emailContent[type]
      });
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },

  // Hàm mới: Lấy danh sách ứng viên theo CompanyID
  getCompanyCandidates: async (companyId) => {
    try {
      // API endpoint: GET /api/company/:id/candidates
      const response = await axios.get(`${API_URL}/company/${companyId}/candidates`);
      return response.data.data; // Giả định response có cấu trúc { data: [...] }
    } catch (error) {
      console.error(`Error fetching candidates for company ${companyId}:`, error);
      throw error;
    }
  }
};
