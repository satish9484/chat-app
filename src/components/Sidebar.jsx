import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { isAdminUser } from '../utils/adminUtils';
import Chats from './Chats';
import Navbar from './Navbar';

const Sidebar = ({ isOpen, onToggleSidebar, onCloseSidebar }) => {
  const { logout, currentUser } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    onCloseSidebar(); // Close sidebar after logout
  };

  // Check if user is admin using utility function
  const isAdmin = isAdminUser(currentUser?.email);

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <Navbar onToggleSidebar={onToggleSidebar} isSidebarOpen={isOpen} />
      <Chats onCloseSidebar={onCloseSidebar} />

      {/* Admin Panel Link */}
      {isAdmin && (
        <div className="sidebar-admin">
          <Link to="/admin" className="admin-link">
            <span className="admin-icon">⚙️</span>
            Admin Panel
          </Link>
        </div>
      )}

      {/* Fixed logout button at bottom */}
      <div className="sidebar-logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
