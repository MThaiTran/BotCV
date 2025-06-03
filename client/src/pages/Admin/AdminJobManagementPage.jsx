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
    jobExperience: '',
    salaryRange: '',
    expirationDate: '',
    jobDescription: '',
    jobLevel: '',
    jobEducation: '',
    jobFromWork: '',
    jobHireNumber: '',
    CompanyID: '',
    JobCategoryID: ''
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
      setJobs(jobs.filter(job => job.ID !== jobId));
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
    if (!newJob.jobExperience.trim()) errors.jobExperience = 'Kinh nghiệm không được để trống';
    if (!newJob.salaryRange.trim()) errors.salaryRange = 'Mức lương không được để trống';
    if (!newJob.expirationDate) errors.expirationDate = 'Ngày hết hạn không được để trống';
    if (!newJob.jobDescription.trim()) errors.jobDescription = 'Mô tả công việc không được để trống';
    if (!newJob.jobLevel.trim()) errors.jobLevel = 'Cấp bậc không được để trống';
    if (!newJob.jobEducation.trim()) errors.jobEducation = 'Học vấn không được để trống';
    if (!newJob.jobFromWork.trim()) errors.jobFromWork = 'Hình thức làm việc không được để trống';
    if (!newJob.jobHireNumber) errors.jobHireNumber = 'Số lượng cần tuyển không được để trống';
    if (!newJob.CompanyID) errors.CompanyID = 'ID Công ty không được để trống';
    if (!newJob.JobCategoryID) errors.JobCategoryID = 'Danh mục công việc không được để trống';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Prepare data to match the API structure
      const jobData = {
        name: newJob.name,
        jobExperience: newJob.jobExperience,
        salaryRange: newJob.salaryRange,
        expirationDate: newJob.expirationDate,
        jobDescription: newJob.jobDescription,
        jobLevel: newJob.jobLevel,
        jobEducation: newJob.jobEducation,
        jobFromWork: newJob.jobFromWork,
        jobHireNumber: parseInt(newJob.jobHireNumber, 10),
        CompanyID: parseInt(newJob.CompanyID, 10),
        JobCategoryID: parseInt(newJob.JobCategoryID, 10),
        // status: 'pending' // Set initial status as pending
      };

      const response = await adminService.createJob(jobData);
      
      if (response && response.data) {
        setJobs([response.data, ...jobs]);
        setShowAddModal(false);
        // Reset form
        setNewJob({
          name: '',
          jobExperience: '',
          salaryRange: '',
          expirationDate: '',
          jobDescription: '',
          jobLevel: '',
          jobEducation: '',
          jobFromWork: '',
          jobHireNumber: '',
          CompanyID: '',
          JobCategoryID: ''
        });
        setFormErrors({});
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      setFormErrors({ 
        general: error.response?.data?.message || 'Có lỗi xảy ra khi tạo tin tuyển dụng' 
      });
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
      (job.company?.name || '').toLowerCase().includes(searchTerm.toLowerCase()); // Keep company search for now
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
                      to={`/admin/jobs/${job.ID}`}
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
                onClick={() => handleDeleteJob(selectedJob.ID)}
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
                <label htmlFor="jobExperience">Kinh nghiệm *</label>
                <input
                  type="text"
                  id="jobExperience"
                  name="jobExperience"
                  value={newJob.jobExperience}
                  onChange={handleInputChange}
                  className={formErrors.jobExperience ? 'error' : ''}
                />
                {formErrors.jobExperience && <div className="error-message">{formErrors.jobExperience}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="salaryRange">Mức lương *</label>
                <input
                  type="text"
                  id="salaryRange"
                  name="salaryRange"
                  value={newJob.salaryRange}
                  onChange={handleInputChange}
                  className={formErrors.salaryRange ? 'error' : ''}
                />
                {formErrors.salaryRange && <div className="error-message">{formErrors.salaryRange}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="expirationDate">Ngày hết hạn *</label>
                <input
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                  value={newJob.expirationDate}
                  onChange={handleInputChange}
                  className={formErrors.expirationDate ? 'error' : ''}
                />
                {formErrors.expirationDate && <div className="error-message">{formErrors.expirationDate}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="jobDescription">Mô tả công việc *</label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  value={newJob.jobDescription}
                  onChange={handleInputChange}
                  className={formErrors.jobDescription ? 'error' : ''}
                  rows="4"
                ></textarea>
                {formErrors.jobDescription && <div className="error-message">{formErrors.jobDescription}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="jobLevel">Cấp bậc *</label>
                <input
                  type="text"
                  id="jobLevel"
                  name="jobLevel"
                  value={newJob.jobLevel}
                  onChange={handleInputChange}
                  className={formErrors.jobLevel ? 'error' : ''}
                />
                {formErrors.jobLevel && <div className="error-message">{formErrors.jobLevel}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="jobEducation">Học vấn *</label>
                <input
                  type="text"
                  id="jobEducation"
                  name="jobEducation"
                  value={newJob.jobEducation}
                  onChange={handleInputChange}
                  className={formErrors.jobEducation ? 'error' : ''}
                />
                {formErrors.jobEducation && <div className="error-message">{formErrors.jobEducation}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="jobFromWork">Hình thức làm việc *</label>
                <input
                  type="text"
                  id="jobFromWork"
                  name="jobFromWork"
                  value={newJob.jobFromWork}
                  onChange={handleInputChange}
                  className={formErrors.jobFromWork ? 'error' : ''}
                />
                {formErrors.jobFromWork && <div className="error-message">{formErrors.jobFromWork}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="jobHireNumber">Số lượng cần tuyển *</label>
                <input
                  type="number"
                  id="jobHireNumber"
                  name="jobHireNumber"
                  value={newJob.jobHireNumber}
                  onChange={handleInputChange}
                  className={formErrors.jobHireNumber ? 'error' : ''}
                />
                {formErrors.jobHireNumber && <div className="error-message">{formErrors.jobHireNumber}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="JobCategoryID">Danh mục công việc *</label>
                <input
                  type="number"
                  id="JobCategoryID"
                  name="JobCategoryID"
                  value={newJob.JobCategoryID}
                  onChange={handleInputChange}
                  className={formErrors.JobCategoryID ? 'error' : ''}
                />
                {formErrors.JobCategoryID && <div className="error-message">{formErrors.JobCategoryID}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="CompanyID">ID Công ty *</label>
                <input
                  type="number"
                  id="CompanyID"
                  name="CompanyID"
                  value={newJob.CompanyID}
                  onChange={handleInputChange}
                  className={formErrors.CompanyID ? 'error' : ''}
                />
                {formErrors.CompanyID && <div className="error-message">{formErrors.CompanyID}</div>}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewJob({
                      name: '',
                      jobExperience: '',
                      salaryRange: '',
                      expirationDate: '',
                      jobDescription: '',
                      jobLevel: '',
                      jobEducation: '',
                      jobFromWork: '',
                      jobHireNumber: '',
                      CompanyID: '',
                      JobCategoryID: ''
                    });
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
