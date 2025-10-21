import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import { AuthContext } from '../context/AuthContext';
import { isAdminUser } from '../utils/adminUtils';

const AdminPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Check if user is admin using utility function
      if (isAdminUser(currentUser.email)) {
        setIsAuthorized(true);
      } else {
        navigate('/');
        return;
      }

      setIsLoading(false);
    };

    checkAdminAccess();
  }, [currentUser, navigate]);

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Verifying admin access...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-content">
        <AdminSidebar />
        <main className="admin-main">
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
