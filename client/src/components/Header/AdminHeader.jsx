// src/components/AdminHeader/AdminHeader.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/Components/AdminHeader.css';

const AdminHeader = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <div className="admin-header-left">
          <Link to="/admin/dashboard" className="admin-logo">
            <span className="logo-text">BotCV Admin</span>
          </Link>
          
          <button 
            className="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        <nav className={`admin-nav ${showMobileMenu ? 'mobile-active' : ''}`}>
          <ul className="admin-menu">
            <li className={isActive('/admin/dashboard')}>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className={isActive('/admin/users')}>
              <Link to="/admin/users">Quản lý người dùng</Link>
            </li>
            <li className={isActive('/admin/jobs')}>
              <Link to="/admin/jobs">Quản lý tin tuyển dụng</Link>
            </li>
            <li className={isActive('/admin/companies')}>
              <Link to="/admin/companies">Quản lý công ty</Link>
            </li>
          </ul>
        </nav>
        
        <div className="admin-header-right">
          <div className="admin-account">
            <button 
              className="admin-account-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="admin-avatar">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
              <span className="admin-name">{currentUser?.name || 'Admin'}</span>
              <span className="dropdown-arrow"></span>
            </button>
            
            {showDropdown && (
              <div className="admin-dropdown">
                <ul>
                  <li>
                    <Link to="/admin/profile">Hồ sơ</Link>
                  </li>
                  <li>
                    <Link to="/admin/settings">Cài đặt</Link>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <button onClick={handleLogout}>Đăng xuất</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
