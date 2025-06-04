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

  useEffect(() => {
    const fetchApplications = async (seekerProfileId) => {
      try {
        const response = await axios.get('/api/appliedJob?page=1&limit=100');
        const filtered = response.data.data.filter(
          (app) => app.SeekerProfileID === seekerProfileId
        );
        console.log("FRTTTTTT", filtered);
        console.log("FRTTTTTT", response.data.data);
        setApplications(filtered);
        console.log('Fetched applications:', filtered);
      } catch (error) {
        console.error('Lỗi tải ứng tuyển:', error);
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
