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

  // Chuẩn hóa trường dữ liệu
  // job.name (tên công việc), job.company.name, job.company.logo, job.salary.{min,max,currency}, job.location, job.description (html), job.requirements (html hoặc array), job.applicationUrl
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
          <div dangerouslySetInnerHTML={{ __html: job.description }} />
        </div>

        <div className="job-section">
          <h2>Yêu cầu</h2>
          <ul>
            {job.jobLevel ? (<li>{job.jobLevel}</li>) : null}
            {job.jobEducation ? (<li>{job.jobEducation}</li>) : null}
            {job.jobFromwork ? (<li>{job.jobFromwork}</li>) : null}
            {job.jobHireNumber ? (<li>{job.jobHireNumber}</li>) : null}
          </ul>
        </div>

        <div className="job-actions">
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
            <button className="apply-button" disabled>
              Không thể ứng tuyển
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
