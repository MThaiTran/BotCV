// src/components/Job/SavedJobCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../../assets/css/Components/SavedJobCard.css';

const SavedJobCard = ({
  ID,
  name,
  jobExperience,
  salaryRange,
  expirationDate,
  jobLevel,
  jobEducation,
  jobFromWork,
  onUnsave,
  isSaved
}) => {
  return (
    <div className="saved-job-card">
      <div className="job-card-header">
        <h2 className="job-title">
          <Link to={`/jobs/${ID}`}>{name}</Link>
        </h2>
        <span className="saved-badge">Đã lưu</span>
      </div>
      
      <div className="job-card-body">
        <div className="job-meta">
          {salaryRange && <span className="salary">{salaryRange}</span>}
          {jobFromWork && <span className="work-type">{jobFromWork}</span>}
          {jobExperience && <span className="experience">{jobExperience}</span>}
        </div>
        
        <div className="job-tags">
          {jobLevel && <span className="tag level">{jobLevel}</span>}
          {jobEducation && <span className="tag education">{jobEducation}</span>}
        </div>
        
        {expirationDate && (
          <div className="job-date expiry">
            Hết hạn: {new Date(expirationDate).toLocaleDateString('vi-VN')}
          </div>
        )}
      </div>
      
      <div className="job-card-footer">
        <Link to={`/jobs/${ID}`} className="view-detail-btn">
          Xem chi tiết
        </Link>
        <button className="unsave-btn" onClick={() => onUnsave(ID)}>
          Bỏ lưu
        </button>
      </div>
    </div>
  );
};

SavedJobCard.propTypes = {
  ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  jobExperience: PropTypes.string,
  salaryRange: PropTypes.string,
  expirationDate: PropTypes.string,
  jobLevel: PropTypes.string,
  jobEducation: PropTypes.string,
  jobFromWork: PropTypes.string,
  onUnsave: PropTypes.func.isRequired,
  isSaved: PropTypes.bool
};

export default SavedJobCard;
