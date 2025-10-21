import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminHeader = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBackToApp = () => {
    navigate('/');
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button onClick={handleBackToApp} className="back-to-app-btn">
          ← Back to App
        </button>
        <div className="header-title">
          <h1>Admin Panel</h1>
          <span className="header-subtitle">Chat Application Management</span>
        </div>
      </div>

      <div className="header-right">
        <div className="admin-info">
          <div className="admin-avatar">
            <img
              src={currentUser?.photoURL || '/default-avatar.png'}
              alt={currentUser?.displayName}
            />
          </div>
          <div className="admin-details">
            <span className="admin-name">{currentUser?.displayName}</span>
            <span className="admin-role">Administrator</span>
          </div>
        </div>

        <div className="header-actions">
          <button className="notification-btn" title="Notifications">
            🔔
            <span className="notification-badge">3</span>
          </button>

          <div className="dropdown">
            <button className="dropdown-toggle">⚙️</button>
            <div className="dropdown-menu">
              <a href="#profile" className="dropdown-item">
                Profile Settings
              </a>
              <a href="#preferences" className="dropdown-item">
                Preferences
              </a>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-item logout">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
