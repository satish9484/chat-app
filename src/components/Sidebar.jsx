import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Chats from './Chats';
import Navbar from './Navbar';

const Sidebar = ({ isOpen, onToggleSidebar, onCloseSidebar }) => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    onCloseSidebar(); // Close sidebar after logout
  };

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <Navbar onToggleSidebar={onToggleSidebar} isSidebarOpen={isOpen} />
      <Chats />

      {/* Fixed logout button at bottom */}
      <div className="sidebar-logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
