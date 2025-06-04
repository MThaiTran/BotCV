// src/pages/ForgotPasswordPage/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/Pages/Auth/ForgotPasswordPage.css';

// Schema validation với Zod
const emailSchema = z.object({
  email: z.string().email('Email không hợp lệ')
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP phải có 6 ký tự')
});

const passwordSchema = z.object({
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword']
});

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const { sendOTP, verifyOTP, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Form handlers
  const { register: emailForm, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors } } = 
    useForm({ resolver: zodResolver(emailSchema) });
  
  const { register: otpForm, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors } } = 
    useForm({ resolver: zodResolver(otpSchema) });
  
  const { register: passwordForm, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, watch } = 
    useForm({ resolver: zodResolver(passwordSchema) });

  const handleSendOTP = async ({ email }) => {
    try {
      await sendOTP(email);
      setEmail(email);
      setStep(2);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVerifyOTP = async ({ otp }) => {
    try {
      const token = await verifyOTP(email, otp);
      setToken(token);
      setStep(3);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleResetPassword = async ({ password }) => {
    try {
      await resetPassword(token, password);
      setStep(4);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="form-container">
        {step === 1 && (
          <form onSubmit={handleEmailSubmit(handleSendOTP)}>
            <h2>Quên Mật Khẩu</h2>
            <Input
              label="Email"
              type="email"
              {...emailForm('email')}
              error={emailErrors.email?.message}
            />
            <Button type="submit" variant="primary">Gửi OTP</Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit(handleVerifyOTP)}>
            <h2>Xác Minh OTP</h2>
            <Input
              label="Mã OTP"
              type="text"
              {...otpForm('otp')}
              error={otpErrors.otp?.message}
            />
            <Button type="submit" variant="primary">Xác Minh</Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit(handleResetPassword)}>
            <h2>Đặt Lại Mật Khẩu</h2>
            <Input
              label="Mật khẩu mới"
              type="password"
              {...passwordForm('password')}
              error={passwordErrors.password?.message}
            />
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              {...passwordForm('confirmPassword')}
              error={passwordErrors.confirmPassword?.message}
            />
            <Button type="submit" variant="primary">Đổi Mật Khẩu</Button>
          </form>
        )}

        {step === 4 && (
          <div className="success-message">
            <h2>Thành Công!</h2>
            <p>Mật khẩu đã được thay đổi thành công. Bạn sẽ được chuyển hướng về trang đăng nhập.</p>
          </div>
        )}

        <div className="nav-links">
          <Link to="/login">Quay lại Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
