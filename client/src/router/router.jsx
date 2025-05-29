// src/router/router.jsx
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import ProtectedRoute from './protectedRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import SignupPage from '../pages/Auth/SignupPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import JobSearchPage from '../pages/Job/JobSearchPage';
import JobDetailPage from '../pages/Job/JobDetailPage';
import ProfilePage from '../pages/Auth/ProfilePage';
import ApplicationsPage from '../pages/Candidate/ApplicationsPage';
import SavedJobsPage from '../pages/Candidate/SavedJobsPage';
import CompanyProfilePage from '../components/CompanyProfilePage';
import PostJobPage from '../pages/Employer/PostJobPage';
import ManageJobsPage from '../pages/Employer/ManageJobsPage';
import ManageCandidatesPage from '../pages/Employer/ManageCandidatesPage';
import CandidateDetailPage from '../pages/Candidate/CandidateDetailPage';
import AdminUserManagementPage from '../pages/Admin/AdminUserManagementPage';
import AdminJobManagementPage from '../pages/Admin/AdminJobManagementPage';
import AdminJobDetailPage from '../pages/Admin/AdminJobDetailPage';
import AdminDashboardPage from '../pages/Admin/AdminDashboardPage';
import CompanyManagementPage  from '../pages/Admin/CompanyManagementPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/dang-nhap', element: <LoginPage /> },
      { path: '/dang-ky', element: <SignupPage /> },
      { path: '/quen-mat-khau', element: <ForgotPasswordPage /> },
      // Thêm các route khác ở đây
      // { path: '/dashboard', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> }
      { path: '/jobs', element: <JobSearchPage />},
      { path: '/jobs/:id', element: <JobDetailPage />},
      { path: '/profile/:id', element: <ProfilePage />},
      { path: '/applications', element: <ApplicationsPage />},
      { path: '/saved-jobs', element: <SavedJobsPage />},
      {path: '/company-profile', element: <CompanyProfilePage />},
      {
        path: '/jobs/post',
        element: (
            <PostJobPage />
        )
      },
      {
        path: '/jobs/edit/:id',
        element: (
            <PostJobPage />
        )
      },
      {
        path: '/manage-jobs',
        element: (
          
            <ManageJobsPage />
          
        )
      },
      {
        path: '/candidates',
        element: (
          
            <ManageCandidatesPage />
          
        )
      },
      {
        path: '/candidates/:id',
        element: (
          
            <CandidateDetailPage />
          
        )
      },
      {
        path: '/admin/users',
        element: (      
            <AdminUserManagementPage />
        )
      },

      {
        path: '/admin/jobs',
        element: (
            <AdminJobManagementPage />
        )
      },
      {
        path: '/admin/jobs/:id',
        element: (
            <AdminJobDetailPage />
        )
      },
      {
        path: '/admin',
        element: (
          
            <AdminDashboardPage />
          
        )
      },
      {
        path: '/admin/companies',
        element: (
            <CompanyManagementPage />
        )
      }    

    ]
  }
])

