// src/pages/AdminDashboardPage/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import '../../assets/css/Pages/Admin/AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBasicStats = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getBasicStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBasicStats();
  }, []);

  if (isLoading) return <div className="loading-indicator">Đang tải...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Bảng điều khiển Admin</h1>
      </div>

      <div className="dashboard-cards">
        <Link to="/admin/users" className="dashboard-card users-card">
          <div className="card-icon users-icon"></div>
          <div className="card-content">
            <h2>Quản lý người dùng</h2>
            <p>Xem, khóa, xóa tài khoản</p>
            <div className="card-stat">{stats?.totalUsers || 0} người dùng</div>
          </div>
        </Link>

        <Link to="/admin/jobs" className="dashboard-card jobs-card">
          <div className="card-icon jobs-icon"></div>
          <div className="card-content">
            <h2>Quản lý tin tuyển dụng</h2>
            <p>Thêm, sửa, xóa, duyệt tin</p>
            <div className="card-stat">{stats?.totalJobs || 0} tin tuyển dụng</div>
          </div>
        </Link>

        <Link to="/admin/applications" className="dashboard-card applications-card">
          <div className="card-icon applications-icon"></div>
          <div className="card-content">
            <h2>Quản lý ứng tuyển</h2>
            <p>Xem danh sách ứng tuyển</p>
            <div className="card-stat">{stats?.totalApplications || 0} lượt ứng tuyển</div>
          </div>
        </Link>

        <Link to="/admin/companies" className="dashboard-card companies-card">
          <div className="card-icon companies-icon"></div>
          <div className="card-content">
            <h2>Quản lý công ty</h2>
            <p>Xem, duyệt hồ sơ công ty</p>
            <div className="card-stat">{stats?.totalCompanies || 0} công ty</div>
          </div>
        </Link>
      </div>

      <div className="pending-actions">
        <h2>Cần xử lý</h2>
        <div className="pending-cards">
          <Link to="/admin/jobs/pending" className="pending-card">
            <div className="pending-count">{stats?.pendingJobs || 0}</div>
            <div className="pending-label">Tin tuyển dụng chờ duyệt</div>
          </Link>

          <Link to="/admin/companies/pending" className="pending-card">
            <div className="pending-count">{stats?.pendingCompanies || 0}</div>
            <div className="pending-label">Công ty chờ xác thực</div>
          </Link>

          <Link to="/admin/reports" className="pending-card">
            <div className="pending-count">{stats?.pendingReports || 0}</div>
            <div className="pending-label">Báo cáo vi phạm</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
