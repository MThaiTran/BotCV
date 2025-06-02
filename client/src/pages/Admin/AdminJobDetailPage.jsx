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
        setEditedJob({
          ...data,
          salaryMin: data.salary?.min || '',
          salaryMax: data.salary?.max || '',
          salaryCurrency: data.salary?.currency || 'VND'
        });
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
      // Chuẩn hóa lại salary object trước khi gửi
      const payload = {
        ...editedJob,
        salary: {
          min: Number(editedJob.salaryMin),
          max: Number(editedJob.salaryMax),
          currency: editedJob.salaryCurrency
        }
      };
      delete payload.salaryMin;
      delete payload.salaryMax;
      delete payload.salaryCurrency;
      await adminService.updateJob(id, payload);
      setJob(payload);
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
    switch (status) {
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
                name="name"
                value={editedJob.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Tên công ty</label>
              <input
                type="text"
                name="companyName"
                value={editedJob.company?.name || ''}
                onChange={e => setEditedJob({
                  ...editedJob,
                  company: { ...editedJob.company, name: e.target.value }
                })}
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
                <label>Lương tối thiểu</label>
                <input
                  type="number"
                  name="salaryMin"
                  value={editedJob.salaryMin}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Lương tối đa</label>
                <input
                  type="number"
                  name="salaryMax"
                  value={editedJob.salaryMax}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Đơn vị tiền tệ</label>
                <select
                  name="salaryCurrency"
                  value={editedJob.salaryCurrency}
                  onChange={handleInputChange}
                >
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                </select>
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
                  setEditedJob({
                    ...job,
                    salaryMin: job.salary?.min || '',
                    salaryMax: job.salary?.max || '',
                    salaryCurrency: job.salary?.currency || 'VND'
                  });
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
              <h2>{job.name}</h2>
              <div className="company-info">
                <span className="company-name">{job.company?.name}</span>
              </div>

              <div className="job-meta">
                <div className="meta-item">
                  <span className="meta-label">Địa điểm:</span>
                  <span className="meta-value">{job.location}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Mức lương:</span>
                  <span className="meta-value">
                    {job.salary
                      ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.currency || 'VND'}`
                      : ''}
                  </span>
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
