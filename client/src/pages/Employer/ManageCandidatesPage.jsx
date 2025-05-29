// src/pages/ManageCandidatesPage/ManageCandidatesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { candidateService } from '../../services/candidateService';
import '../../assets/css/Pages/Employer/ManageCandidatesPage.css';

const ManageCandidatesPage = () => {
  const { currentUser } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await candidateService.getCandidates(currentUser.companyId);
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };
    fetchCandidates();
  }, [currentUser]);

  const handleSendEmail = async (candidateId, type) => {
    const candidate = candidates.find(c => c.id === candidateId);
    try {
      await candidateService.sendCandidateEmail({
        email: candidate.email,
        type,
        position: candidate.appliedPosition,
        candidateName: candidate.name
      });
      alert(`Đã gửi ${type === 'invite' ? 'lời mời' : 'từ chối'} thành công`);
    } catch (error) {
      alert('Gửi email thất bại');
    }
  };

  return (
    <div className="manage-candidates-container">
      <div className="header-section">
        <h1>Quản lý ứng viên</h1>
        <br></br>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên ứng viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="candidates-table">
        <table>
          <thead>
            <tr>
              <th>Tên ứng viên</th>
              <th>Vị trí ứng tuyển</th>
              <th>Trạng thái</th>
              <th>Hồ sơ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {candidates
              .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(candidate => (
                <tr key={candidate.id}>
                  <td>{candidate.name}</td>
                  <td>{candidate.appliedPosition}</td>
                  <td>
                    <span className={`status-badge ${candidate.status}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td>
                    <Link 
                      to={`/candidates/${candidate.id}`}
                      className="view-profile-link"
                    >
                      Xem hồ sơ
                    </Link>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleSendEmail(candidate.id, 'invite')}
                      className="action-btn invite"
                    >
                      Gửi lời mời
                    </button>
                    <button 
                      onClick={() => handleSendEmail(candidate.id, 'reject')}
                      className="action-btn reject"
                    >
                      Từ chối
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCandidatesPage;
