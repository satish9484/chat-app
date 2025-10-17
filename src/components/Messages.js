import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
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
    console.log('Messages useEffect triggered with chatId:', data?.chatId);
    console.log('Current user:', currentUser?.uid);
    console.log('Selected user:', data?.user?.uid);
    console.log('Chat context data:', data);

    // Clear messages immediately if no valid chatId
    if (!data?.chatId || data?.chatId === 'null') {
      console.log('No valid chatId, clearing messages');
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    console.log('Setting up Firebase listener for chatId:', data.chatId);

    const unSub = onSnapshot(
      doc(db, 'chats', data.chatId),
      doc => {
        console.log('Firebase snapshot received for chatId:', data.chatId);
        console.log('Document exists:', doc.exists());
        console.log('Document data:', doc.data());
        if (doc?.exists()) {
          const messagesData = doc?.data()?.messages || [];
          console.log('Messages received:', messagesData.length, 'messages');
          console.log('Messages data:', messagesData);
          setMessages(messagesData);
        } else {
          console.log('No chat document exists for chatId:', data.chatId);
          setMessages([]);
        }
        setIsLoading(false);
      },
      error => {
        console.error('Firebase listener error:', error);
        setMessages([]);
        setIsLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up Firebase listener for chatId:', data.chatId);
      unSub();
    };
  }, [data?.chatId, data?.user?.uid, currentUser?.uid]);

  const setData = data => {
    setMessages(data);
  };

  console.log('Messages component render - messages count:', messages?.length);
  console.log('Current chatId:', data?.chatId);
  console.log('Current user:', data?.user?.displayName);

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
