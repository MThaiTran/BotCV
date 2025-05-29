// services/authService.js
import axios from 'axios';

export const sendOTP = (email) => 
  axios.post('/api/auth/send-otp', { email });

export const verifyOTP = (email, otp) => 
  axios.post('/api/auth/verify-otp', { email, otp });

export const resetPassword = (token, newPassword) => 
  axios.post('/api/auth/reset-password', { token, newPassword });


