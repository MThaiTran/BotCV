import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/Pages/Auth/LoginPage.css';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

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

      // 1. Gọi API GET /api/userAccount
      const response = await axios.get('/api/userAccount');
      const userAccounts = response.data.data; // Giả định API trả về { data: [...] }

      // 2. Tìm tài khoản khớp với email và password
      // Lưu ý: So sánh mật khẩu trực tiếp như thế này KHÔNG AN TOÀN trong ứng dụng thực tế.
      // Mật khẩu nên được hash và so sánh ở backend.
      const foundUser = userAccounts.find(user => 
        user.email === formData.email && user.password === formData.password
      );

      // 1. Lấy toàn bộ seekerProfile
      const seekerProfilesRes = await axios.get('/api/seekerProfile');
      const seekerProfiles = seekerProfilesRes.data.data;
      // 2. Tìm seekerProfile theo UserAccountID
      const seekerProfile = seekerProfiles.find(profile => profile.UserAccountID === foundUser.ID);

      if (!seekerProfile) throw new Error('Không tìm thấy seekerProfile phù hợp');
      // console.log(seekerProfile);
      // 3. Lấy userAcc
      // 4. Lấy cvUrl (có thể null)
      let cvUrl = null;
      try {
        // Lấy toàn bộ danh sách CV
        const cvListRes = await axios.get('/api/cv');
        const cvList = cvListRes.data.data;
        // Tìm CV có SeekerProfileID = seekerProfile.ID
        const cv = cvList.find(item => item.SeekerProfileID === seekerProfile.ID);
        cvUrl = cv ? cv.CVFilePath : null;
      } catch (cvErr) {
        cvUrl = null;
      }
      const userAcc = foundUser;
      // 5. Gộp lại thành user object
      const user = {
        ...seekerProfile,
        userAcc,
        cvUrl
      };
      console.log("LOGGEDIN: ", user);
      // 3. Xử lý kết quả tìm kiếm
      if (user) {
        // Đăng nhập thành công: gọi hàm login từ context
        await login(user); // Truyền user object đã tìm thấy
        
        // 4. Điều hướng dựa trên userType
        if (foundUser.userType === 'Admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        // Không tìm thấy tài khoản: hiển thị lỗi
        setErrors({
          ...errors,
          general: 'Email hoặc mật khẩu không chính xác',
        });
      }

    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        ...errors,
        general: 'Đã xảy ra lỗi trong quá trình đăng nhập.',
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
