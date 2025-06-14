// src/pages/JobDetailPage/JobDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import '../../assets/css/Pages/Job/JobDetailPage.css';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const JobDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await jobService.getJobDetails(id);
        setJob(data);
        
        // Kiểm tra xem job đã được lưu chưa
        if (currentUser?.ID) {
          checkIfJobSaved();
        }
      } catch (error) {
        console.error('Error loading job details:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, currentUser]);

  const checkIfJobSaved = async () => {
    try {
      // Lấy danh sách wishlist jobs
      const response = await axios.get('/api/wishlistJob');
      const wishlistJobs = response.data.data;
      
      // Kiểm tra xem job hiện tại có trong wishlist không
      const savedJob = wishlistJobs.find(
        item => item.SeekerProfileID === currentUser.ID && item.JobID === Number(id)
      );
      
      setIsSaved(!!savedJob);
    } catch (error) {
      console.error('Error checking saved job:', error);
    }
  };

  const handleApply = async () => {
    setApplyLoading(true);
    try {
      const currentDate = new Date().toISOString();
      const seekerProfileID = currentUser?.ID;

      if (!seekerProfileID) {
        alert('Vui lòng đăng nhập để ứng tuyển!');
        return;
      }

      const applyData = {
        appliedDate: currentDate,
        SeekerProfileID: seekerProfileID,
        JobID: Number(id)
      };

      const response = await axios.post('/api/appliedJob', applyData);
      console.log('Apply API response:', response.data);

      setApplySuccess(true);
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Ứng tuyển thất bại, vui lòng thử lại!');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleSaveJob = async () => {
    if (!currentUser?.ID) {
      alert('Vui lòng đăng nhập để lưu công việc!');
      return;
    }

    setSaveLoading(true);
    try {
      if (isSaved) {
        // Bỏ lưu công việc - tìm và xóa wishlist item
        const response = await axios.get('/api/wishlistJob');
        const wishlistJobs = response.data.data;
        
        const savedJob = wishlistJobs.find(
          item => item.SeekerProfileID === currentUser.ID && item.JobID === Number(id)
        );
        
        if (savedJob) {
          await axios.delete(`/api/wishlistJob/${savedJob.ID}`);
          setIsSaved(false);
        }
      } else {
        // Lưu công việc
        const saveData = {
          addedDate: new Date().toISOString(),
          SeekerProfileID: currentUser.ID,
          JobID: Number(id)
        };
        
        await axios.post('/api/wishlistJob', saveData);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (!job) return <div className="error">Không tìm thấy việc làm</div>;

  return (
    <div className="job-detail-container">
      <div className="job-header">
        <h1>{job.name}</h1>
        <div className="company-info">
          {job.company?.logo && (
            <img src={job.company.logo} alt={job.company.name} />
          )}
          <h2>{job.company?.name}</h2>
        </div>
      </div>

      <div className="job-content">
        <div className="job-meta">
          <div className="meta-item">
            <span className="label">Mức lương:</span>
            <span className="value">
              {job.salary
                ? `${new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: job.salary.currency || 'VND'
                  }).format(job.salary.min)} - ${new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: job.salary.currency || 'VND'
                  }).format(job.salary.max)}`
                : 'Thỏa thuận'}
            </span>
          </div>
          <div className="meta-item">
            <span className="label">Địa điểm:</span>
            <span className="value">{job.location}</span>
          </div>
        </div>

        <div className="job-section">
          <h2>Mô tả công việc</h2>
          <div dangerouslySetInnerHTML={{ __html: job.jobDescription }} />
        </div>

        <div className="job-section">
          <h2>Yêu cầu</h2>
          <ul>
            {job.jobLevel && <li><strong>Cấp bậc:</strong> {job.jobLevel}</li>}
            {job.jobEducation && <li><strong>Học vấn:</strong> {job.jobEducation}</li>}
            {job.jobFromWork && <li><strong>Hình thức làm việc:</strong> {job.jobFromWork}</li>}
            {job.jobHireNumber && <li><strong>Số lượng tuyển:</strong> {job.jobHireNumber}</li>}
          </ul>
          {job.requirements && (
            Array.isArray(job.requirements) ? (
              <ul>
                {job.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
              </ul>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
            )
          )}
        </div>

        <div className="job-actions">
          <div className="action-buttons">
            {job.applicationUrl ? (
              <a
                href={job.applicationUrl}
                className="apply-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ứng tuyển ngay
              </a>
            ) : (
              <button
                className="apply-button"
                onClick={handleApply}
                disabled={applyLoading || applySuccess}
              >
                {applySuccess ? 'Đã ứng tuyển' : applyLoading ? 'Đang gửi...' : 'Ứng tuyển ngay'}
              </button>
            )}

            <button
              className={`save-button ${isSaved ? 'saved' : ''}`}
              onClick={handleSaveJob}
              disabled={saveLoading}
            >
              {saveLoading ? 'Đang xử lý...' : isSaved ? 'Đã lưu' : 'Lưu công việc'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
