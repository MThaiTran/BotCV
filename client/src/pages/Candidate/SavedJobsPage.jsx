import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import JobCard from '../../components/Job/JobCard';
import { savedJobsService } from '../../mock/savedJobs';
import '../../assets/css/Pages/candidate/SavedJobsPage.css';

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
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        const data = await savedJobsService.getSavedJobs(currentUser.id);
        setSavedJobs(data);
      } catch (error) {
        console.error('Lỗi tải việc đã lưu:', error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchSavedJobs();
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
              <JobCard 
                key={item.id}
                id={item.job.id}
                title={item.job.name}
                company={item.job.company.name}
                location={item.job.location}
                salary={item.job.salary}
                type={item.job.type}
                postedAt={item.job.postedAt}
                tags={item.job.tags}
                onUnsave={() => handleUnsaveJob(item.id)}
                isSaved={true}
              />
            ))
          ) : (
            <p>Bạn chưa lưu công việc nào.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;