import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';
import Message from './Message';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    // Clear messages immediately if no valid chatId
    if (!data?.chatId || data?.chatId === 'null') {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const unSub = onSnapshot(
      doc(db, 'chats', data.chatId),
      doc => {
        if (doc?.exists()) {
          const messagesData = doc?.data()?.messages || [];
          setMessages(messagesData);

          // Show success toast for new messages
          if (messagesData.length > 0) {
            toast.success(`📥 Loaded ${messagesData.length} messages`, {
              autoClose: 2000,
              position: 'top-right',
            });
          }
        } else {
          setMessages([]);
          toast.info('💬 No messages yet. Start the conversation!', {
            autoClose: 3000,
            position: 'top-center',
          });
        }
        setIsLoading(false);
      },
      error => {
        console.error('Firebase listener error:', error);
        toast.error('❌ Failed to load messages. Please try again.', {
          autoClose: 4000,
          position: 'top-right',
        });
        setMessages([]);
        setIsLoading(false);
      }
    );

    return () => {
      unSub();
    };
  }, [data?.chatId, data?.user?.uid, currentUser?.uid]);

  const setData = data => {
    setMessages(data);
  };

  return (
    <div className="messages">
      {/* Loading state */}
      {isLoading && (
        <div className="message loading-state">
          <div className="messageContent">
            <p>Loading messages...</p>
          </div>
        </div>
      )}

      {/* No messages state */}
      {!isLoading &&
        messages?.length === 0 &&
        data?.chatId &&
        data?.chatId !== 'null' && (
          <div className="message empty-state">
            <div className="messageContent">
              <p>No messages yet. Start the conversation!</p>
            </div>
          </div>
        )}

      {/* Messages */}
      {messages?.map((m, i) => (
        <Message
          message={m}
          messages={messages}
          setData={setData}
          key={m.id}
          id={i}
        />
      ))}

      {/* Skeleton loader for uploading image */}
      {data.isUploading && (
        <div className="message owner">
          <div className="messageInfo">
            <img src={currentUser?.photoURL} alt="" />
          </div>
          <div className="messageContent">
            <div className="image-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-text">
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
              <div className="upload-progress-indicator">
                <div className="progress-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="progress-text">
                  Uploading {data.uploadingImageName}... {data.uploadProgress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
