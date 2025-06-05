// src/pages/JobSearchPage/JobSearchPage.jsx
import React, { useState, useEffect } from 'react';
import JobFilter from '../../components/Job/JobFilter';
import JobList from '../../components/Job/JobList';
import { jobService } from '../../services/jobService';
import '../../assets/css/Pages/Job/JobSearchPage.css';

const JobSearchPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allJobs, setAllJobs] = useState([]); // Tất cả jobs từ API
  const [filteredJobs, setFilteredJobs] = useState([]); // Jobs sau khi filter
  const [filters, setFilters] = useState({
    keyword: '',
    jobLevel: '',
    types: [],
    location: '',
    experience: '',
    salaryMin: '',
    salaryMax: ''
  });

  // Fetch tất cả jobs một lần khi component mount
  useEffect(() => {
    const fetchAllJobs = async () => {
      setIsLoading(true);
      try {
        const data = await jobService.searchJobs({}); // Lấy tất cả jobs
        setAllJobs(data);
        setFilteredJobs(data); // Ban đầu hiển thị tất cả
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllJobs();
  }, []);

  // Filter jobs ở frontend khi filters thay đổi
  useEffect(() => {
    let filtered = [...allJobs];

    // Filter theo từ khóa
    if (filters.keyword && filters.keyword.trim()) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(job => 
        job.name?.toLowerCase().includes(keyword) ||
        job.company?.toLowerCase().includes(keyword) ||
        job.jobDescription?.toLowerCase().includes(keyword)
      );
    }

    // Filter theo địa điểm
    if (filters.location && filters.location.trim()) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(location)
      );
    }

    // Filter theo cấp bậc/trình độ
    if (filters.jobLevel && filters.jobLevel.trim()) {
      const level = filters.jobLevel.toLowerCase();
      filtered = filtered.filter(job => 
        job.jobLevel?.toLowerCase().includes(level)
      );
    }

    // Filter theo loại hình công việc
    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(job => 
        filters.types.some(type => 
          job.jobFromWork?.toLowerCase() === type.toLowerCase() ||
          job.type?.toLowerCase() === type.toLowerCase()
        )
      );
    }

    // Filter theo kinh nghiệm
    if (filters.experience && filters.experience.trim()) {
      const experience = filters.experience.toLowerCase();
      filtered = filtered.filter(job => 
        job.jobExperience?.toLowerCase().includes(experience)
      );
    }

    // Filter theo mức lương
    if (filters.salaryMin || filters.salaryMax) {
      filtered = filtered.filter(job => {
        if (!job.salaryRange) return true;
        
        // Giả sử salaryRange có format "10 - 20 triệu VND"
        const salaryMatch = job.salaryRange.match(/(\d+)\s*-\s*(\d+)/);
        if (salaryMatch) {
          const jobSalaryMin = parseInt(salaryMatch[1]);
          const jobSalaryMax = parseInt(salaryMatch[2]);
          
          if (filters.salaryMin && jobSalaryMax < parseInt(filters.salaryMin)) {
            return false;
          }
          if (filters.salaryMax && jobSalaryMin > parseInt(filters.salaryMax)) {
            return false;
          }
        }
        return true;
      });
    }

    console.log('Original jobs:', allJobs.length);
    console.log('Filtered jobs:', filtered.length);
    console.log('Applied filters:', filters);
    
    setFilteredJobs(filtered);
  }, [filters, allJobs]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="job-search-page">
      <div className="search-header">
        <h1>Tìm kiếm việc làm</h1>
        <p className="search-subtitle">
          Khám phá hàng nghìn cơ hội việc làm phù hợp với bạn
        </p>
      </div>

      <div className="search-content">
        <div className="filter-section">
          <JobFilter 
            filters={filters} 
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="results-section">
          <div className="results-header">
            <div className="results-info">
              {!isLoading && (
                <span className="results-count">
                  {filteredJobs.length > 0 
                    ? `Tìm thấy ${filteredJobs.length} việc làm` 
                    : 'Không tìm thấy việc làm phù hợp'
                  }
                </span>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <p>Đang tải kết quả...</p>
            </div>
          ) : (
            <JobList jobs={filteredJobs} />
          )}

          {!isLoading && filteredJobs.length === 0 && allJobs.length > 0 && (
            <div className="empty-state">
              <h3>Không tìm thấy việc làm phù hợp</h3>
              <p>Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
              <button 
                onClick={() => handleFilterChange({
                  keyword: '',
                  jobLevel: '',
                  types: [],
                  location: '',
                  experience: '',
                  salaryMin: '',
                  salaryMax: ''
                })}
                className="reset-filters-btn"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
