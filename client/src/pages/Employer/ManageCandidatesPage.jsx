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
        const targetCompanyId = 1; // CompanyID cần lọc
        const finalCandidates = []; // Mảng cuối cùng chứa ứng viên

        // 1. Lấy tất cả jobs và lọc theo CompanyID
        const allJobs = await candidateService.getAllJobs();
        const jobsCO = allJobs.filter(job => job.CompanyID === targetCompanyId);
        const jobIdsCO = jobsCO.map(job => job.ID); // Lấy danh sách JobID của công ty

        // 2. Lấy tất cả appliedJobs và lọc theo JobID
        const allAppliedJobs = await candidateService.getAllAppliedJobs();
        const appliedJobCO = allAppliedJobs.filter(appliedJob =>
          appliedJob.JobID && jobIdsCO.includes(appliedJob.JobID) // Lọc appliedJob có JobID thuộc danh sách job của công ty
        );
        const seekerProfileIdsCO = appliedJobCO.map(appliedJob => appliedJob.SeekerProfileID); // Lấy danh sách SeekerProfileID từ các appliedJob đã lọc

        // 3. Lấy tất cả seekerProfiles và lọc theo SeekerProfileID
        const allSeekerProfiles = await candidateService.getAllSeekerProfiles();
        const seekerProfilesCO = allSeekerProfiles.filter(seekerProfile =>
          seekerProfile.ID && seekerProfileIdsCO.includes(seekerProfile.ID) // Lọc seekerProfile có ID thuộc danh sách cần tìm
        );

        // 4. Kết hợp dữ liệu để tạo mảng candidates cuối cùng
        // Duyệt qua các appliedJob đã lọc và kết hợp với thông tin job và seekerProfile
        appliedJobCO.forEach(appliedJob => {
          const job = jobsCO.find(j => j.ID === appliedJob.JobID);
          const seekerProfile = seekerProfilesCO.find(sp => sp.ID === appliedJob.SeekerProfileID);

          // Chỉ thêm vào nếu tìm thấy cả job và seekerProfile
          if (job && seekerProfile) {
            finalCandidates.push({
              ...appliedJob, // Giữ lại thông tin từ appliedJob
              id: appliedJob.id || appliedJob.ID, // Đảm bảo có trường id
              job: { // Thông tin job
                id: job.id || job.ID,
                name: job.name // Giả sử trường tên job là 'name'
              },
              seekerProfile: { // Thông tin seekerProfile
                id: seekerProfile.id || seekerProfile.ID,
                fullName: seekerProfile.fullName, // Giả sử trường tên đầy đủ là 'fullName'
                emailContact: seekerProfile.emailContact, // Giả sử trường email là 'emailContact'
                phoneNumber: seekerProfile.phoneNumber // Giả sử trường số điện thoại là 'phoneNumber'
                // Thêm các trường khác nếu cần cho hiển thị
              }
              // Cần đảm bảo các trường status, appliedDate (hoặc tên tương đương) có sẵn từ appliedJob
            });
          }
        });

        setCandidates(finalCandidates);

      } catch (error) {
        console.error('Error fetching, filtering, and combining candidate data:', error);
        setCandidates([]); // Set empty array on error
      }
    };
    fetchCandidates();
  }, []);

  const handleSendEmail = async (appliedJobId, type) => {
    const appliedJob = candidates.find(c => c.id === appliedJobId);
    try {
      await candidateService.sendCandidateEmail({
        email: appliedJob.seekerProfile.emailContact,
        type,
        position: appliedJob.job.name,
        candidateName: appliedJob.seekerProfile.fullName
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
            {candidates
              // Lọc theo searchTerm trên mảng candidates đã chuẩn bị
              .filter(candidate => candidate.seekerProfile && candidate.seekerProfile.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(appliedJob => ( // Vẫn gọi là appliedJob vì cấu trúc dữ liệu tương tự
                <tr key={appliedJob.id}>
                  <td>{appliedJob.seekerProfile.fullName}</td>
                  <td>{appliedJob.job.name}</td>
                  <td>
                    <span className={`status-badge ${appliedJob.status}`}>
                      {appliedJob.status}
                    </span>
                  </td>
                  <td>
                    <Link 
                      to={`/candidates/${appliedJob.seekerProfile.id}`}
                      className="view-profile-link"
                    >
                      Xem hồ sơ
                    </Link>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleSendEmail(appliedJob.id, 'invite')}
                      className="action-btn invite"
                    >
                      Gửi lời mời
                    </button>
                    <button 
                      onClick={() => handleSendEmail(appliedJob.id, 'reject')}
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
