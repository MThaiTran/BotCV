// src/components/FileUpload/FileUpload.jsx
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import '../assets/css/Components/FileUpload.css';

const FileUpload = ({ onFileUpload, existingFile, allowedTypes = ['.pdf', '.doc', '.docx'] }) => {
  const fileInputRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndUpload(file);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    validateAndUpload(file);
  }, []);

  const validateAndUpload = (file) => {
    setUploadError(null);
    
    if (!file) return;

    // Validate file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(`.${fileExtension}`)) {
      setUploadError(`Chỉ chấp nhận file ${allowedTypes.join(', ')}`);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Kích thước file tối đa 5MB');
      return;
    }

    onFileUpload(file);
  };

  return (
    <div 
      className={`file-upload ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={allowedTypes.join(',')}
        ref={fileInputRef}
        onChange={handleFileChange}
        hidden
        id="file-upload-input"
      />
      
      <div className="upload-area">
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current.click()}
          aria-labelledby="file-upload-label"
        >
          {existingFile ? 'Thay đổi CV' : 'Chọn file hoặc kéo thả tại đây'}
        </Button>
        
        {existingFile && (
          <div className="file-info">
            <a 
              href={existingFile} 
              target="_blank" 
              rel="noopener noreferrer"
              className="file-preview"
            >
              Xem CV hiện tại
            </a>
          </div>
        )}
      </div>

      {uploadError && <div className="error-message">{uploadError}</div>}

      <div 
        className="dropzone-overlay"
        aria-hidden="true"
      >
        <span className="drag-text">Thả file vào đây để tải lên</span>
      </div>
    </div>
  );
};

FileUpload.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
  existingFile: PropTypes.string,
  allowedTypes: PropTypes.arrayOf(PropTypes.string)
};

export default FileUpload;
