import { deleteField, doc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';

const Message = ({ messages, message, id, setData }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const docRef = doc(db, 'chats', data.chatId);

  const divRef = useRef();

  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  const handleClick = () => {
    setShowDeleteModal(true);
  };

  // Professional arrow function to delete message with toast feedback
  const deleteMessage = async () => {
    const deleteMessagePromise = async () => {
      await updateDoc(docRef, {
        messages: deleteField(),
      });

      const remainMessage = messages.filter(item => item.id !== message.id);

      setData(remainMessage);
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: remainMessage,
      });

      return 'Message deleted successfully';
    };

    return toast.promise(deleteMessagePromise, {
      pending: '🗑️ Deleting message...',
      success: '✅ Message deleted!',
      error: '❌ Failed to delete message',
    });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteMessage();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      handleDeleteCancel();
    }
  };

  return (
    <>
      <div
        ref={divRef}
        className={`message ${message.senderId === currentUser.uid && 'owner'}`}
      >
        <div className="messageInfo">
          <img
            src={
              message.senderId === currentUser.uid
                ? currentUser.photoURL
                : data.user.photoURL
            }
            alt=""
          />
        </div>
        <div className="messageContent" onClick={handleClick}>
          <p>
            {message.text}
            {message.img && <img src={message.img} alt="" />}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={handleOverlayClick}>
          <div className="delete-modal">
            <div className="modal-header">
              <h3>Delete Message</h3>
              <button
                className="close-btn"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="warning-icon">⚠️</div>
              <p>Are you sure you want to delete this message?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="delete-btn"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="loading-content">
                    <div className="spinner"></div>
                    <span>Deleting...</span>
                  </div>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
