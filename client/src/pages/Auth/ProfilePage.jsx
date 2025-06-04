// src/pages/ProfilePage/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import FileUpload from '../../components/FileUpload';
import '../../assets/css/Pages/Auth/ProfilePage.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const { id } = useParams();
  const { currentUser, updateProfile } = useAuth();
  const { register, handleSubmit, setValue, reset } = useForm();
  
  const [profileUser, setProfileUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [cvUrl, setCvUrl] = useState('');

  const fetchProfileUserData = async (userAccountId) => {
    setPageLoading(true);
    try {
      const seekerProfilesRes = await axios.get('/api/seekerProfile');
      const seekerProfiles = seekerProfilesRes.data.data;

      const seekerProfile = seekerProfiles.find(profile => profile.UserAccountID === userAccountId);

      if (!seekerProfile) throw new Error('Không tìm thấy seekerProfile phù hợp');

      const userAccRes = await axios.get(`/api/userAccount/${userAccountId}`);
      const userAcc = userAccRes.data.data;

      let cvUrl = null;
      try {
        const cvListRes = await axios.get('/api/cv');
        const cvList = cvListRes.data.data;
        const cv = cvList.find(item => item.SeekerProfileID === seekerProfile.ID);
        cvUrl = cv ? cv.CVFilePath : null;
      } catch (cvErr) {
        cvUrl = null;
      }

      const user = {
        ...seekerProfile,
        userAcc,
        cvUrl
      };
      setProfileUser(user);

    } catch (error) {
      setProfileUser(null);
      console.error('Lỗi lấy dữ liệu profile user:', error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfileUserData(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (profileUser) {
      setValue('fullName', profileUser.fullName || '');
      setValue('emailContact', profileUser.emailContact || '');
      setValue('phoneNumber', profileUser.phoneNumber || '');
      setCvUrl(profileUser.cvUrl || '');
      reset({
        fullName: profileUser.fullName || '',
        emailContact: profileUser.emailContact || '',
        phoneNumber: profileUser.phoneNumber || '',
        cvUrl: profileUser.cvUrl || ''
      });
    }
  }, [profileUser, setValue, reset]);

  const handleCancel = () => {
    setIsEditing(false);
    if (profileUser) {
      reset({
        fullName: profileUser.fullName || '',
        emailContact: profileUser.emailContact || '',
        phoneNumber: profileUser.phoneNumber || '',
        cvUrl: profileUser.cvUrl || ''
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      if (currentUser && profileUser && currentUser.ID === profileUser.UserAccountID) {
        console.log('Cập nhật dữ liệu:', data);
        await axios.put(`/api/seekerProfile/${profileUser.ID}`, {
          fullName: data.fullName,
          emailContact: data.emailContact,
          phoneNumber: data.phoneNumber,
          cvUrl: cvUrl
        });
        
        fetchProfileUserData(Number(id));

        setIsEditing(false);
      } else {
        console.log('Không có quyền chỉnh sửa hồ sơ này.');
      }

    } catch (error) {
      console.error('Lỗi cập nhật hồ sơ:', error);
    }
  };

  const canEdit = currentUser && profileUser && currentUser.ID === profileUser.UserAccountID;

  if (pageLoading) return <div>Đang tải hồ sơ...</div>;
  if (!profileUser) return <div>Không tìm thấy hồ sơ người dùng.</div>;

  return (
    <div className="profile-page">
      <h1>Hồ sơ cá nhân của {profileUser.fullName}</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="profile-section">
          <h2>Thông tin cá nhân</h2>
          {isEditing && canEdit ? (
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
                name="emailContact"
                register={register}
                disabled={!canEdit}
              />
              <Input
                label="Số điện thoại"
                type="tel"
                name="phoneNumber"
                register={register}
                disabled={!canEdit}
              />
            </>
          ) : (
            <>
              <div className="profile-field">
                <label>Họ và tên:</label>
                <p>{profileUser?.fullName || 'Chưa cập nhật'}</p>
              </div>
              <div className="profile-field">
                <label>Email:</label>
                <p>{profileUser?.emailContact || 'Chưa cập nhật'}</p>
              </div>
              <div className="profile-field">
                <label>Số điện thoại:</label>
                <p>{profileUser?.phoneNumber || 'Chưa cập nhật'}</p>
              </div>
            </>
          )}
        </div>

        <div className="profile-section">
          <h2>Hồ sơ CV</h2>
          {isEditing && canEdit ? (
            <FileUpload 
              onFileUpload={(file) => {/* Xử lý upload file */}}
              existingFile={profileUser.cvUrl}
              disabled={!canEdit}
            />
          ) : (
            <div className="profile-field">
              <label>CV:</label>
              {profileUser?.cvUrl ? (
                <a href={profileUser.cvUrl} target="_blank" rel="noopener noreferrer">
                  Xem CV
                </a>
              ) : (
                <p>Chưa tải lên CV</p>
              )}
            </div>
          )}
        </div>

        {canEdit && (
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
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
