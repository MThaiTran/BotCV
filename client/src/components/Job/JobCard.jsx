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
}) => {
  // Assuming CompanyID is not directly used in the card display
  // and JobCategoryID is not directly used in the card display

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h2 className="job-title">
          {/* Link to job details using ID */}
          <Link to={`/jobs/${ID}`}>{name}</Link>
        </h2>
        {/* Company name is not available in this data structure */}
        {/* <span className="company">{company.name}</span> */}
      </div>
      <div className="job-card-body">
        <div className="job-meta">
          {/* Assuming location might be inferred or not available in this view */}
          {/* <span>{location}</span> */}
          {salaryRange && <span>{salaryRange}</span>}
          {jobFromWork && <span>{jobFromWork}</span>}
          {jobExperience && <span>{jobExperience} kinh nghiệm</span>}
        </div>
        <div className="job-tags">
          {jobLevel && <span className="tag">{jobLevel}</span>}
          {jobEducation && <span className="tag">{jobEducation}</span>}
        </div>
        {expirationDate && (
          <div className="job-date">
            Hết hạn {new Date(expirationDate).toLocaleDateString('vi-VN')}
          </div>
        )}
      </div>
    </div>
  );
};

JobCard.propTypes = {
  ID: PropTypes.string.isRequired, // Assuming ID is a string
  name: PropTypes.string.isRequired,
  jobExperience: PropTypes.string,
  salaryRange: PropTypes.string,
  expirationDate: PropTypes.string,
  jobLevel: PropTypes.string,
  jobEducation: PropTypes.string,
  jobFromWork: PropTypes.string, // Corresponds to job type
  // CompanyID and JobCategoryID are not directly used as props for display
};

export default JobCard;
