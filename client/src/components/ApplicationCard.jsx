import React from 'react';
import PropTypes from 'prop-types';
import '../assets/css/Components/ApplicationCard.css';
import { Link } from 'react-router-dom';

const statusMap = {
  pending: { label: 'Chờ duyệt', color: '#f0ad4e' },
  reviewed: { label: 'Đã xem', color: '#5bc0de' },
  accepted: { label: 'Đã nhận', color: '#5cb85c' },
  rejected: { label: 'Từ chối', color: '#d9534f' }
};

const ApplicationCard = ({ application}) => {
  const status = statusMap[application.status] || { label: application.status, color: '#ccc' };

  return (
    <div className="application-card">
      <div className="application-header">
        <h3>
          <Link to={`/jobs/${application.JobID}`} className="job-title-link">
            {application.jobName || 'Tên công việc không xác định'}
          </Link>
        </h3>
        <span className="status-badge" style={{ backgroundColor: status.color }}>
          {status.label}
        </span>
      </div>
      <div className="application-details">
        <p><strong>Công ty:</strong> {application.companyName || 'Tên công ty không xác định'}</p>
        <p><strong>Ngày ứng tuyển:</strong> {application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : 'N/A'}</p>
      </div>
      <div className="application-actions">
        {application.cvFilePath && (
          <a 
            href={application.cvFilePath} 
            target="_blank" 
            rel="noopener noreferrer"
            className="view-cv-btn"
          >
            Xem CV đã nộp
          </a>
        )}
      </div>
    </div>
  );
};

ApplicationCard.propTypes = {
  application: PropTypes.shape({
    ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    appliedDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    JobID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    jobName: PropTypes.string,
    companyName: PropTypes.string,
    cvFilePath: PropTypes.string
  }).isRequired
};

export default ApplicationCard;
