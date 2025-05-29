// src/services/candidateService.js
export const candidateService = {
  getCandidates: async (companyId) => {
    // Mock data
    return [
      {
        id: '1',
        name: 'Nguyễn Văn A',
        email: 'a.nguyen@example.com',
        phone: '0912345678',
        address: 'Hà Nội',
        appliedPosition: 'Frontend Developer',
        appliedDate: '2024-05-01',
        status: 'pending',
        resumeUrl: '/cv/candidate-a.pdf',
        companyId: '1'
      }
    ];
  },

  getCandidateById: async (id) => {
    return {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'a.nguyen@example.com',
      phone: '0912345678',
      address: 'Hà Nội',
      appliedPosition: 'Frontend Developer',
      appliedDate: '2024-05-01',
      status: 'pending',
      resumeUrl: '/cv/candidate-a.pdf'
    };
  },

  sendCandidateEmail: async ({ email, type, position, candidateName }) => {
    // Integration with SMTP service
    const emailContent = {
      invite: `Kính gửi ${candidateName},...`,
      reject: `Kính gửi ${candidateName},...`
    };
    
    return fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: `Thông báo kết quả ứng tuyển ${position}`,
        body: emailContent[type]
      })
    });
  }
};
