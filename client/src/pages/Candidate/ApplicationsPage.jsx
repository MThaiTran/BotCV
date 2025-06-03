// src/pages/ApplicationsPage/ApplicationsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import ApplicationCard from '../../components/ApplicationCard';
import '../../assets/css/Pages/candidate/ApplicationsPage.css';

import mockApplications from '../../mock/applications';
const FIXED_SEEKER_PROFILE_ID = 1;

const ApplicationsPage = () => {
  // const { currentUser } = useAuth();
  // const [applications, setApplications] = useState([]);

  // useEffect(() => {
  //   const fetchApplications = async () => {
  //     try {
  //       const response = await fetch(`/api/users/${currentUser.id}/applications`);
  //       const data = await response.json();
  //       setApplications(data);
  //     } catch (error) {
  //       console.error('Lỗi tải ứng tuyển:', error);
  //     }
  //   };
    
  //   if (currentUser) {
  //     fetchApplications();
  //   }
  // }, [currentUser]);

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Giả lập fetch API
    // setTimeout(() => {
    //   setApplications(mockApplications);
    // }, 300);
    const fetchApplications = async () => {
      try {
        const response = await axios.get('/api/appliedJob');
        const filtered = response.data.data.filter(
          (app) => app.SeekerProfileID === FIXED_SEEKER_PROFILE_ID
        );
        setApplications(filtered);
        console.log(response.data.data);
        // setApplications(response.data.data);
      } catch (error) {
        console.error('Lỗi tải ứng tuyển:', error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="applications-page">
      <h1>Đơn ứng tuyển của bạn</h1>
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
    </div>
  );
};

export default ApplicationsPage;
