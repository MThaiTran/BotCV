// src/pages/AdminJobDetailPage/AdminJobDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import '../../assets/css/Pages/Admin/AdminJobDetailPage.css';

const AdminJobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getJobById(id);
        setJob(data);
        setEditedJob(data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedJob({
      ...editedJob,
      [name]: value
    });
  };

  const handleSaveChanges = async () => {
    try {
      await adminService.updateJob(id, editedJob);
      setJob(editedJob);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleApproveJob = async () => {
    try {
      await adminService.updateJobStatus(id, 'approved');
      setJob({
        ...job,
        status: 'approved'
      });
    } catch (error) {
      console.error('Error approving job:', error);
    }
  };

  const handleRejectJob = async () => {
    const reason = prompt('Nhập lý do từ chối:');
    if (!reason) return;
    
    try {
      await adminService.updateJobStatus(id, 'rejected', reason);
      setJob({
        ...job,
        status: 'rejected',
        rejectionReason: reason
      });
    } catch (error) {
      console.error('Error rejecting job:', error);
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  if (isLoading) return <div className="loading-indicator">Đang tải...</div>;
  if (!job) return <div className="error-message">Không tìm thấy tin tuyển dụng</div>;

  return (
    <div className="admin-job-detail">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/admin/jobs')}
        >
          ← Quay lại
        </button>
        <h1>{isEditing ? 'Chỉnh sửa tin tuyển dụng' : 'Chi tiết tin tuyển dụng'}</h1>
      </div>

      <div className="job-detail-container">
        <div className="job-header">
          <div className="job-status">
            <span className={`status-badge ${job.status}`}>
              {getStatusLabel(job.status)}
            </span>
          </div>
          
          {!isEditing && (
            <div className="job-actions">
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </button>
              
              {job.status === 'pending' && (
                <>
                  <button 
                    className="approve-btn"
                    onClick={handleApproveJob}
                  >
                    Duyệt tin
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={handleRejectJob}
                  >
                    Từ chối
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="job-edit-form">
            <div className="form-group">
              <label>Tiêu đề</label>
              <input
                type="text"
                name="title"
                value={editedJob.title}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Công ty</label>
              <input
                type="text"
                name="company"
                value={editedJob.company}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Địa điểm</label>
                <input
                  type="text"
                  name="location"
                  value={editedJob.location}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Mức lương</label>
                <input
                  type="text"
                  name="salary"
                  value={editedJob.salary}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Mô tả công việc</label>
              <textarea
                name="description"
                value={editedJob.description}
                onChange={handleInputChange}
                rows="10"
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button 
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setEditedJob(job);
                }}
              >
                Hủy
              </button>
              <button 
                type="button"
                className="save-btn"
                onClick={handleSaveChanges}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        ) : (
          <div className="job-content">
            <div className="job-info">
              <h2>{job.title}</h2>
              <div className="company-info">
                <span className="company-name">{job.company}</span>
              </div>
              
              <div className="job-meta">
                <div className="meta-item">
                  <span className="meta-label">Địa điểm:</span>
                  <span className="meta-value">{job.location}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Mức lương:</span>
                  <span className="meta-value">{job.salary}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Ngày đăng:</span>
                  <span className="meta-value">{new Date(job.postedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="job-description">
              <h3>Mô tả công việc</h3>
              <div dangerouslySetInnerHTML={{ __html: job.description }}></div>
            </div>
            
            {job.status === 'rejected' && (
              <div className="rejection-reason">
                <h3>Lý do từ chối</h3>
                <p>{job.rejectionReason}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobDetailPage;
