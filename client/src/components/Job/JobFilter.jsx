import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/Components/JobFilter.css';

const jobTypes = [
  { value: 'full-time', label: 'Toàn thời gian' },
  { value: 'part-time', label: 'Bán thời gian' },
  { value: 'remote', label: 'Làm từ xa' }
];

const JobFilter = ({ filters, onFilterChange }) => {
  // Xử lý input text (từ khóa, địa điểm)
  const handleInputChange = (e) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  // Xử lý chọn loại hình việc làm (checkbox)
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

  return (
    <div className="job-filter">
      <div className="filter-group">
        <label htmlFor="keyword">Từ khóa</label>
        <input
          type="text"
          id="keyword"
          name="keyword"
          value={filters.keyword || ''}
          onChange={handleInputChange}
          placeholder="Nhập từ khóa..."
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
    </div>
  );
};

JobFilter.propTypes = {
  filters: PropTypes.shape({
    keyword: PropTypes.string,
    location: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default JobFilter;
