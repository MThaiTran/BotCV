// src/pages/CompanyProfilePage/CompanyProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReactQuill from 'react-quill-new';
import FileUpload from './FileUpload';
import 'react-quill-new/dist/quill.snow.css';
import '../assets/css/Components/CompanyProfilePage.css';

const schema = yup.object().shape({
  companyName: yup.string().required('Tên công ty là bắt buộc'),
  industry: yup.string().required('Lĩnh vực hoạt động là bắt buộc'),
  location: yup.string().required('Địa chỉ là bắt buộc'),
  website: yup.string().url('URL không hợp lệ'),
  contactEmail: yup.string().email('Email không hợp lệ')
});

const CompanyProfilePage = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema)
  });

  const [description, setDescription] = useState('');

  // Cập nhật giá trị cho react-hook-form khi description thay đổi
  useEffect(() => {
    setValue('description', description);
  }, [description, setValue]);

  const onSubmit = (data) => {
    console.log({
      ...data,
      description
    });
  };

  return (
    <div className="company-profile-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Phần upload ảnh */}
        <div className="cover-section">
          <FileUpload 
            label="Ảnh bìa công ty"
            onFileUpload={(file) => console.log(file)}
          />
        </div>

        {/* Form thông tin cơ bản */}
        <div className="form-section">
          <div className="form-group">
            <label>Tên công ty *</label>
            <input {...register('companyName')} />
            {errors.companyName && <span className="error">{errors.companyName.message}</span>}
          </div>

          <div className="form-group">
            <label>Lĩnh vực hoạt động *</label>
            <input {...register('industry')} />
            {errors.industry && <span className="error">{errors.industry.message}</span>}
          </div>

          <div className="form-group">
            <label>Địa chỉ *</label>
            <input {...register('location')} />
            {errors.location && <span className="error">{errors.location.message}</span>}
          </div>
        </div>

        {/* Rich text editor */}
        <div className="editor-section">
          <label>Giới thiệu công ty *</label>
          <ReactQuill 
            theme="snow" 
            value={description}
            onChange={setDescription}
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image']
              ]
            }}
          />
        </div>

        <button type="submit" className="submit-button">
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default CompanyProfilePage;
