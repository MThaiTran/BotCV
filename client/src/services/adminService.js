// src/services/adminService.js
export const adminService = {
  getAllUsers: async () => {
    // Mock data - sẽ được thay thế bằng API call thực tế
    await new Promise(resolve => setTimeout(resolve, 800)); // Giả lập độ trễ API
    
    return [
      {
        id: '1',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        role: 'employer',
        status: 'active',
        createdAt: '2024-01-15T08:00:00Z'
      },
      {
        id: '2',
        name: 'Trần Thị B',
        email: 'tranthib@example.com',
        role: 'candidate',
        status: 'active',
        createdAt: '2024-02-20T10:30:00Z'
      },
      {
        id: '3',
        name: 'Lê Văn C',
        email: 'levanc@example.com',
        role: 'employer',
        status: 'suspended',
        createdAt: '2024-03-05T14:15:00Z'
      },
      {
        id: '4',
        name: 'Phạm Thị D',
        email: 'phamthid@example.com',
        role: 'candidate',
        status: 'active',
        createdAt: '2024-03-18T09:45:00Z'
      }
    ];
  },
  
    updateUserStatus: async (userId, newStatus) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`User ${userId} status updated to ${newStatus}`);
      return { success: true };
    },
    
    deleteUser: async (userId) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`User ${userId} deleted`);
    return { success: true };
    },
    updateUser: async (userId, userData) => {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Giả lập response từ server
        const updatedUser = {
        ...userData,
        updatedAt: new Date().toISOString()
        };
        
        console.log('Updated user:', updatedUser);
        return updatedUser;
    },

    getAllJobs: async () => {
        // Mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return [
        {
            id: '1',
            title: 'Frontend Developer',
            company: 'Tech Corp',
            location: 'Hà Nội',
            salary: '20-30 triệu',
            description: '<p>Chúng tôi đang tìm kiếm Frontend Developer có kinh nghiệm...</p>',
            postedAt: '2024-05-01T08:00:00Z',
            status: 'approved'
        },
        {
            id: '2',
            title: 'Backend Developer',
            company: 'Digital Solutions',
            location: 'TP. HCM',
            salary: '25-35 triệu',
            description: '<p>Backend Developer với kinh nghiệm NodeJS, Express...</p>',
            postedAt: '2024-05-05T10:00:00Z',
            status: 'pending'
        },
        {
            id: '3',
            title: 'UI/UX Designer',
            company: 'Creative Studio',
            location: 'Đà Nẵng',
            salary: '15-25 triệu',
            description: '<p>Thiết kế giao diện người dùng cho các ứng dụng web và mobile...</p>',
            postedAt: '2024-05-03T09:30:00Z',
            status: 'rejected',
            rejectionReason: 'Thông tin không đầy đủ, thiếu mô tả chi tiết về yêu cầu công việc.'
        }
        ];
    },
    
    getJobById: async (id) => {
        // Mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const jobs = [
        {
            id: '1',
            title: 'Frontend Developer',
            company: 'Tech Corp',
            location: 'Hà Nội',
            salary: '20-30 triệu',
            description: '<p>Chúng tôi đang tìm kiếm Frontend Developer có kinh nghiệm...</p><ul><li>Có kinh nghiệm với React</li><li>Hiểu biết về HTML, CSS, JavaScript</li></ul>',
            postedAt: '2024-05-01T08:00:00Z',
            status: 'approved'
        },
        {
            id: '2',
            title: 'Backend Developer',
            company: 'Digital Solutions',
            location: 'TP. HCM',
            salary: '25-35 triệu',
            description: '<p>Backend Developer với kinh nghiệm NodeJS, Express...</p><ul><li>Có kinh nghiệm với NodeJS, Express</li><li>Hiểu biết về RESTful API</li></ul>',
            postedAt: '2024-05-05T10:00:00Z',
            status: 'pending'
        },
        {
            id: '3',
            title: 'UI/UX Designer',
            company: 'Creative Studio',
            location: 'Đà Nẵng',
            salary: '15-25 triệu',
            description: '<p>Thiết kế giao diện người dùng cho các ứng dụng web và mobile...</p><ul><li>Có kinh nghiệm với Figma, Adobe XD</li><li>Portfolio đa dạng</li></ul>',
            postedAt: '2024-05-03T09:30:00Z',
            status: 'rejected',
            rejectionReason: 'Thông tin không đầy đủ, thiếu mô tả chi tiết về yêu cầu công việc.'
        }
        ];
        
        return jobs.find(job => job.id === id);
    },
    
    updateJobStatus: async (id, status, reason = '') => {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`Job ${id} status updated to ${status}${reason ? ` with reason: ${reason}` : ''}`);
        return { success: true };
    },
    
    updateJob: async (id, jobData) => {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log('Job updated:', jobData);
        return { success: true };
    },
    
    deleteJob: async (id) => {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`Job ${id} deleted`);
        return { success: true };
    },
    createJob: async (jobData) => {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Giả lập response từ server
        const newJob = {
        id: Math.random().toString(36).substr(2, 9),
        ...jobData,
        postedAt: new Date().toISOString(),
        status: 'pending'
        };
        
        console.log('Created new job:', newJob);
        return newJob;
    },
    getBasicStats: async () => {
  // Mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        totalUsers: 2458,
        totalJobs: 876,
        totalApplications: 3254,
        totalCompanies: 345,
        pendingJobs: 23,
        pendingCompanies: 12,
        pendingReports: 5
    };
    },
    getAllCompanies: async () => {
    // Mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
        {
        id: '1',
        name: 'Công ty ABC',
        industry: 'Công nghệ thông tin',
        location: 'Hà Nội',
        website: 'https://abc.com',
        contactEmail: 'contact@abc.com',
        description: 'Công ty phát triển phần mềm',
        status: 'approved'
        },
        {
        id: '2',
        name: 'Công ty XYZ',
        industry: 'Tài chính',
        location: 'TP. HCM',
        website: 'https://xyz.com',
        contactEmail: 'contact@xyz.com',
        description: 'Công ty tài chính',
        status: 'pending'
        }
    ];
    },

    createCompany: async (companyData) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Giả lập response từ server
    const newCompany = {
        id: Math.random().toString(36).substr(2, 9),
        ...companyData,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    return newCompany;
    },

    updateCompany: async (id, companyData) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Giả lập response từ server
    return {
        ...companyData,
        updatedAt: new Date().toISOString()
    };
    },

    deleteCompany: async (id) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
    },

    updateCompanyStatus: async (id, status) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
    }
};
