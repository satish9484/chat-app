import React, { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

const ChatHeader = ({ onToggleSidebar, isSidebarOpen }) => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat-header">
      <div className="chat-header-left">
        {/* Mobile menu toggle button for chat header */}
        <button
          className="mobile-menu-toggle chat-header-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className={`hamburger ${isSidebarOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Chat user info */}
        <div className="chat-user-info">
          {data.user?.photoURL && (
            <img
              src={data.user.photoURL}
              alt={data.user.displayName || 'User'}
              className="chat-user-avatar"
            />
          )}
          <div className="chat-user-details">
            <h3 className="chat-user-name">
              {data.user?.displayName || 'Select a user to start chatting'}
            </h3>
            <p className="chat-user-status">
              {data.user?.uid ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      <div className="chat-header-right">
        {/* Chat actions */}
        <div className="chat-actions">
          <button className="chat-action-btn" aria-label="Video call">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </button>
          <button className="chat-action-btn" aria-label="Voice call">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>
          <button className="chat-action-btn" aria-label="More options">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
