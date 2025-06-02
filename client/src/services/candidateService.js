// src/services/candidateService.js
export const candidateService = {
  getCandidates: async (companyId) => {
    // Mock data
    return [
      {
        id: "appliedJobId1",
        status: "pending",
        appliedDate: "2025-05-30T10:00:00Z",
        seekerProfile: {
          id: "seeker1",
          fullName: "Nguyễn Văn A",
          emailContact: "a.nguyen@example.com",
          phoneNumber: "0912345678"
        },
        job: {
          id: "job1",
          name: "Frontend Developer"
        }
      }
    ];
  },

  getCandidateById: async (id) => {
    return {
      seekerProfile: {
        id: 1,
        fullName: "Nguyễn Văn A",
        phoneNumber: "0912345678",
        emailContact: "a.nguyen@example.com",
        address: "Hà Nội"
      },
      applications: [
        {
          id: 5,
          job: { name: "Frontend Developer" },
          appliedDate: "2025-05-30T10:00:00Z",
          status: "pending"
        }
      ],
      cv: {
        id: 10,
        cvFilePath: "/uploads/cv_nguyenvana.pdf"
      }
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
