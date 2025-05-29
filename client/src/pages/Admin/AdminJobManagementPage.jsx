// src/pages/AdminJobManagementPage/AdminJobManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import '../../assets/css/Pages/Admin/AdminJobManagementPage.css';

const AdminJobManagementPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    requirements: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await adminService.deleteJob(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleApproveJob = async (jobId) => {
    try {
      await adminService.updateJobStatus(jobId, 'approved');
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: 'approved' } : job
      ));
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error approving job:', error);
    }
  };

  const handleRejectJob = async (jobId) => {
    try {
      await adminService.updateJobStatus(jobId, 'rejected', rejectionReason);
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: 'rejected', rejectionReason } : job
      ));
      setShowReviewModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting job:', error);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!newJob.title.trim()) errors.title = 'Tiêu đề không được để trống';
    if (!newJob.company.trim()) errors.company = 'Tên công ty không được để trống';
    if (!newJob.location.trim()) errors.location = 'Địa điểm không được để trống';
    if (!newJob.salary.trim()) errors.salary = 'Mức lương không được để trống';
    if (!newJob.description.trim()) errors.description = 'Mô tả không được để trống';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const createdJob = await adminService.createJob(newJob);
      setJobs([createdJob, ...jobs]);
      setShowAddModal(false);
      resetNewJobForm();
    } catch (error) {
      console.error('Error creating job:', error);
      setFormErrors({ general: 'Có lỗi xảy ra khi tạo tin tuyển dụng' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({
      ...newJob,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const resetNewJobForm = () => {
    setNewJob({
      title: '',
      company: '',
      location: '',
      salary: '',
      description: '',
      requirements: ''
    });
    setFormErrors({});
  };

  const openDeleteModal = (job) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  const openReviewModal = (job) => {
    setSelectedJob(job);
    setShowReviewModal(true);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentFilter === 'all') return matchesSearch;
    return matchesSearch && job.status === currentFilter;
  });

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  return (
    <div className="admin-job-management">
      <div className="page-header">
        <h1>Quản lý tin tuyển dụng</h1>
        <button 
          className="add-job-btn"
          onClick={() => setShowAddModal(true)}
        >
          Đăng tin mới
        </button>
      </div>

      <div className="filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề hoặc công ty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('all')}
          >
            Tất cả
          </button>
          <button 
            className={`filter-btn ${currentFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('pending')}
          >
            Chờ duyệt
          </button>
          <button 
            className={`filter-btn ${currentFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('approved')}
          >
            Đã duyệt
          </button>
          <button 
            className={`filter-btn ${currentFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('rejected')}
          >
            Từ chối
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-indicator">Đang tải dữ liệu...</div>
      ) : (
        <div className="jobs-table-container">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Công ty</th>
                <th>Ngày đăng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>{new Date(job.postedAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${job.status}`}>
                      {getStatusLabel(job.status)}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <Link 
                      to={`/admin/jobs/${job.id}`} 
                      className="view-btn"
                    >
                      Xem
                    </Link>
                    
                    {job.status === 'pending' && (
                      <button 
                        className="review-btn"
                        onClick={() => openReviewModal(job)}
                      >
                        Duyệt
                      </button>
                    )}
                    
                    <button 
                      className="delete-btn"
                      onClick={() => openDeleteModal(job)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Xác nhận xóa tin tuyển dụng</h2>
            <p>Bạn có chắc chắn muốn xóa tin tuyển dụng <strong>"{selectedJob?.title}"</strong>?</p>
            <p className="warning-text">Hành động này không thể hoàn tác.</p>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={() => handleDeleteJob(selectedJob.id)}
              >
                Xóa tin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Job Modal */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal-container review-modal">
            <h2>Duyệt tin tuyển dụng</h2>
            <div className="job-review-info">
              <p><strong>Tiêu đề:</strong> {selectedJob?.title}</p>
              <p><strong>Công ty:</strong> {selectedJob?.company}</p>
              <p><strong>Ngày đăng:</strong> {new Date(selectedJob?.postedAt).toLocaleDateString()}</p>
            </div>
            
            <div className="review-actions">
              <button 
                className="approve-btn"
                onClick={() => handleApproveJob(selectedJob.id)}
              >
                Duyệt tin
              </button>
              
              <div className="reject-section">
                <h3>Từ chối tin</h3>
                <textarea
                  placeholder="Lý do từ chối (bắt buộc)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="4"
                ></textarea>
                <button 
                  className="reject-btn"
                  onClick={() => handleRejectJob(selectedJob.id)}
                  disabled={!rejectionReason.trim()}
                >
                  Từ chối tin
                </button>
              </div>
            </div>
            
            <button 
              className="close-modal-btn"
              onClick={() => setShowReviewModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container add-job-modal">
            <h2>Đăng tin tuyển dụng mới</h2>
            
            {formErrors.general && (
              <div className="error-message general-error">{formErrors.general}</div>
            )}
            
            <form onSubmit={handleAddJob}>
              <div className="form-group">
                <label htmlFor="title">Tiêu đề công việc *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newJob.title}
                  onChange={handleInputChange}
                  className={formErrors.title ? 'error' : ''}
                />
                {formErrors.title && <div className="error-message">{formErrors.title}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="company">Công ty *</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={newJob.company}
                  onChange={handleInputChange}
                  className={formErrors.company ? 'error' : ''}
                />
                {formErrors.company && <div className="error-message">{formErrors.company}</div>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Địa điểm *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={newJob.location}
                    onChange={handleInputChange}
                    className={formErrors.location ? 'error' : ''}
                  />
                  {formErrors.location && <div className="error-message">{formErrors.location}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="salary">Mức lương *</label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={newJob.salary}
                    onChange={handleInputChange}
                    className={formErrors.salary ? 'error' : ''}
                    placeholder="VD: 20-30 triệu"
                  />
                  {formErrors.salary && <div className="error-message">{formErrors.salary}</div>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Mô tả công việc *</label>
                <textarea
                  id="description"
                  name="description"
                  value={newJob.description}
                  onChange={handleInputChange}
                  className={formErrors.description ? 'error' : ''}
                  rows="6"
                ></textarea>
                {formErrors.description && <div className="error-message">{formErrors.description}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="requirements">Yêu cầu công việc</label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={newJob.requirements}
                  onChange={handleInputChange}
                  rows="6"
                ></textarea>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    resetNewJobForm();
                  }}
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="confirm-btn"
                >
                  Đăng tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobManagementPage;
