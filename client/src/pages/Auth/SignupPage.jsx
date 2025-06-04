// src/pages/SignupPage/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/Pages/Auth/SignupPage.css';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';

const SignupPage = () => {
  const [role, setRole] = useState('candidate'); // candidate | employer
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // Candidate
    fullName: '',
    phone: '',
    // Employer
    companyName: '',
    companyLocation: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      fullName: '',
      phone: '',
      companyName: '',
      companyLocation: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (role === 'candidate') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Vui lòng nhập họ và tên';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Vui lòng nhập số điện thoại';
      } else if (!/^0\d{9,10}$/.test(formData.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    }

    if (role === 'employer') {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Vui lòng nhập tên công ty';
      }
      if (!formData.companyLocation.trim()) {
        newErrors.companyLocation = 'Vui lòng nhập địa điểm làm việc';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      if (role === 'candidate') {
        await register({
          email: formData.email,
          password: formData.password,
          role,
          fullName: formData.fullName,
          phone: formData.phone
        });
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          role,
          companyName: formData.companyName,
          companyLocation: formData.companyLocation
        });
      }
      navigate('/');
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <main className="signup-content">
        <div className="container">
          <div className="signup-wrapper">
            <div className="signup-banner">
              <div className="signup-banner__content">
                <h2>Bắt đầu sự nghiệp mới</h2>
                <p>Tạo tài khoản để tiếp cận hàng nghìn cơ hội việc làm tại các công ty hàng đầu.</p>
              </div>
            </div>

            <div className="signup-form-container">
              <h1 className="form-title">Đăng ký</h1>
              <div className="role-switch">
                <Button
                  type="button"
                  variant={role === 'candidate' ? 'primary' : 'outline'}
                  onClick={() => handleRoleChange('candidate')}
                >
                  Ứng viên
                </Button>
                <Button
                  type="button"
                  variant={role === 'employer' ? 'primary' : 'outline'}
                  onClick={() => handleRoleChange('employer')}
                  style={{ marginLeft: 10 }}
                >
                  Công ty
                </Button>
              </div>
              <p className="form-subtitle">
                {role === 'candidate'
                  ? 'Tạo tài khoản ứng viên miễn phí trên BotCV'
                  : 'Tạo tài khoản công ty để đăng tin tuyển dụng'}
              </p>
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
                  placeholder="Nhập email"
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
                  placeholder="Nhập mật khẩu"
                  label="Mật khẩu"
                  error={errors.password}
                  required
                />

                {role === 'candidate' && (
                  <>
                    <Input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên"
                      label="Họ và tên"
                      error={errors.fullName}
                      required
                    />
                    <Input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                      label="Số điện thoại"
                      error={errors.phone}
                      required
                    />
                  </>
                )}

                {role === 'employer' && (
                  <>
                    <Input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Tên công ty"
                      label="Tên công ty"
                      error={errors.companyName}
                      required
                    />
                    <Input
                      type="text"
                      id="companyLocation"
                      name="companyLocation"
                      value={formData.companyLocation}
                      onChange={handleChange}
                      placeholder="Địa điểm làm việc"
                      label="Địa điểm làm việc"
                      error={errors.companyLocation}
                      required
                    />
                  </>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>

                <div className="form-footer">
                  Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
