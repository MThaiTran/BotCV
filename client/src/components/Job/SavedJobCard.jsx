// src/components/SavedJobCard/SavedJobCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../assets/css/Components/SavedJobCard.css';

const SavedJobCard = ({ job, onUnsave }) => {
  return (
    <div className="saved-job-card">
      <div className="card-header">
        <h3 className="job-title">
          <Link to={`/jobs/${job.id}`} className="job-title-link">
            {job.title}
          </Link>
        </h3>
        <span className="company">{job.company.name}</span>
      </div>

      <div className="card-details">
        <div className="detail-item">
          <span className="label">Địa điểm:</span>
          <span className="value">{job.location}</span>
        </div>
        <div className="detail-item">
          <span className="label">Mức lương:</span>
          <span className="value">
            {job.salary.min} - {job.salary.max} {job.salary.currency}
          </span>
        </div>
        <div className="detail-item">
          <span className="label">Loại hình:</span>
          <span className="value">{job.type}</span>
        </div>
      </div>

      <div className="card-actions">
        <button 
          className="unsave-btn"
          onClick={() => onUnsave(job.id)}
        >
          Hủy lưu
        </button>
      </div>
    </div>
  );
};

SavedJobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    company: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    location: PropTypes.string.isRequired,
    salary: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
      currency: PropTypes.string
    }),
    type: PropTypes.string.isRequired
  }).isRequired,
  onUnsave: PropTypes.func.isRequired
};

export default SavedJobCard;
