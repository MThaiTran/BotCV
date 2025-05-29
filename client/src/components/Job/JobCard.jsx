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
  tags
}) => {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <h2 className="job-title">
          <Link to={`/jobs/${id}`}>{title}</Link>
        </h2>
        <span className="company">{company}</span>
      </div>
      <div className="job-card-body">
        <div className="job-meta">
          <span>{location}</span>
          <span>{salary.min} - {salary.max} {salary.currency}</span>
          <span>{type}</span>
        </div>
        <div className="job-tags">
          {tags && tags.map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>
        <div className="job-date">
          Đăng {new Date(postedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

JobCard.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  company: PropTypes.string,
  location: PropTypes.string,
  salary: PropTypes.string,
  type: PropTypes.string,
  postedAt: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string)
};

export default JobCard;
