import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SavedJobCard from '../../components/Job/SavedJobCard';
import { savedJobsService } from '../../mock/savedJobs';
import '../../assets/css/Pages/candidate/SavedJobsPage.css';
import axios from 'axios';

const SavedJobsPage = () => {
  const { currentUser } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);


  //useEffect(() => {
  //   const fetchSavedJobs = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch(`/api/users/${currentUser.id}/saved-jobs`);
  //       const data = await response.json();
  //       // Giả sử API trả về [{id, addedDate, job: {id, name, company, ...}}]
  //       setSavedJobs(data);
  //     } catch (error) {
  //       console.error('Lỗi tải việc đã lưu:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   if (currentUser) fetchSavedJobs();
  // }, [currentUser]);

  // const handleUnsaveJob = async (wishlistId) => {
  //   try {
  //     await fetch(`/api/saved-jobs/${wishlistId}/unsave`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ userId: currentUser.id })
  //     });
  //     setSavedJobs(prev => prev.filter(item => item.id !== wishlistId));
  //   } catch (error) {
  //     console.error('Lỗi bỏ lưu việc làm:', error);
  //   }
  // };

  
  useEffect(() => {
    const fetchSavedJobs = async (seekerProfileId) => {
      try {
        const response = await axios.get('/api/wishlistJob?page=1&limit=100');
        const filtered = response.data.data.filter(
          (app) => app.SeekerProfileID === seekerProfileId
        );
        
        // Fetch job details for each filtered item
        const jobsWithDetails = await Promise.all(
          filtered.map(async (item) => {
            const jobResponse = await axios.get(`/api/job/${item.JobID}`);
            return {
              ...item,
              ...jobResponse.data
            };
          })
        );
        
        setSavedJobs(jobsWithDetails);
        console.log('Saved jobs with details:', jobsWithDetails);
      } catch (error) {
        console.error('Lỗi tải việc lưu', error);
      }
    };

    if (currentUser?.ID) {
      fetchSavedJobs(currentUser.ID);

      setLoading(false);
    } else {
      setSavedJobs([]);
      console.log('No current user found, clearing applications.');
    }

  }, [currentUser]);

  const handleUnsaveJob = async (wishlistId) => {
    try {
      await savedJobsService.unsaveJob(wishlistId, currentUser.id);
      setSavedJobs(prev => prev.filter(item => item.id !== wishlistId));
    } catch (error) {
      console.error('Lỗi bỏ lưu việc làm:', error);
    }
  };

  return (
    <div className="saved-jobs-page">
      <h1>Việc làm đã lưu</h1>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="saved-jobs-list">
          {savedJobs.length > 0 ? (
            savedJobs.map(item => (
              <SavedJobCard 
                {...console.log('Rendering job card for:', item)}
                key={item.ID}
                ID={item.ID}
                name={item.name}
                jobExperience={item.jobExperience}
                salaryRange={item.salaryRange}
                expirationDate={item.expirationDate}
                jobLevel={item.jobLevel}
                jobEducation={item.jobEducation}
                jobFromWork={item.jobFromWork}
                onUnsave={() => handleUnsaveJob(item.id)}
                isSaved={true}
              />
            ))
          ) : (
            <p>Bạn chưa lưu công việc nào.</p>
          )}
        </div>
      )}
      {console.log('Loading...', loading)}
    </div>
  );
};

export default SavedJobsPage;