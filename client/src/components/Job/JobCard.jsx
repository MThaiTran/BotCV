// src/components/Job/JobCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../../assets/css/Components/JobCard.css';

const JobCard = ({
  id,
  title,
  company,
  location,
  salary,
  type,
  postedAt,
  tags,
  isSaved,
  onUnsave
}) => {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <h2 className="job-title">
          <Link to={`/jobs/${id}`}>{title}</Link>
        </h2>
        {company && <span className="company">{company}</span>}
      </div>
      <div className="job-card-body">
        <div className="job-meta">
          {location && <span>{location}</span>}
          {salary &&
            <span>
              {typeof salary === 'object'
                ? `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${salary.currency || 'VND'}`
                : salary}
            </span>
          }
          {type && <span>{type}</span>}
        </div>
        <div className="job-tags">
          {Array.isArray(tags) && tags.map((tag, idx) => (
            <span className="tag" key={idx}>{tag}</span>
          ))}
        </div>
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
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  company: PropTypes.string,
  location: PropTypes.string,
  salary: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
      currency: PropTypes.string
    })
  ]),
  type: PropTypes.string,
  postedAt: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  isSaved: PropTypes.bool,
  onUnsave: PropTypes.func
};

export default JobCard;
