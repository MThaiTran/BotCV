import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../../assets/css/Pages/Employer/PostJobPage.css';

const schema = yup.object().shape({
  name: yup.string().required('Tiêu đề là bắt buộc'),
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

  // Đảm bảo ReactQuill luôn đồng bộ với form
  const descriptionRef = useRef('');
  const requirementsRef = useRef('');

  const onSubmit = (data) => {
    // Chuẩn hóa dữ liệu gửi lên backend
    const payload = {
      name: data.name,
      salary: {
        min: data.salaryMin,
        max: data.salaryMax,
        currency: data.currency
      },
      location: data.location,
      description: data.description,
      requirements: data.requirements
    };
    console.log('Job Data:', payload);
    // Gửi payload này lên backend
  };

  return (
    <div className="post-job-container">
      <h1>Đăng tin tuyển dụng mới</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Thông tin chung */}
        <div className="form-section">
          <h2>Thông tin chung</h2>
          <br />
          <div className="form-group">
            <label>Tiêu đề công việc *</label>
            <input
              {...register('name')}
              className={errors.name ? 'error' : ''}
              placeholder="Nhập tiêu đề công việc"
            />
            {errors.name && <span className="error-message">{errors.name.message}</span>}
          </div>
          <div className="form-group">
            <label>Địa điểm làm việc *</label>
            <input
              {...register('location')}
              className={errors.location ? 'error' : ''}
              placeholder="Nhập địa điểm làm việc"
            />
            {errors.location && <span className="error-message">{errors.location.message}</span>}
          </div>
        </div>

        {/* Mức lương */}
        <div className="form-section">
          <h2>Mức lương</h2>
          <br />
          <div className="salary-grid">
            <div className="form-group">
              <input
                type="number"
                min="0"
                {...register('salaryMin')}
                className={errors.salaryMin ? 'error' : ''}
                placeholder="Lương tối thiểu"
              />
              {errors.salaryMin && <span className="error-message">{errors.salaryMin.message}</span>}
            </div>
            <div className="form-group">
              <input
                type="number"
                min="0"
                {...register('salaryMax')}
                className={errors.salaryMax ? 'error' : ''}
                placeholder="Lương tối đa"
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

        {/* Mô tả công việc */}
        <div className="form-section">
          <h2>Mô tả công việc *</h2>
          <br />
          <ReactQuill
            theme="snow"
            value={watch('description') || ''}
            onChange={(value) => {
              setValue('description', value);
              descriptionRef.current = value;
            }}
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

        {/* Yêu cầu công việc */}
        <div className="form-section">
          <h2>Yêu cầu công việc *</h2>
          <br />

          <div className="form-group">
            <label>Cấp bậc</label>
            <select {...register('jobLevel')} className={errors.jobLevel ? 'error' : ''}>
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
            <label>Trình độ học vấn</label>
            <select {...register('jobEducation')} className={errors.jobEducation ? 'error' : ''}>
              <option value="">Chọn trình độ</option>
              <option value="Cao đẳng">Cao đẳng</option>
              <option value="Đại học">Đại học</option>
              <option value="Thạc sĩ">Thạc sĩ</option>
              <option value="Tiến sĩ">Tiến sĩ</option>
              <option value="Không yêu cầu">Không yêu cầu</option>
            </select>
            {errors.jobEducation && <span className="error-message">{errors.jobEducation.message}</span>}
          </div>

          <div className="form-group">
            <label>Hình thức làm việc</label>
            <select {...register('jobFromWork')} className={errors.jobFromWork ? 'error' : ''}>
              <option value="">Chọn hình thức</option>
              <option value="Toàn thời gian">Toàn thời gian</option>
              <option value="Bán thời gian">Bán thời gian</option>
              <option value="Làm từ xa">Làm từ xa</option>
              <option value="Thực tập">Thực tập</option>
            </select>
            {errors.jobFromWork && <span className="error-message">{errors.jobFromWork.message}</span>}
          </div>

          <div className="form-group">
            <label>Số lượng tuyển</label>
            <input
              type="number"
              min="1"
              {...register('jobHireNumber')}
              className={errors.jobHireNumber ? 'error' : ''}
              placeholder="Nhập số lượng tuyển"
            />
            {errors.jobHireNumber && <span className="error-message">{errors.jobHireNumber.message}</span>}
          </div>

          <div className="form-group">
            <label>Mô tả yêu cầu chi tiết</label>
            <ReactQuill
              theme="snow"
              value={watch('requirements') || ''}
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
        </div>


        <button type="submit" className="submit-button">
          Đăng tin tuyển dụng
        </button>
      </form>
    </div>
  );
};

export default PostJobPage;
