// src/mock/applications.js
const mockApplications = [
  {
    id: 'app01',
    jobId: '1',
    jobTitle: 'Frontend Developer',
    company: 'Công ty ABC',
    appliedDate: '2024-04-10T08:00:00Z',
    status: 'pending', // pending | reviewed | accepted | rejected
    cvUrl: '/cvs/cv-nguyenvana.pdf'
  },
  {
    id: 'app02',
    jobTitle: 'Backend Developer',
    company: 'Công ty XYZ',
    appliedDate: '2024-04-15T10:00:00Z',
    status: 'reviewed',
    cvUrl: '/cvs/cv-nguyenvana.pdf'
  },
  {
    id: 'app03',
    jobTitle: 'UI/UX Designer',
    company: 'Design Studio',
    appliedDate: '2024-04-20T09:00:00Z',
    status: 'accepted',
    cvUrl: '/cvs/cv-nguyenvana.pdf'
  }
];

export default mockApplications;
