// src/components/Job/JobCard.jsx (giữ nguyên cho trang tìm kiếm)
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
  postedAt
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
          {location && <span className="location">{location}</span>}
          {salaryRange && <span className="salary">{salaryRange}</span>}
          {jobFromWork && <span className="work-type">{jobFromWork}</span>}
          {jobExperience && <span className="experience">{jobExperience}</span>}
        </div>
        
        <div className="job-tags">
          {jobLevel && <span className="tag level">{jobLevel}</span>}
          {jobEducation && <span className="tag education">{jobEducation}</span>}
        </div>
        
        <div className="job-dates">
          {postedAt && (
            <div className="job-date posted">
              Đăng: {new Date(postedAt).toLocaleDateString('vi-VN')}
            </div>
          )}
          {expirationDate && (
            <div className="job-date expiry">
              Hết hạn: {new Date(expirationDate).toLocaleDateString('vi-VN')}
            </div>
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
  postedAt: PropTypes.string
};

export default JobCard;
