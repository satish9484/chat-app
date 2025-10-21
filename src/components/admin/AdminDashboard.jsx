import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../../firebase';
import AdminSettings from './AdminSettings';
import ChatMonitoring from './ChatMonitoring';
import SystemAnalytics from './SystemAnalytics';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChats: 0,
    totalMessages: 0,
    activeUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);

      // Get total users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;

      // Get total chats
      const chatsSnapshot = await getDocs(collection(db, 'chats'));
      const totalChats = chatsSnapshot.size;

      // Calculate total messages
      let totalMessages = 0;
      chatsSnapshot.forEach(doc => {
        const messages = doc.data().messages || [];
        totalMessages += messages.length;
      });

      // Get active users (users with recent activity)
      const userChatsSnapshot = await getDocs(collection(db, 'userChats'));
      const activeUsers = userChatsSnapshot.size;

      setStats({
        totalUsers,
        totalChats,
        totalMessages,
        activeUsers,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview stats={stats} isLoading={isLoading} />;
      case 'users':
        return <UserManagement />;
      case 'chats':
        return <ChatMonitoring />;
      case 'analytics':
        return <SystemAnalytics />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <DashboardOverview stats={stats} isLoading={isLoading} />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-tabs">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={activeTab === 'chats' ? 'active' : ''}
            onClick={() => setActiveTab('chats')}
          >
            Chats
          </button>
          <button
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
      </div>

      <div className="dashboard-content">{renderContent()}</div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>{stats.totalChats}</h3>
            <p>Total Chats</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📨</div>
          <div className="stat-content">
            <h3>{stats.totalMessages}</h3>
            <p>Total Messages</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <h3>{stats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-time">2 minutes ago</span>
            <span className="activity-text">
              New user registered: john@example.com
            </span>
          </div>
          <div className="activity-item">
            <span className="activity-time">5 minutes ago</span>
            <span className="activity-text">
              Chat created between user1 and user2
            </span>
          </div>
          <div className="activity-item">
            <span className="activity-time">10 minutes ago</span>
            <span className="activity-text">
              User admin@chatapp.com logged in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
