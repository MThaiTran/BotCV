// src/pages/PostJobPage/PostJobPage.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../../assets/css/Pages/Employer/PostJobPage.css';

const schema = yup.object().shape({
  title: yup.string().required('Tiêu đề là bắt buộc'),
  salaryMin: yup.number().min(0, 'Lương tối thiểu không hợp lệ').required('Bắt buộc'),
  salaryMax: yup.number()
    .min(yup.ref('salaryMin'), 'Lương tối đa phải lớn hơn tối thiểu')
    .required('Bắt buộc'),
  currency: yup.string().required('Vui lòng chọn đơn vị tiền tệ'),
  location: yup.string().required('Địa điểm là bắt buộc'),
  description: yup.string().required('Mô tả công việc là bắt buộc'),
  requirements: yup.string().required('Yêu cầu công việc là bắt buộc')
});

const PostJobPage = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    console.log('Job Data:', {
      ...data,
      salary: `${data.salaryMin} - ${data.salaryMax} ${data.currency}`
    });
  };

  return (
    <div className="post-job-container">
      <h1>Đăng tin tuyển dụng mới</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Section 1: Thông tin cơ bản */}
        <div className="form-section">
          <h2>Thông tin chung</h2>
          <br></br>
          <div className="form-group">
            <label>Tiêu đề công việc *</label>
            <input 
              {...register('title')}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label>Địa điểm làm việc *</label>
            <input 
              {...register('location')}
              className={errors.location ? 'error' : ''}
            />
            {errors.location && <span className="error-message">{errors.location.message}</span>}
          </div>
        </div>

        {/* Section 2: Mức lương */}
        <div className="form-section">
          <h2>Mức lương</h2>
          <br></br>
          <div className="salary-grid">
            <div className="form-group">
              <input
                type="number" min="0"
                {...register('salaryMin')}
                className={errors.salaryMin ? 'error' : ''}
              />
              {errors.salaryMin && <span className="error-message">{errors.salaryMin.message}</span>}
            </div>

            <div className="form-group">
              
              <input
                type="number" min="0"
                {...register('salaryMax')}
                className={errors.salaryMax ? 'error' : ''}
              />
              {errors.salaryMax && <span className="error-message">{errors.salaryMax.message}</span>}
            </div>

            <div className="form-group">
              <select 
                {...register('currency')}
                className={errors.currency ? 'error' : ''}
              >
                <option value="">Chọn đơn vị</option>
                <option value="VND">VND</option>
                <option value="USD">USD</option>
              </select>
              {errors.currency && <span className="error-message">{errors.currency.message}</span>}
            </div>
          </div>
        </div>

        {/* Section 3: Mô tả công việc */}
        <div className="form-section">
          <h2>Mô tả công việc *</h2>
          <br></br>
          <ReactQuill
            theme="snow"
            onChange={(value) => setValue('description', value)}
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link']
              ]
            }}
          />
          {errors.description && <span className="error-message">{errors.description.message}</span>}
        </div>

        {/* Section 4: Yêu cầu công việc */}
        <div className="form-section">
          <h2>Yêu cầu công việc *</h2>
          <br></br>
          <ReactQuill
            theme="snow"
            onChange={(value) => setValue('requirements', value)}
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link']
              ]
            }}
          />
          {errors.requirements && <span className="error-message">{errors.requirements.message}</span>}
        </div>

        <button type="submit" className="submit-button">
          Đăng tin tuyển dụng
        </button>
      </form>
    </div>
  );
};

export default PostJobPage;
