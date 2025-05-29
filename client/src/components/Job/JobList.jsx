import React from 'react';
import JobCard from './JobCard';
import '../../assets/css/Components/JobList.css';

const JobList = ({ jobs }) => {
  return (
    <div className="job-list">
      {jobs.map(job => (
        <JobCard 
          key={job.id}
          id={job.id}
          title={job.title}
          company={job.company.name}
          location={job.location}
          salary={job.salary}
          type={job.type}
          postedAt={job.postedAt}
          tags={job.tags}
        />
      ))}
    </div>
  );
};
export default JobList;
