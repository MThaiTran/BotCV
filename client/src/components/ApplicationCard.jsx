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

const ApplicationCard = ({ application }) => {
  const status = statusMap[application.status] || { label: application.status, color: '#ccc' };

  return (
    <div className="application-card">
      <div className="application-header">
        <h3>
          <Link to={`/jobs/${application.job.id}`} className="job-title-link">
            {application.job.name}
          </Link>
        </h3>
        <span className="status-badge" style={{ backgroundColor: status.color }}>
          {status.label}
        </span>
      </div>
      <div className="application-details">
        <p><strong>Công ty:</strong> {application.job.company.name}</p>
        <p><strong>Ngày ứng tuyển:</strong> {new Date(application.appliedDate).toLocaleDateString()}</p>
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
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    appliedDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    job: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      company: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    cvFilePath: PropTypes.string
  }).isRequired
};

export default ApplicationCard;
