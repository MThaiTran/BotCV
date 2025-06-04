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
import CompanyProfilePage from '../pages/Employer/CompanyProfilePage';
import PostJobPage from '../pages/Employer/PostJobPage';
import ManageJobsPage from '../pages/Employer/ManageJobsPage';
import ManageCandidatesPage from '../pages/Employer/ManageCandidatesPage';
import CandidateDetailPage from '../pages/Candidate/CandidateDetailPage';
import AdminUserManagementPage from '../pages/Admin/AdminUserManagementPage';
import AdminJobManagementPage from '../pages/Admin/AdminJobManagementPage';
import AdminJobDetailPage from '../pages/Admin/AdminJobDetailPage';
import AdminDashboardPage from '../pages/Admin/AdminDashboardPage';
import CompanyManagementPage  from '../pages/Admin/CompanyManagementPage';
import EditJobPage from '../pages/Employer/EditJobPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/sign-up', element: <SignupPage /> },
      { path: '/forgot', element: <ForgotPasswordPage /> },
      // Thêm các route khác ở đây
      // { path: '/dashboard', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> }
      { path: '/jobs', element: <JobSearchPage />},
      { path: '/jobs/:id', element: <JobDetailPage />},
      { path: '/profile/:id', element: <ProfilePage />},
      { path: '/applications', element: <ApplicationsPage />},
      { path: '/saved-jobs', element: <SavedJobsPage />},
      {path: '/company-profile', element: <CompanyProfilePage />},
      {
        path: '/post-job',
        element: (
            <PostJobPage />
        )
      },
      {
        path: '/jobs/edit/:id',
        element: (
            <EditJobPage />
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
        path: '/admin',
        element: (
          
            <AdminDashboardPage />
          
        )
      },
      {
        path: '/admin/dashboard',
        element: (
          
            <AdminDashboardPage />
          
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
        path: '/admin/companies',
        element: (
            <CompanyManagementPage />
        )
      }    

    ]
  }
])

