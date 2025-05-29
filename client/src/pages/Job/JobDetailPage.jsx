// src/pages/JobDetailPage/JobDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import '../../assets/css/Pages/Job/JobDetailPage.css';

const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await jobService.getJobDetails(id);
        setJob(data);
      } catch (error) {
        console.error('Error loading job details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (!job) return <div className="error">Không tìm thấy việc làm</div>;

  return (
    <div className="job-detail-container">
      <div className="job-header">
        <h1>{job.title}</h1>
        <div className="company-info">
          <img src={job.company.logo} alt={job.company.name} />
          <h2>{job.company.name}</h2>
        </div>
      </div>

      <div className="job-content">
        <div className="job-meta">
          <div className="meta-item">
            <span className="label">Mức lương:</span>
            <span className="value">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(job.salary.min)} - 
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(job.salary.max)}
            </span>
          </div>
          
          <div className="meta-item">
            <span className="label">Địa điểm:</span>
            <span className="value">{job.location}</span>
          </div>
        </div>

        <div className="job-section">
          <h2>Mô tả công việc</h2>
          <div dangerouslySetInnerHTML={{ __html: job.description }} />
        </div>

        <div className="job-section">
          <h2>Yêu cầu</h2>
          <ul>
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        <div className="job-actions">
          <a 
            href={job.applicationUrl}
            className="apply-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ứng tuyển ngay
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
