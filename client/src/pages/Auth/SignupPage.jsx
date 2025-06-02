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
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    // Employer only
    gender: '',
    phone: '',
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
  };

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Bạn cần đồng ý với điều khoản dịch vụ để tiếp tục';
    }

    // Nếu là nhà tuyển dụng, validate thêm các trường
    if (role === 'employer') {
      if (!formData.gender) {
        newErrors.gender = 'Vui lòng chọn giới tính';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Vui lòng nhập số điện thoại';
      } else if (!/^0\d{9,10}$/.test(formData.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
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
      // Gọi hàm đăng ký, truyền thêm role và thông tin employer nếu có
      await register(
        formData.fullName,
        formData.email,
        formData.password,
        role,
        role === 'employer'
          ? {
              gender: formData.gender,
              phone: formData.phone,
              companyName: formData.companyName,
              companyLocation: formData.companyLocation,
            }
          : {}
      );
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
                  Nhà tuyển dụng
                </Button>
              </div>
              <p className="form-subtitle">
                {role === 'candidate'
                  ? 'Tạo tài khoản ứng viên miễn phí trên BotCV'
                  : 'Tạo tài khoản nhà tuyển dụng để đăng tin và quản lý công ty'}
              </p>

              {errors.general && (
                <div className="alert alert-error">{errors.general}</div>
              )}

              <form className="form" onSubmit={handleSubmit}>
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên của bạn"
                  label="Họ và tên"
                  error={errors.fullName}
                  required
                />

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
                  placeholder="Tối thiểu 8 ký tự"
                  label="Mật khẩu"
                  error={errors.password}
                  required
                />

                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  label="Xác nhận mật khẩu"
                  error={errors.confirmPassword}
                  required
                />

                {/* Thông tin riêng cho nhà tuyển dụng */}
                {role === 'employer' && (
                  <>
                    <div className="gender-group">
                      <label>Giới tính</label>
                      <div className="radio-group">
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={handleChange}
                          />
                          Nam
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={handleChange}
                          />
                          Nữ
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="other"
                            checked={formData.gender === 'other'}
                            onChange={handleChange}
                          />
                          Khác
                        </label>
                      </div>
                      {errors.gender && <div className="input-error">{errors.gender}</div>}
                    </div>

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

                <div className="terms-check">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  <label htmlFor="agreeTerms">
                    Tôi đã đọc và đồng ý với <Link to="/dieu-khoan">Điều khoản dịch vụ</Link> và <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link> của BotCV
                  </label>
                  {errors.agreeTerms && <div className="input-error">{errors.agreeTerms}</div>}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>

                <div className="form-divider">Hoặc đăng ký bằng</div>

                <div className="social-login">
                  <button type="button" className="social-btn social-btn--google">
                    <span>Google</span>
                  </button>
                  <button type="button" className="social-btn social-btn--facebook">
                    <span>Facebook</span>
                  </button>
                </div>

                <div className="form-footer">
                  Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link>
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
