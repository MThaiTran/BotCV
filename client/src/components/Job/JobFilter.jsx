// src/components/Job/JobFilter.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/Components/JobFilter.css';

const jobTypes = [
  { value: 'full-time', label: 'Toàn thời gian' },
  { value: 'part-time', label: 'Bán thời gian' },
  { value: 'remote', label: 'Làm từ xa' },
  { value: 'internship', label: 'Thực tập' }
];

// src/components/Job/JobFilter.jsx
const JobFilter = ({ filters, onFilterChange }) => {
  const handleInputChange = (e) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    let newTypes = Array.isArray(filters.types) ? [...filters.types] : [];
    if (checked) {
      if (!newTypes.includes(value)) newTypes.push(value);
    } else {
      newTypes = newTypes.filter(t => t !== value);
    }
    onFilterChange({ ...filters, types: newTypes });
  };

  const handleReset = () => {
    onFilterChange({
      keyword: '',
      jobLevel: '',
      types: [],
      location: '',
      experience: '',
      salaryMin: '',
      salaryMax: ''
    });
  };

  return (
    <div className="job-filter">
      <div className="filter-header">
        <h3>Bộ lọc tìm kiếm</h3>
        <button type="button" className="reset-btn" onClick={handleReset}>
          Xóa bộ lọc
        </button>
      </div>

      <div className="filter-group">
        <label htmlFor="keyword">Từ khóa</label>
        <input
          type="text"
          id="keyword"
          name="keyword"
          value={filters.keyword || ''}
          onChange={handleInputChange}
          placeholder="Tên công việc, công ty..."
        />
      </div>

      <div className="filter-group">
        <label htmlFor="location">Địa điểm</label>
        <input
          type="text"
          id="location"
          name="location"
          value={filters.location || ''}
          onChange={handleInputChange}
          placeholder="Thành phố, tỉnh..."
        />
      </div>

      <div className="filter-group">
        <label htmlFor="jobLevel">Cấp bậc</label>
        <input
          type="text"
          id="jobLevel"
          name="jobLevel"
          value={filters.jobLevel || ''}
          onChange={handleInputChange}
          placeholder="Senior, Junior, Mid..."
        />
      </div>

      <div className="filter-group">
        <label>Loại hình công việc</label>
        <div className="checkbox-group">
          {jobTypes.map(type => (
            <label key={type.value}>
              <input
                type="checkbox"
                name="types"
                value={type.value}
                checked={Array.isArray(filters.types) && filters.types.includes(type.value)}
                onChange={handleTypeChange}
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Mức lương (triệu VND)</label>
        <div className="salary-range">
          <input
            type="number"
            name="salaryMin"
            value={filters.salaryMin || ''}
            onChange={handleInputChange}
            placeholder="Từ"
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            name="salaryMax"
            value={filters.salaryMax || ''}
            onChange={handleInputChange}
            placeholder="Đến"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};


JobFilter.propTypes = {
  filters: PropTypes.shape({
    keyword: PropTypes.string,
    jobLevel: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.string,
    experience: PropTypes.string,
    salaryMin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    salaryMax: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default JobFilter;
