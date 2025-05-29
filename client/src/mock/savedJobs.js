// src/mock/savedJobs.js
const mockSavedJobs = [
  {
    id: '1',
    title: 'Frontend Developer (React)',
    company: {
      name: 'Tech Corp',
      logo: 'https://example.com/tech-corp-logo.png'
    },
    location: 'Hồ Chí Minh',
    salary: {
      min: 25,
      max: 35,
      currency: 'triệu'
    },
    type: 'full-time',
    postedAt: '2024-05-15T08:00:00Z',
    tags: ['React', 'JavaScript', 'Redux']
  },
  // Thêm các job khác...
];

export default mockSavedJobs;
