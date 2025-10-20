import React, { useState } from 'react';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';
import '../style.scss';

const Home_Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="home">
      <div className="container">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          onCloseSidebar={handleCloseSidebar}
        />
        <Chat
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div className="mobile-overlay" onClick={handleCloseSidebar} />
        )}
      </div>
    </div>
  );
};

export default Home_Page;
