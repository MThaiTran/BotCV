// src/components/Job/JobFilter.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/Components/JobFilter.css';

const JobFilter = ({ filters, onFilterChange }) => {
  const jobTypes = [
    { value: 'full-time', label: 'Toàn thời gian' },
    { value: 'part-time', label: 'Bán thời gian' },
    { value: 'remote', label: 'Làm từ xa' }
  ];

  const handleInputChange = (e) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="job-filter">
      <div className="filter-group">
        <label>Từ khóa</label>
        <input
          type="text"
          name="keyword"
          value={filters.keyword}
          onChange={handleInputChange}
          placeholder="Nhập từ khóa..."
        />
      </div>

      <div className="filter-group">
        <label>Địa điểm</label>
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleInputChange}
          placeholder="Nhập địa điểm..."
        />
      </div>

      <div className="filter-group">
        <label>Loại hình</label>
        <div className="checkbox-group">
          {jobTypes.map(type => (
            <label key={type.value}>
              <input
                type="checkbox"
                name="type"
                value={type.value}
                checked={filters.types?.includes(type.value)}
                onChange={(e) => {
                  const types = e.target.checked
                    ? [...(filters.types || []), type.value]
                    : filters.types?.filter(t => t !== type.value);
                  onFilterChange({ ...filters, types });
                }}
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

JobFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default JobFilter;
