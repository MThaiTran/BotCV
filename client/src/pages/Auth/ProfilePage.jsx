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
      setValue('phoneNumber', currentUser.phoneNumber || '');
      setCvUrl(currentUser.cvUrl || '');
    }
  }, [currentUser, setValue]);

  const handleCancel = () => {
    setIsEditing(false);
    reset();
    if (currentUser) {
      setValue('fullName', currentUser.fullName || '');
      setValue('email', currentUser.email || '');
      setValue('phoneNumber', currentUser.phoneNumber || '');
      setCvUrl(currentUser.cvUrl || '');
    }
  };

  const onSubmit = async (data) => {
    try {
      await updateProfile({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        cvUrl: cvUrl
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
              <Input
                label="Số điện thoại"
                type="tel"
                name="phoneNumber"
                register={register}
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
              <div className="profile-field">
                <label>Số điện thoại:</label>
                <p>{currentUser?.phoneNumber || 'Chưa cập nhật'}</p>
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
            currentUser && (
              <Button type="button" variant="primary" onClick={() => setIsEditing(true)}>
                Chỉnh sửa hồ sơ
              </Button>
            )
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
