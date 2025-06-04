// src/pages/ApplicationsPage/ApplicationsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import ApplicationCard from '../../components/ApplicationCard';
import '../../assets/css/Pages/candidate/ApplicationsPage.css';

import mockApplications from '../../mock/applications';
const FIXED_SEEKER_PROFILE_ID = 1;

const ApplicationsPage = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async (seekerProfileId) => {
      setIsLoading(true);
      try {
        // Fetch đồng thời đơn ứng tuyển của người dùng hiện tại, tất cả jobs và tất cả companies
        const [applicationsResponse, jobsData, companiesData] = await Promise.all([
          axios.get('/api/appliedJob?page=1&limit=100'), // Lấy tất cả đơn ứng tuyển (sẽ lọc sau)
          axios.get('/api/job'), // Lấy tất cả jobs
          axios.get('/api/company'), // Lấy tất cả companies
        ]);

        // Log dữ liệu thô từ các API
        console.log('Raw applications response:', applicationsResponse);
        console.log('Raw jobs data:', jobsData);
        console.log('Raw companies data:', companiesData);

        // Lọc đơn ứng tuyển chỉ của người dùng hiện tại (SeekerProfileID)
        // Giả định applicationsResponse là một mảng
        const userApplications = (applicationsResponse.data.data || []).filter(
          (app) => app.SeekerProfileID === seekerProfileId
        );

        // Ánh xạ đơn ứng tuyển để thêm tên công ty và tên job
        const enrichedApplications = userApplications.map(app => {
          // Tìm job tương ứng dựa vào JobID (giả định API appliedJob trả về JobID)
          // Kiểm tra jobID tồn tại và tìm trong jobsData
          const job = (jobsData.data.data || []).find(j => j.ID === app.JobID || j.id === app.JobID);
          const companyName = job ? ((companiesData.data.data || []).find(c => c.ID === job.CompanyID || c.id === job.CompanyID)?.name || 'N/A') : 'N/A';
          const jobName = job ? (job.name || job.jobTitle || 'N/A') : 'N/A';

          return {
            ...app, // Giữ lại tất cả thông tin gốc của đơn ứng tuyển
            companyName: companyName,
            jobName: jobName,
          };
        });

        console.log('Fetched and enriched applications:', enrichedApplications);
        setApplications(enrichedApplications);

      } catch (error) {
        console.error('Lỗi tải dữ liệu ứng tuyển:', error);
        setApplications([]); // Đảm bảo state là mảng rỗng khi lỗi
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.ID) {
      fetchApplications(currentUser.ID);
    } else {
      setApplications([]);
      console.log('No current user found, clearing applications.');
    }

  }, [currentUser]);

  return (
    <div className="applications-page">
      <h1>Đơn ứng tuyển của bạn</h1>
      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="applications-list">
          {applications.length > 0 ? (
            applications.map(application => (
              <ApplicationCard 
                key={application.ID}
                application={application}
              />
            ))
          ) : (
            <p>Bạn chưa ứng tuyển công việc nào.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
