// src/pages/SavedJobsPage/SavedJobsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import JobCard from '../../components/Job/JobCard';
import '../../assets/css/Pages/candidate/SavedJobsPage.css';

import mockSavedJobs from '../../mock/savedJobs';

const SavedJobsPage = () => {
  // const { currentUser } = useAuth();
  // const [savedJobs, setSavedJobs] = useState([]);

  // useEffect(() => {
  //   const fetchSavedJobs = async () => {
  //     try {
  //       const response = await fetch(`/api/users/${currentUser.id}/saved-jobs`);
  //       const data = await response.json();
  //       setSavedJobs(data);
  //     } catch (error) {
  //       console.error('Lỗi tải việc đã lưu:', error);
  //     }
  //   };
    
  //   if (currentUser) {
  //     fetchSavedJobs();
  //   }
  // }, [currentUser]);

  // const handleUnsaveJob = async (jobId) => {
  //   try {
  //     await fetch(`/api/jobs/${jobId}/unsave`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ userId: currentUser.id })
  //     });
  //     setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  //   } catch (error) {
  //     console.error('Lỗi bỏ lưu việc làm:', error);
  //   }
  // };

  const { currentUser } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    // Giả lập API call
    setTimeout(() => {
      setSavedJobs(mockSavedJobs);
    }, 300);
  }, [currentUser]);

  const handleUnsave = (jobId) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  return (
    <div className="saved-jobs-page">
      <h1>Việc làm đã lưu</h1>
      <div className="saved-jobs-list">
        {savedJobs.length > 0 ? (
            savedJobs.map(job => (
              <JobCard 
                key={job.id}
                job={job}
                onUnsave={() => handleUnsaveJob(job.id)}
                isSaved
              />
            ))
            ) : (
                <p>Bạn chưa ứng tuyển công việc nào.</p>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;
