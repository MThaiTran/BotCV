// src/pages/LoginPage/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/Pages/Auth/LoginPage.css';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      await login(formData.email, formData.password, formData.rememberMe);
      navigate('/');
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Email hoặc mật khẩu không chính xác',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      
      <main className="login-content">
        <div className="container">
          <div className="login-wrapper">
            <div className="login-form-container">
              <h1 className="form-title">Đăng nhập</h1>
              <p className="form-subtitle">Chào mừng bạn quay trở lại với BotCV</p>
              
              {errors.general && (
                <div className="alert alert-error">{errors.general}</div>
              )}
              
              <form className="form" onSubmit={handleSubmit}>
                <Input 
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email của bạn"
                  label="Email"
                  error={errors.email}
                  required
                />
                
                <Input 
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu của bạn"
                  label="Mật khẩu"
                  error={errors.password}
                  required
                />
                
                <div className="login-options">
                  <div className="remember-me">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
                  </div>
                  <Link to="/quen-mat-khau" className="forgot-password">
                    Quên mật khẩu?
                  </Link>
                </div>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
                
                <div className="form-divider">Hoặc đăng nhập bằng</div>
                
                <div className="social-login">
                  <button type="button" className="social-btn social-btn--google">
                    <span className="social-icon google-icon"></span>
                    <span>Google</span>
                  </button>
                  <button type="button" className="social-btn social-btn--facebook">
                    <span className="social-icon facebook-icon"></span>
                    <span>Facebook</span>
                  </button>
                </div>
                
                <div className="form-footer">
                  Chưa có tài khoản? <Link to="/dang-ky">Đăng ký ngay</Link>
                </div>
              </form>
            </div>
            
            <div className="login-banner">
              <div className="login-banner__content">
                <h2>Tìm công việc mơ ước của bạn</h2>
                <p>BotCV kết nối hàng triệu ứng viên với các nhà tuyển dụng hàng đầu.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default LoginPage;
