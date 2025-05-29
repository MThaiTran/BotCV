// src/App.jsx
import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header/Header';
import Footer from './components/Footer';
import AdminHeader from './components/Header/AdminHeader';
// import './App.css'

function App() {
  const location = useLocation();
  
  // Kiểm tra nếu đường dẫn bắt đầu bằng /admin
  const isAdminRoute = /^\/admin\b/.test(location.pathname);

  return (
    <div className="app-container">
      {isAdminRoute ? <AdminHeader /> : <Header />}
      <main className="main-content">
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default App
