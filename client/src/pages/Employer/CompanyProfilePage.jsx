import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReactQuill from 'react-quill-new';
import FileUpload from '../../components/FileUpload';
import 'react-quill-new/dist/quill.snow.css';
import '../../assets/css/Components/CompanyProfilePage.css';

const schema = yup.object().shape({
  name: yup.string().required('Tên công ty là bắt buộc'),
  industry: yup.string().required('Lĩnh vực hoạt động là bắt buộc'),
  location: yup.string().required('Địa chỉ là bắt buộc'),
  website: yup.string().url('URL không hợp lệ').nullable(),
  contactEmail: yup.string().email('Email không hợp lệ').nullable(),
  description: yup.string().required('Giới thiệu công ty là bắt buộc')
});

const CompanyProfilePage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  // State cho ReactQuill và ảnh
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // Đồng bộ description với react-hook-form
  useEffect(() => {
    setValue('description', description);
  }, [description, setValue]);

  // Giả lập fetch dữ liệu công ty (nếu là trang cập nhật)
  useEffect(() => {
    // TODO: fetch company profile nếu cần
    // setValue('name', ...);
    // setDescription(...);
    // setLogo(...);
    // setCoverImage(...);
  }, [setValue]);

  const onSubmit = (data) => {
    // Chuẩn hóa dữ liệu gửi lên backend
    const payload = {
      ...data,
      logo,        // file hoặc url
      coverImage,  // file hoặc url
    };
    console.log('Company Profile:', payload);
    // TODO: Gửi payload lên backend
  };

  return (
    <div className="company-profile-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Upload ảnh logo */}
        <div className="logo-section">
          <FileUpload
            label="Logo công ty"
            onFileUpload={setLogo}
            existingFile={logo}
            accept="image/*"
          />
        </div>

        {/* Upload ảnh bìa */}
        <div className="cover-section">
          <FileUpload
            label="Ảnh bìa công ty"
            onFileUpload={setCoverImage}
            existingFile={coverImage}
            accept="image/*"
          />
        </div>

        {/* Thông tin cơ bản */}
        <div className="form-section">
          <div className="form-group">
            <label>Tên công ty *</label>
            <input {...register('name')} />
            {errors.name && <span className="error">{errors.name.message}</span>}
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
          <div className="form-group">
            <label>Website</label>
            <input {...register('website')} />
            {errors.website && <span className="error">{errors.website.message}</span>}
          </div>
          <div className="form-group">
            <label>Email liên hệ</label>
            <input {...register('contactEmail')} />
            {errors.contactEmail && <span className="error">{errors.contactEmail.message}</span>}
          </div>
        </div>

        {/* Giới thiệu công ty */}
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
          {errors.description && <span className="error">{errors.description.message}</span>}
        </div>

        <button type="submit" className="submit-button">
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default CompanyProfilePage;
