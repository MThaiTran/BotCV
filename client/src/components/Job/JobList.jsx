import React from 'react';
import JobCard from './JobCard';
import '../../assets/css/Components/JobList.css';

const JobList = ({ jobs }) => {
  return (
    <div className="job-list">
      {jobs.map(job => (
        <JobCard 
          key={job.ID}
          ID={job.ID}
          name={job.name}
          jobExperience={job.jobExperience}
          salaryRange={job.salaryRange}
          expirationDate={job.expirationDate}
          jobLevel={job.jobLevel}
          jobEducation={job.jobEducation}
          jobFromWork={job.jobFromWork}
        />
      ))}
    </div>
  );
};

export default JobList;


