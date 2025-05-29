// // src/pages/SavedJobsPage/SavedJobsPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import JobCard from '../../components/Job/JobCard';
// import '../../assets/css/Pages/candidate/SavedJobsPage.css';

// const SavedJobsPage = () => {
//   const { currentUser } = useAuth();
//   const [savedJobs, setSavedJobs] = useState([]);

//   useEffect(() => {
//     const fetchSavedJobs = async () => {
//       try {
//         const response = await fetch(`/api/users/${currentUser.id}/saved-jobs`);
//         const data = await response.json();
//         setSavedJobs(data);
//       } catch (error) {
//         console.error('Lỗi tải việc đã lưu:', error);
//       }
//     };
    
//     if (currentUser) {
//       fetchSavedJobs();
//     }
//   }, [currentUser]);

//   const handleUnsaveJob = async (jobId) => {
//     try {
//       await fetch(`/api/jobs/${jobId}/unsave`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ userId: currentUser.id })
//       });
//       setSavedJobs(prev => prev.filter(job => job.id !== jobId));
//     } catch (error) {
//       console.error('Lỗi bỏ lưu việc làm:', error);
//     }
//   };

//   return (
//     <div className="saved-jobs-page">
//       <h1>Việc làm đã lưu</h1>
//       <div className="saved-jobs-list">
//         {savedJobs.length > 0 ? (
//             savedJobs.map(job => (
//               <JobCard 
//                 key={job.id}
//                 job={job}
//                 onUnsave={() => handleUnsaveJob(job.id)}
//                 isSaved
//               />
//             ))
//             ) : (
//                 <p>Bạn chưa lưu công việc nào.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SavedJobsPage;


// src/pages/SavedJobsPage/SavedJobsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import JobCard from '../../components/Job/JobCard';
import { savedJobsService } from '../../mock/savedJobs';
import '../../assets/css/Pages/candidate/SavedJobsPage.css';

const SavedJobsPage = () => {
  const { currentUser } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        // Sử dụng mock service thay vì gọi API trực tiếp
        const data = await savedJobsService.getSavedJobs(currentUser.id);
        setSavedJobs(data);
      } catch (error) {
        console.error('Lỗi tải việc đã lưu:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchSavedJobs();
    }
  }, [currentUser]);

  const handleUnsaveJob = async (jobId) => {
    try {
      // Sử dụng mock service thay vì gọi API trực tiếp
      await savedJobsService.unsaveJob(jobId, currentUser.id);
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
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
            savedJobs.map(job => (
              <JobCard 
                key={job.id}
                id={job.id}
                title={job.title}
                company={job.company.name}
                location={job.location}
                salary={job.salary}
                type={job.type}
                postedAt={job.postedAt}
                tags={job.tags}
                onUnsave={() => handleUnsaveJob(job.id)}
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
