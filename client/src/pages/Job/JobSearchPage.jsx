import React, { useState, useEffect } from 'react';
import JobFilter from '../../components/Job/JobFilter';
import JobList from '../../components/Job/JobList';
import { jobService } from '../../services/jobService';
import '../../assets/css/Pages/Job/JobSearchPage.css';

const JobSearchPage = () => {
  const [isLoading, setIsLoading] = useState(false); 
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    types: []
  });

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const data = await jobService.searchJobs(filters);
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const debounceTimer = setTimeout(fetchJobs, 500);
    return () => clearTimeout(debounceTimer);
  }, [filters]);

  return (
    <div className="job-search-page">
      <h1>Tìm kiếm việc làm</h1>
      <JobFilter filters={filters} onFilterChange={setFilters} />
      {console.log('Current jobs:', jobs)}
      {isLoading ? (
        <p>Đang tải kết quả...</p>
      ) : (
        <JobList jobs={jobs} />
      )}
    </div>
  );
};

export default JobSearchPage;
