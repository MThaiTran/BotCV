import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { candidateService } from '../../services/candidateService';
import '../../assets/css/Pages/candidate/CandidateDetailPage.css';

const CandidateDetailPage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      const data = await candidateService.getCandidateById(id);
      setProfile(data);
    };
    fetchCandidate();
  }, [id]);

  if (!profile) return <div>Loading...</div>;

  const { seekerProfile, applications, cv } = profile;

  return (
    <div className="candidate-detail-container">
      <h1>Hồ sơ ứng viên: {seekerProfile.fullName}</h1>
      
      <div className="profile-section">
        <h2>Thông tin cá nhân</h2>
        <p>Email: {seekerProfile.emailContact}</p>
        <p>SĐT: {seekerProfile.phoneNumber}</p>
        <p>Địa chỉ: {seekerProfile.address}</p>
      </div>

      <div className="application-section">
        <h2>Thông tin ứng tuyển</h2>
        {applications && applications.length > 0 ? (
          applications.map((app) => (
            <div key={app.id} className="application-info">
              <p>Vị trí: {app.job.name}</p>
              <p>Ngày ứng tuyển: {new Date(app.appliedDate).toLocaleDateString()}</p>
              <p>Trạng thái: <span className={`status-${app.status}`}>{app.status}</span></p>
            </div>
          ))
        ) : (
          <p>Chưa ứng tuyển công việc nào.</p>
        )}
      </div>

      <div className="resume-section">
        <h2>Hồ sơ đính kèm</h2>
        {cv && cv.cvFilePath ? (
          <div>
            <iframe 
              src={cv.cvFilePath}
              title="Candidate Resume"
              className="resume-iframe"
            />
            <a 
              href={cv.cvFilePath}
              download
              className="download-resume-btn"
            >
              Tải xuống CV
            </a>
          </div>
        ) : (
          <p>Không có hồ sơ đính kèm.</p>
        )}
      </div>
    </div>
  );
};

export default CandidateDetailPage;
