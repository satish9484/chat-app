import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../../firebase';

const ChatMonitoring = () => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const chatsSnapshot = await getDocs(collection(db, 'chats'));
      const chatsList = [];

      chatsSnapshot.forEach(doc => {
        const chatData = doc.data();
        chatsList.push({
          id: doc.id,
          ...chatData,
          messageCount: chatData.messages?.length || 0,
          lastMessage:
            chatData.messages?.[chatData.messages.length - 1] || null,
        });
      });

      // Sort by last message date
      chatsList.sort((a, b) => {
        const aDate = a.lastMessage?.date?.toDate() || new Date(0);
        const bDate = b.lastMessage?.date?.toDate() || new Date(0);
        return bDate - aDate;
      });

      setChats(chatsList);
    } catch (error) {
      console.error('Error loading chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewChat = chat => {
    setSelectedChat(chat);
    setShowChatModal(true);
  };

  const handleDeleteChat = chat => {
    setChatToDelete(chat);
    setShowDeleteModal(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;

    try {
      await deleteDoc(doc(db, 'chats', chatToDelete.id));
      toast.success('Chat deleted successfully');
      setShowDeleteModal(false);
      setChatToDelete(null);
      loadChats();
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    }
  };

  const filteredChats = chats.filter(chat => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      chat.id.toLowerCase().includes(searchLower) ||
      chat.lastMessage?.text?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = timestamp => {
    if (!timestamp) return 'No messages';
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="chat-monitoring-loading">
        <div className="loading-spinner"></div>
        <p>Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="chat-monitoring">
      <div className="chat-monitoring-header">
        <h2>Chat Monitoring</h2>
        <div className="chat-actions">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={loadChats} className="refresh-btn">
            Refresh
          </button>
        </div>
      </div>

      <div className="chats-table-container">
        <table className="chats-table">
          <thead>
            <tr>
              <th>Chat ID</th>
              <th>Messages</th>
              <th>Last Message</th>
              <th>Last Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredChats.map(chat => (
              <tr key={chat.id}>
                <td className="chat-id-cell">{chat.id}</td>
                <td>
                  <span className="message-count">{chat.messageCount}</span>
                </td>
                <td className="last-message-cell">
                  {chat.lastMessage ? (
                    <div className="last-message">
                      <span className="message-text">
                        {chat.lastMessage.text?.substring(0, 50)}
                        {chat.lastMessage.text?.length > 50 ? '...' : ''}
                      </span>
                      {chat.lastMessage.img && (
                        <span className="has-image">📷</span>
                      )}
                    </div>
                  ) : (
                    <span className="no-messages">No messages</span>
                  )}
                </td>
                <td>{formatDate(chat.lastMessage?.date)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleViewChat(chat)}
                      className="view-btn"
                      title="View Chat"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleDeleteChat(chat)}
                      className="delete-btn"
                      title="Delete Chat"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chat Details Modal */}
      {showChatModal && selectedChat && (
        <div className="modal-overlay" onClick={() => setShowChatModal(false)}>
          <div
            className="modal-content large-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Chat Details</h3>
              <button
                onClick={() => setShowChatModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="chat-details">
                <div className="detail-row">
                  <strong>Chat ID:</strong> {selectedChat.id}
                </div>
                <div className="detail-row">
                  <strong>Total Messages:</strong> {selectedChat.messageCount}
                </div>
                <div className="detail-row">
                  <strong>Created:</strong>{' '}
                  {formatDate(selectedChat.lastMessage?.date)}
                </div>
              </div>

              <div className="messages-preview">
                <h4>Recent Messages</h4>
                <div className="messages-list">
                  {selectedChat.messages?.slice(-10).map((message, index) => (
                    <div key={index} className="message-preview">
                      <div className="message-header">
                        <span className="sender-id">{message.senderId}</span>
                        <span className="message-date">
                          {message.date?.toDate().toLocaleString()}
                        </span>
                      </div>
                      <div className="message-content">
                        {message.text && <p>{message.text}</p>}
                        {message.img && (
                          <div className="message-image">
                            <img src={message.img} alt="Message attachment" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowChatModal(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && chatToDelete && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Chat</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this chat?</p>
              <p className="warning-text">
                This action cannot be undone and will delete all messages in
                this chat.
              </p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={confirmDeleteChat} className="btn-danger">
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMonitoring;
