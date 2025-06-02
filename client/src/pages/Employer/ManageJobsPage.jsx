import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { jobService } from '../../services/jobService';
import '../../assets/css/Pages/Employer/ManageJobsPage.css';

const ManageJobsPage = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Lấy danh sách job theo employer (user) id
        const data = await jobService.getEmployerJobs(currentUser.id);
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
    if (currentUser?.id) fetchJobs();
  }, [currentUser]);

  const handleDelete = async (jobId) => {
    if (window.confirm('Bạn chắc chắn muốn xóa tin tuyển dụng này?')) {
      await jobService.deleteJob(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-jobs-container">
      <div className="header-section">
        <h1>Quản lý tin tuyển dụng</h1>
        <div className="actions">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/post-job" className="new-job-button">
            Đăng tin mới
          </Link>
        </div>
      </div>

      <div className="jobs-table">
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Ngày đăng</th>
              <th>Lượt xem</th>
              <th>Ứng tuyển</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map(job => (
              <tr key={job.id}>
                <td>{job.name}</td>
                <td>{new Date(job.postedAt).toLocaleDateString()}</td>
                <td>{job.views}</td>
                <td>{job.applications}</td>
                <td>
                  <span className={`status-badge ${job.status}`}>
                    {job.status === 'active'
                      ? 'Đang hiển thị'
                      : job.status === 'expired'
                      ? 'Đã hết hạn'
                      : job.status}
                  </span>
                </td>
                <td>
                  <Link 
                    to={`/jobs/edit/${job.id}`} 
                    className="action-btn edit"
                  >
                    Sửa
                  </Link>
                  <button 
                    onClick={() => handleDelete(job.id)}
                    className="action-btn delete"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageJobsPage;
