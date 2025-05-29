// src/pages/ProfilePage/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import FileUpload from '../../components/FileUpload';
import '../../assets/css/Pages/Auth/ProfilePage.css';

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const { register, handleSubmit, setValue, reset } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [cvUrl, setCvUrl] = useState('');

  // Load initial data
  useEffect(() => {
    if (currentUser) {
      setValue('fullName', currentUser.fullName || '');
      setValue('email', currentUser.email || '');
      setValue('education.school', currentUser.education?.school || '');
      setValue('education.major', currentUser.education?.major || '');
      setValue('experience.company', currentUser.experience?.company || '');
      setValue('experience.position', currentUser.experience?.position || '');
      setCvUrl(currentUser.cvUrl || '');
    }
  }, [currentUser, setValue]);

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      await updateProfile({
        ...data,
        cvUrl
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Lỗi cập nhật hồ sơ:', error);
    }
  };

  return (
    <div className="profile-page">
      <h1>Hồ sơ cá nhân</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Thông tin cơ bản */}
        <div className="profile-section">
          <h2>Thông tin cá nhân</h2>
          {isEditing ? (
            <>
              <Input
                label="Họ và tên"
                name="fullName"
                register={register}
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                register={register}
                disabled
              />
            </>
          ) : (
            <>
              <div className="profile-field">
                <label>Họ và tên:</label>
                <p>{currentUser?.fullName || 'Chưa cập nhật'}</p>
              </div>
              <div className="profile-field">
                <label>Email:</label>
                <p>{currentUser?.email || 'Chưa cập nhật'}</p>
              </div>
            </>
          )}
        </div>

        {/* Học vấn */}
        <div className="profile-section">
          <h2>Học vấn</h2>
          {isEditing ? (
            <>
              <Input
                label="Trường Đại học"
                name="education.school"
                register={register}
              />
              <Input
                label="Chuyên ngành"
                name="education.major"
                register={register}
              />
            </>
          ) : (
            <>
              <div className="profile-field">
                <label>Trường:</label>
                <p>{currentUser?.education?.school || 'Chưa cập nhật'}</p>
              </div>
              <div className="profile-field">
                <label>Chuyên ngành:</label>
                <p>{currentUser?.education?.major || 'Chưa cập nhật'}</p>
              </div>
            </>
          )}
        </div>

        {/* Kinh nghiệm */}
        <div className="profile-section">
          <h2>Kinh nghiệm làm việc</h2>
          {isEditing ? (
            <>
              <Input
                label="Công ty"
                name="experience.company"
                register={register}
              />
              <Input
                label="Vị trí"
                name="experience.position"
                register={register}
              />
            </>
          ) : (
            <>
              <div className="profile-field">
                <label>Công ty:</label>
                <p>{currentUser?.experience?.company || 'Chưa cập nhật'}</p>
              </div>
              <div className="profile-field">
                <label>Vị trí:</label>
                <p>{currentUser?.experience?.position || 'Chưa cập nhật'}</p>
              </div>
            </>
          )}
        </div>

        {/* CV */}
        <div className="profile-section">
          <h2>Hồ sơ CV</h2>
          {isEditing ? (
            <FileUpload 
              onFileUpload={(file) => {/* Xử lý upload file */}}
              existingFile={cvUrl}
            />
          ) : (
            <div className="profile-field">
              <label>CV:</label>
              {cvUrl ? (
                <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                  Xem CV
                </a>
              ) : (
                <p>Chưa tải lên CV</p>
              )}
            </div>
          )}
        </div>

        {/* Nút điều khiển */}
        <div className="profile-actions">
          {isEditing ? (
            <>
              <Button type="submit" variant="primary">Lưu thay đổi</Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
            </>
          ) : (
            <Button type="button" variant="primary" onClick={() => setIsEditing(true)}>
              Chỉnh sửa hồ sơ
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
