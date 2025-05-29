// src/components/Header/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/Components/Header.css';

const Header = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <img src="../../../public/img/logo.png" alt="BotCV Logo" />
            </Link>
          </div>

          <button 
            className="mobile-menu-toggle" 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`main-nav ${showMobileMenu ? 'mobile-active' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/jobs">Tìm việc làm</Link>
              </li>
              <li className="nav-item">
                <Link to="/companies">Công ty</Link>
              </li>
              <li className="nav-item">
                <Link to="/blog">Blog</Link>
              </li>
              {isAuthenticated && currentUser?.role === 'employer' && (
                <li className="nav-item">
                  <Link to="/post-job">Đăng tuyển</Link>
                </li>
              )}
            </ul>

            <div className="auth-buttons">
              {isAuthenticated ? (
                <div className="user-menu" ref={dropdownRef}>
                  <button 
                    className="user-menu-button"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="user-avatar">
                      {currentUser?.avatar ? (
                        <img src={currentUser.avatar} alt="Avatar" />
                      ) : (
                        <span>{currentUser?.name?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <span className="user-name">{currentUser?.name || 'Người dùng'}</span>
                    <i className={`dropdown-arrow ${showDropdown ? 'active' : ''}`}></i>
                  </button>

                  {showDropdown && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <p className="user-email">{currentUser?.email}</p>
                      </div>
                      
                      <ul className="dropdown-list">
                        <li>
                          <Link to="/profile">
                            <i className="icon-profile"></i>
                            Thông tin tài khoản
                          </Link>
                        </li>
                        {currentUser?.role === 'candidate' && (
                          <>
                            <li>
                              <Link to="/applications">
                                <i className="icon-applications"></i>
                                Quản lý tìm việc
                              </Link>
                            </li>
                            <li>
                              <Link to="/saved-jobs">
                                <i className="icon-saved"></i>
                                Việc làm đã lưu
                              </Link>
                            </li>
                          </>
                        )}
                        {currentUser?.role === 'employer' && (
                          <>
                            <li>
                              <Link to="/manage-jobs">
                                <i className="icon-jobs"></i>
                                Quản lý tin tuyển dụng
                              </Link>
                            </li>
                            <li>
                              <Link to="/candidates">
                                <i className="icon-candidates"></i>
                                Quản lý ứng viên
                              </Link>
                            </li>
                          </>
                        )}
                        <li>
                          <Link to="/notifications">
                            <i className="icon-notifications"></i>
                            Thông báo
                            {currentUser?.unreadNotifications > 0 && (
                              <span className="notification-badge">{currentUser.unreadNotifications}</span>
                            )}
                          </Link>
                        </li>
                        <li className="divider"></li>
                        <li>
                          <button onClick={handleLogout}>
                            <i className="icon-logout"></i>
                            Đăng xuất
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/dang-nhap" className="btn btn-login">Đăng nhập</Link>
                  <Link to="/dang-ky" className="btn btn-register">Đăng ký</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
