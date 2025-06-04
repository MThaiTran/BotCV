// src/pages/PostJobPage/PostJobPage.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../../assets/css/Pages/Employer/PostJobPage.css';

const schema = yup.object().shape({
  name: yup.string().required('Tiêu đề công việc là bắt buộc'),
  jobExperience: yup.string().required('Kinh nghiệm là bắt buộc'),
  salaryMin: yup.number().min(0, 'Lương tối thiểu không hợp lệ').required('Bắt buộc'),
  salaryMax: yup.number()
    .min(yup.ref('salaryMin'), 'Lương tối đa phải lớn hơn tối thiểu')
    .required('Bắt buộc'),
  salaryCurrency: yup.string().required('Vui lòng chọn đơn vị tiền tệ'),
  expirationDate: yup.date().required('Ngày hết hạn là bắt buộc'),
  jobLevel: yup.string().required('Cấp bậc là bắt buộc'),
  jobEducation: yup.string().required('Học vấn là bắt buộc'),
  jobFromWork: yup.string().required('Hình thức làm việc là bắt buộc'),
  jobHireNumber: yup.number().min(1, 'Số lượng phải lớn hơn 0').required('Số lượng tuyển là bắt buộc'),
  jobDescription: yup.string().required('Mô tả công việc là bắt buộc'),
  requirements: yup.string().required('Yêu cầu công việc là bắt buộc'),
  location: yup.string().required('Địa điểm là bắt buộc'),
  jobCategoryId: yup.number().required('Danh mục công việc là bắt buộc'),
  companyId: yup.number().required('ID công ty là bắt buộc')
});

const PostJobPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Đồng bộ ReactQuill với form
  React.useEffect(() => {
    setValue('jobDescription', description);
  }, [description, setValue]);

  React.useEffect(() => {
    setValue('requirements', requirements);
  }, [requirements, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        jobExperience: data.jobExperience,
        salaryRange: `${data.salaryMin} - ${data.salaryMax} ${data.salaryCurrency}`,
        expirationDate: data.expirationDate,
        jobDescription: data.jobDescription,
        jobLevel: data.jobLevel,
        jobEducation: data.jobEducation,
        jobFromWork: data.jobFromWork,
        jobHireNumber: data.jobHireNumber,
        requirements: data.requirements,
        location: data.location,
        jobCategoryId: data.jobCategoryId,
        companyId: data.companyId
      };

      console.log('Job Data:', payload);
      // TODO: Gọi API để tạo job
      // await jobService.createJob(payload);
      
      alert('Đăng tin tuyển dụng thành công!');
      // Reset form hoặc redirect
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Có lỗi xảy ra khi đăng tin!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-job-container">
      <div className="post-job-header">
        <h1>Đăng tin tuyển dụng mới</h1>
        <p>Tạo tin tuyển dụng để tìm kiếm ứng viên phù hợp</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="post-job-form">
        {/* Thông tin cơ bản */}
        <div className="form-section">
          <h2>Thông tin cơ bản</h2>
          
          <div className="form-group">
            <label htmlFor="name">Tiêu đề công việc *</label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={errors.name ? 'error' : ''}
              placeholder="Ví dụ: Frontend Developer"
            />
            {errors.name && <span className="error-message">{errors.name.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Địa điểm làm việc *</label>
              <input
                type="text"
                id="location"
                {...register('location')}
                className={errors.location ? 'error' : ''}
                placeholder="Ví dụ: Hà Nội, Hồ Chí Minh"
              />
              {errors.location && <span className="error-message">{errors.location.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="jobExperience">Kinh nghiệm yêu cầu *</label>
              <select
                id="jobExperience"
                {...register('jobExperience')}
                className={errors.jobExperience ? 'error' : ''}
              >
                <option value="">Chọn kinh nghiệm</option>
                <option value="Không yêu cầu">Không yêu cầu</option>
                <option value="Dưới 1 năm">Dưới 1 năm</option>
                <option value="1-2 năm">1-2 năm</option>
                <option value="2-3 năm">2-3 năm</option>
                <option value="3-5 năm">3-5 năm</option>
                <option value="Trên 5 năm">Trên 5 năm</option>
              </select>
              {errors.jobExperience && <span className="error-message">{errors.jobExperience.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="expirationDate">Ngày hết hạn *</label>
            <input
              type="date"
              id="expirationDate"
              {...register('expirationDate')}
              className={errors.expirationDate ? 'error' : ''}
            />
            {errors.expirationDate && <span className="error-message">{errors.expirationDate.message}</span>}
          </div>
        </div>

        {/* Mức lương */}
        <div className="form-section">
          <h2>Mức lương</h2>
          
          <div className="salary-grid">
            <div className="form-group">
              <label htmlFor="salaryMin">Lương tối thiểu *</label>
              <input
                type="number"
                id="salaryMin"
                {...register('salaryMin')}
                className={errors.salaryMin ? 'error' : ''}
                placeholder="0"
                min="0"
              />
              {errors.salaryMin && <span className="error-message">{errors.salaryMin.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="salaryMax">Lương tối đa *</label>
              <input
                type="number"
                id="salaryMax"
                {...register('salaryMax')}
                className={errors.salaryMax ? 'error' : ''}
                placeholder="0"
                min="0"
              />
              {errors.salaryMax && <span className="error-message">{errors.salaryMax.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="salaryCurrency">Đơn vị tiền tệ *</label>
              <select
                id="salaryCurrency"
                {...register('salaryCurrency')}
                className={errors.salaryCurrency ? 'error' : ''}
              >
                <option value="">Chọn đơn vị</option>
                <option value="VND">VND</option>
                <option value="USD">USD</option>
              </select>
              {errors.salaryCurrency && <span className="error-message">{errors.salaryCurrency.message}</span>}
            </div>
          </div>
        </div>

        {/* Yêu cầu công việc */}
        <div className="form-section">
          <h2>Yêu cầu công việc</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="jobLevel">Cấp bậc *</label>
              <select
                id="jobLevel"
                {...register('jobLevel')}
                className={errors.jobLevel ? 'error' : ''}
              >
                <option value="">Chọn cấp bậc</option>
                <option value="Intern">Thực tập sinh</option>
                <option value="Fresher">Fresher</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Manager">Manager</option>
                <option value="Director">Director</option>
              </select>
              {errors.jobLevel && <span className="error-message">{errors.jobLevel.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="jobEducation">Trình độ học vấn *</label>
              <select
                id="jobEducation"
                {...register('jobEducation')}
                className={errors.jobEducation ? 'error' : ''}
              >
                <option value="">Chọn trình độ</option>
                <option value="Cao đẳng">Cao đẳng</option>
                <option value="Đại học">Đại học</option>
                <option value="Thạc sĩ">Thạc sĩ</option>
                <option value="Tiến sĩ">Tiến sĩ</option>
                <option value="Không yêu cầu">Không yêu cầu</option>
              </select>
              {errors.jobEducation && <span className="error-message">{errors.jobEducation.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="jobFromWork">Hình thức làm việc *</label>
              <select
                id="jobFromWork"
                {...register('jobFromWork')}
                className={errors.jobFromWork ? 'error' : ''}
              >
                <option value="">Chọn hình thức</option>
                <option value="Toàn thời gian">Toàn thời gian</option>
                <option value="Bán thời gian">Bán thời gian</option>
                <option value="Làm từ xa">Làm từ xa</option>
                <option value="Thực tập">Thực tập</option>
              </select>
              {errors.jobFromWork && <span className="error-message">{errors.jobFromWork.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="jobHireNumber">Số lượng tuyển *</label>
              <input
                type="number"
                id="jobHireNumber"
                {...register('jobHireNumber')}
                className={errors.jobHireNumber ? 'error' : ''}
                placeholder="1"
                min="1"
              />
              {errors.jobHireNumber && <span className="error-message">{errors.jobHireNumber.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="jobCategoryId">Danh mục công việc *</label>
              <input
                type="number"
                id="jobCategoryId"
                {...register('jobCategoryId')}
                className={errors.jobCategoryId ? 'error' : ''}
                placeholder="ID danh mục"
              />
              {errors.jobCategoryId && <span className="error-message">{errors.jobCategoryId.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="companyId">ID Công ty *</label>
              <input
                type="number"
                id="companyId"
                {...register('companyId')}
                className={errors.companyId ? 'error' : ''}
                placeholder="ID công ty"
              />
              {errors.companyId && <span className="error-message">{errors.companyId.message}</span>}
            </div>
          </div>
        </div>

        {/* Mô tả công việc */}
        <div className="form-section">
          <h2>Mô tả công việc *</h2>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link']
              ]
            }}
            placeholder="Mô tả chi tiết về công việc, trách nhiệm, quyền lợi..."
          />
          {errors.jobDescription && <span className="error-message">{errors.jobDescription.message}</span>}
        </div>

        {/* Yêu cầu chi tiết */}
        <div className="form-section">
          <h2>Yêu cầu chi tiết *</h2>
          <ReactQuill
            theme="snow"
            value={requirements}
            onChange={setRequirements}
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link']
              ]
            }}
            placeholder="Mô tả chi tiết về kỹ năng, kinh nghiệm cần thiết..."
          />
          {errors.requirements && <span className="error-message">{errors.requirements.message}</span>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => window.history.back()}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang đăng tin...' : 'Đăng tin tuyển dụng'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobPage;
