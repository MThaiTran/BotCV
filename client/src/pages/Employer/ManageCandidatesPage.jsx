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
        const targetCompanyId = 1; // CompanyID cần lấy ứng viên

        // Gọi API mới để lấy danh sách ứng viên của công ty
        // API endpoint: GET /api/company/:id/candidates
        const apiCandidates = await candidateService.getCompanyCandidates(targetCompanyId);

        // Ánh xạ dữ liệu từ cấu trúc API sang cấu trúc frontend mong muốn
        const mappedCandidates = apiCandidates.map(item => ({
          // Giả định các trường sau có trong dữ liệu trả về từ API
          id: item.appliedJobId, // Sử dụng appliedJobId làm id chính
          status: item.status || 'N/A', // Giả định có trường status hoặc set mặc định
          appliedDate: item.appliedDate, // Giữ lại appliedDate nếu cần
          job: { // Tạo đối tượng job lồng nhau
            id: item.jobId, // Giả định có jobId
            name: item.jobName || 'N/A' // <-- Cần đảm bảo API trả về tên job, nếu không bạn sẽ cần fetch thêm jobs
          },
          seekerProfile: { // Tạo đối tượng seekerProfile lồng nhau
            id: item.ID, // Giả định ID ở đây là SeekerProfile ID
            fullName: item.fullName, // Giả định có fullName
            emailContact: item.emailContact, // Giả định có emailContact
            phoneNumber: item.phoneNumber // Giả định có phoneNumber
            // Thêm các trường seekerProfile khác nếu API trả về
          },
          // Thêm các trường khác ở cấp cao nhất nếu cần từ API (ví dụ: UserAccountID)
          UserAccountID: item.UserAccountID
        }));

        setCandidates(mappedCandidates);

      } catch (error) {
        console.error('Error fetching and mapping company candidate data:', error);
        setCandidates([]); // Set empty array on error
      }
    };

    fetchCandidates();
    // Thêm currentUser?.companyId vào dependency array nếu muốn fetch lại khi CompanyID thay đổi
  }, [currentUser]);

  const handleSendEmail = async (appliedJobId, type) => {
    // Tìm ứng viên trong state candidates dựa trên appliedJobId (giờ là id chính)
    const appliedJob = candidates.find(c => c.id === appliedJobId);
    if (!appliedJob) {
      console.error('Applied job not found for sending email:', appliedJobId);
      alert('Không tìm thấy thông tin ứng viên.');
      return;
    }
    try {
      // Sử dụng cấu trúc dữ liệu đã được ánh xạ
      await candidateService.sendCandidateEmail({
        email: appliedJob.seekerProfile?.emailContact, // Sử dụng optional chaining
        type,
        position: appliedJob.job?.name, // Sử dụng optional chaining
        candidateName: appliedJob.seekerProfile?.fullName // Sử dụng optional chaining
      });
      alert(`Đã gửi ${type === 'invite' ? 'lời mời' : 'từ chối'} thành công`);
    } catch (error) {
      console.error('Gửi email thất bại:', error);
      alert('Gửi email thất bại');
    }
  };

  // Lọc ứng viên theo searchTerm trên mảng candidates đã được ánh xạ
  const filteredCandidates = candidates.filter(candidate =>
    candidate.seekerProfile && candidate.seekerProfile.fullName && 
    candidate.seekerProfile.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-candidates-container">
      <div className="header-section">
        <h1>Quản lý ứng viên</h1>
        <br />
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
            {filteredCandidates.map(candidate => ( 
              <tr key={candidate.id}> 
                <td>{candidate.seekerProfile?.fullName || 'N/A'}</td> 
                <td>{candidate.job?.name || 'N/A'}</td> 
                <td>
                  <span className={`status-badge ${candidate.status || ''}`}>
                    {candidate.status || 'N/A'}
                  </span>
                </td>
                <td>
                  <Link 
                    to={`/candidates/${candidate.seekerProfile?.id || ''}`} 
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
