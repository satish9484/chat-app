import React from 'react';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-content">
        <div className="sidebar-section">
          <h3>Dashboard</h3>
          <ul className="sidebar-menu">
            <li>
              <a href="#overview" className="sidebar-link active">
                <span className="icon">📊</span>
                Overview
              </a>
            </li>
            <li>
              <a href="#analytics" className="sidebar-link">
                <span className="icon">📈</span>
                Analytics
              </a>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>Management</h3>
          <ul className="sidebar-menu">
            <li>
              <a href="#users" className="sidebar-link">
                <span className="icon">👥</span>
                Users
              </a>
            </li>
            <li>
              <a href="#chats" className="sidebar-link">
                <span className="icon">💬</span>
                Chats
              </a>
            </li>
            <li>
              <a href="#messages" className="sidebar-link">
                <span className="icon">📨</span>
                Messages
              </a>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>System</h3>
          <ul className="sidebar-menu">
            <li>
              <a href="#settings" className="sidebar-link">
                <span className="icon">⚙️</span>
                Settings
              </a>
            </li>
            <li>
              <a href="#logs" className="sidebar-link">
                <span className="icon">📋</span>
                Logs
              </a>
            </li>
            <li>
              <a href="#backup" className="sidebar-link">
                <span className="icon">💾</span>
                Backup
              </a>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>Security</h3>
          <ul className="sidebar-menu">
            <li>
              <a href="#permissions" className="sidebar-link">
                <span className="icon">🔐</span>
                Permissions
              </a>
            </li>
            <li>
              <a href="#audit" className="sidebar-link">
                <span className="icon">🔍</span>
                Audit Trail
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
