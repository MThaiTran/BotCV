// src/components/Job/JobCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../../assets/css/Components/JobCard.css';

const JobCard = ({
  ID,
  name,
  jobExperience,
  salaryRange,
  expirationDate,
  jobLevel,
  jobEducation,
  jobFromWork,
  company,
  location,
  postedAt,
  tags,
  isSaved,
  onUnsave
}) => {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <h2 className="job-title">
          <Link to={`/jobs/${ID}`}>{name}</Link>
        </h2>
        {company && <span className="company">{company}</span>}
      </div>
      <div className="job-card-body">
        <div className="job-meta">
          {location && <span>{location}</span>}
          {salaryRange && <span>{salaryRange}</span>}
          {jobFromWork && <span>{jobFromWork}</span>}
          {jobExperience && <span>{jobExperience} kinh nghiệm</span>}
        </div>
        <div className="job-tags">
          {jobLevel && <span className="tag">{jobLevel}</span>}
          {jobEducation && <span className="tag">{jobEducation}</span>}
          {Array.isArray(tags) && tags.map((tag, idx) => (
            <span className="tag" key={idx}>{tag}</span>
          ))}
        </div>
        {expirationDate && (
          <div className="job-date">
            Hết hạn {new Date(expirationDate).toLocaleDateString('vi-VN')}
          </div>
        )}
        {postedAt && (
          <div className="job-date">
            Đăng ngày {new Date(postedAt).toLocaleDateString('vi-VN')}
          </div>
        )}
        <div className="job-card-footer">
          {isSaved && typeof onUnsave === 'function' && (
            <button className="unsave-btn" onClick={onUnsave}>
              Bỏ lưu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

JobCard.propTypes = {
  ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  jobExperience: PropTypes.string,
  salaryRange: PropTypes.string,
  expirationDate: PropTypes.string,
  jobLevel: PropTypes.string,
  jobEducation: PropTypes.string,
  jobFromWork: PropTypes.string,
  company: PropTypes.string,
  location: PropTypes.string,
  postedAt: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  isSaved: PropTypes.bool,
  onUnsave: PropTypes.func
};

export default JobCard;
