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
    name: '',
    companyName: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'VND',
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

  const openDeleteModal = (job) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  const openReviewModal = (job) => {
    setSelectedJob(job);
    setShowReviewModal(true);
  };

  // Add Job
  const handleAddJob = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!newJob.name.trim()) errors.name = 'Tiêu đề không được để trống';
    if (!newJob.companyName.trim()) errors.companyName = 'Tên công ty không được để trống';
    if (!newJob.location.trim()) errors.location = 'Địa điểm không được để trống';
    if (!newJob.salaryMin) errors.salaryMin = 'Lương tối thiểu không được để trống';
    if (!newJob.salaryMax) errors.salaryMax = 'Lương tối đa không được để trống';
    if (Number(newJob.salaryMax) < Number(newJob.salaryMin)) errors.salaryMax = 'Lương tối đa phải lớn hơn tối thiểu';
    if (!newJob.description.trim()) errors.description = 'Mô tả không được để trống';
    if (!newJob.requirements.trim()) errors.requirements = 'Yêu cầu không được để trống';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const createdJob = await adminService.createJob({
        name: newJob.name,
        company: { name: newJob.companyName },
        location: newJob.location,
        salary: {
          min: Number(newJob.salaryMin),
          max: Number(newJob.salaryMax),
          currency: newJob.salaryCurrency
        },
        description: newJob.description,
        requirements: newJob.requirements
      });
      setJobs([createdJob, ...jobs]);
      setShowAddModal(false);
      setNewJob({
        name: '',
        companyName: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        salaryCurrency: 'VND',
        description: '',
        requirements: ''
      });
      setFormErrors({});
    } catch (error) {
      setFormErrors({ general: 'Có lỗi xảy ra khi tạo tin tuyển dụng' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({
      ...newJob,
      [name]: value
    });
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      (job.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (currentFilter === 'all') return matchesSearch;
    return matchesSearch && job.status === currentFilter;
  });

  const getStatusLabel = (status) => {
    switch (status) {
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
                  <td>{job.name}</td>
                  <td>{job.company?.name}</td>
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
            <p>Bạn có chắc chắn muốn xóa tin tuyển dụng <strong>"{selectedJob?.name}"</strong>?</p>
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
              <p><strong>Tiêu đề:</strong> {selectedJob?.name}</p>
              <p><strong>Công ty:</strong> {selectedJob?.company?.name}</p>
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
                <label htmlFor="name">Tiêu đề công việc *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newJob.name}
                  onChange={handleInputChange}
                  className={formErrors.name ? 'error' : ''}
                />
                {formErrors.name && <div className="error-message">{formErrors.name}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="companyName">Tên công ty *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={newJob.companyName}
                  onChange={handleInputChange}
                  className={formErrors.companyName ? 'error' : ''}
                />
                {formErrors.companyName && <div className="error-message">{formErrors.companyName}</div>}
              </div>
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
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="salaryMin">Lương tối thiểu *</label>
                  <input
                    type="number"
                    id="salaryMin"
                    name="salaryMin"
                    value={newJob.salaryMin}
                    onChange={handleInputChange}
                    className={formErrors.salaryMin ? 'error' : ''}
                  />
                  {formErrors.salaryMin && <div className="error-message">{formErrors.salaryMin}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="salaryMax">Lương tối đa *</label>
                  <input
                    type="number"
                    id="salaryMax"
                    name="salaryMax"
                    value={newJob.salaryMax}
                    onChange={handleInputChange}
                    className={formErrors.salaryMax ? 'error' : ''}
                  />
                  {formErrors.salaryMax && <div className="error-message">{formErrors.salaryMax}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="salaryCurrency">Đơn vị</label>
                  <select
                    id="salaryCurrency"
                    name="salaryCurrency"
                    value={newJob.salaryCurrency}
                    onChange={handleInputChange}
                  >
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                  </select>
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
                  rows="4"
                ></textarea>
                {formErrors.description && <div className="error-message">{formErrors.description}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="requirements">Yêu cầu công việc *</label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={newJob.requirements}
                  onChange={handleInputChange}
                  className={formErrors.requirements ? 'error' : ''}
                  rows="4"
                ></textarea>
                {formErrors.requirements && <div className="error-message">{formErrors.requirements}</div>}
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormErrors({});
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
