import React, { useState, useEffect } from 'react';
import JobFilter from '../../components/Job/JobFilter';
import JobList from '../../components/Job/JobList';
import { jobService } from '../../services/jobService';
import '../../assets/css/Pages/Job/JobSearchPage.css';

const JobSearchPage = () => {
  const [isLoading, setIsLoading] = useState(false); 
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
    jobLevel: '',
    types: []
  });

  // Fetch all jobs once when component mounts
  useEffect(() => {
    const fetchAllJobs = async () => {
      setIsLoading(true);
      try {
        const data = await jobService.searchJobs({ jobLevel: filters.jobLevel, types: filters.types });
        setAllJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllJobs();
  }, [filters.jobLevel, filters.types]);

  // Filter jobs by keyword on client side
  useEffect(() => {
    if (filters.keyword.trim() === '') {
      setFilteredJobs(allJobs);
    } else {
      const keyword = filters.keyword.toLowerCase();
      const filtered = allJobs.filter(job => 
        job.name.toLowerCase().includes(keyword) ||
        job.company?.toLowerCase().includes(keyword) ||
        job.description?.toLowerCase().includes(keyword)
      );
      setFilteredJobs(filtered);
    }
  }, [filters.keyword, allJobs]);

  return (
    <div className="job-search-page">
      <h1>Tìm kiếm việc làm</h1>
      <JobFilter filters={filters} onFilterChange={setFilters} />
      {console.log('Current jobs:', filteredJobs)}
      {isLoading ? (
        <p>Đang tải kết quả...</p>
      ) : (
        <JobList jobs={filteredJobs} />
      )}
    </div>
  );
};

export default JobSearchPage;
