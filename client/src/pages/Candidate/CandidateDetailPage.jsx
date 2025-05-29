// src/pages/CandidateDetailPage/CandidateDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { candidateService } from '../../services/candidateService';
import '../../assets/css/Pages/candidate/CandidateDetailPage.css';

const CandidateDetailPage = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      const data = await candidateService.getCandidateById(id);
      setCandidate(data);
    };
    fetchCandidate();
  }, [id]);

  if (!candidate) return <div>Loading...</div>;

  return (
    <div className="candidate-detail-container">
      <h1>Hồ sơ ứng viên: {candidate.name}</h1>
      
      <div className="profile-section">
        <h2>Thông tin cá nhân</h2>
        <p>Email: {candidate.email}</p>
        <p>SĐT: {candidate.phone}</p>
        <p>Địa chỉ: {candidate.address}</p>
      </div>

      <div className="application-section">
        <h2>Thông tin ứng tuyển</h2>
        <p>Vị trí: {candidate.appliedPosition}</p>
        <p>Ngày ứng tuyển: {new Date(candidate.appliedDate).toLocaleDateString()}</p>
        <p>Trạng thái: <span className={`status-${candidate.status}`}>{candidate.status}</span></p>
      </div>

      <div className="resume-section">
        <h2>Hồ sơ đính kèm</h2>
        {candidate.length > 0 ? (
            <div>
                <iframe 
                src={candidate.resumeUrl} 
                title="Candidate Resume"
                className="resume-iframe"
                />
                <a 
                href={candidate.resumeUrl} 
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
