import React, { useContext, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';

import { db, storage } from '../firebase';

import { v4 as uuid } from 'uuid';

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {
  const formRef = useRef(null);
  const [chatData, setChatData] = useState({
    text: '',
    img: '',
    imgName: '',
  });
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);

  // Update uploading state in context
  const updateUploadingState = (
    isUploading,
    uploadingImageName = '',
    uploadProgress = 0
  ) => {
    dispatch({
      type: 'SET_UPLOADING',
      payload: {
        isUploading,
        uploadingImageName,
        uploadProgress,
      },
    });
  };

  // Professional arrow function to ensure chat document exists
  const ensureChatExists = async () => {
    const ensureChatPromise = async () => {
      const chatDoc = doc(db, 'chats', data.chatId);
      const chatSnapshot = await getDoc(chatDoc);

      if (!chatSnapshot.exists()) {
        await setDoc(chatDoc, { messages: [] });

        // Also create user chat references
        await setDoc(
          doc(db, 'userChats', currentUser.uid),
          {
            [data.chatId + '.userInfo']: {
              uid: data.user.uid,
              displayName: data.user.displayName,
              photoURL: data.user.photoURL,
            },
            [data.chatId + '.date']: serverTimestamp(),
          },
          { merge: true }
        );

        await setDoc(
          doc(db, 'userChats', data.user.uid),
          {
            [data.chatId + '.userInfo']: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            [data.chatId + '.date']: serverTimestamp(),
          },
          { merge: true }
        );

        return 'Chat initialized successfully';
      }
      return 'Chat already exists';
    };

    return toast.promise(ensureChatPromise, {
      pending: '💬 Initializing chat...',
      success: '✅ Chat ready!',
      error: '❌ Failed to initialize chat',
    });
  };

  // Professional arrow function to send text with image
  const sendTextWithImage = async (text, img, imgName) => {
    const sendMessagePromise = async () => {
      setIsUploading(true);
      setUploadProgress(0);
      updateUploadingState(true, imgName, 0);

      const storageImageName = `${imgName}${uuid()}`;
      const storageRef = ref(storage, `ChatImages/${storageImageName}`);
      const uploadTask = uploadBytesResumable(storageRef, img);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          snapshot => {
            const progressPercent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(progressPercent);
            updateUploadingState(true, imgName, progressPercent);
          },
          error => {
            console.error('Image upload error:', error);
            setIsUploading(false);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              await ensureChatExists();

              await updateDoc(doc(db, 'chats', data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text: text,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });

              // Update last message in userChats
              await updateDoc(doc(db, 'userChats', currentUser?.uid), {
                [data?.chatId + '.lastMessage']: {
                  text: text,
                  date: serverTimestamp(),
                },
                [data?.chatId + '.date']: serverTimestamp(),
              });

              await updateDoc(doc(db, 'userChats', data?.user?.uid), {
                [data?.chatId + '.lastMessage']: {
                  text: text,
                  date: serverTimestamp(),
                },
                [data?.chatId + '.date']: serverTimestamp(),
              });

              setIsUploading(false);
              updateUploadingState(false, '', 0);
              resolve('Message with image sent successfully');
            } catch (error) {
              console.error('Error saving message with image:', error);
              setIsUploading(false);
              reject(error);
            }
          }
        );
      });
    };

    return toast.promise(sendMessagePromise, {
      pending: '📤 Sending message with image...',
      success: '✅ Message with image sent!',
      error: '❌ Failed to send message with image',
    });
  };

  // Professional arrow function to send image only
  const sendImageOnly = async (img, imgName) => {
    const sendImagePromise = async () => {
      setIsUploading(true);
      setUploadProgress(0);
      updateUploadingState(true, imgName, 0);

      const storageImageName = `${imgName}${uuid()}`;
      const storageRef = ref(storage, `ChatImages/${storageImageName}`);
      const uploadTask = uploadBytesResumable(storageRef, img);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          snapshot => {
            const progressPercent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(progressPercent);
            updateUploadingState(true, imgName, progressPercent);
          },
          error => {
            console.error('Image upload error:', error);
            setIsUploading(false);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              await ensureChatExists();

              await updateDoc(doc(db, 'chats', data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text: imgName,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });

              // Update last message in userChats
              await updateDoc(doc(db, 'userChats', currentUser?.uid), {
                [data?.chatId + '.lastMessage']: {
                  text: imgName,
                  date: serverTimestamp(),
                },
                [data?.chatId + '.date']: serverTimestamp(),
              });

              await updateDoc(doc(db, 'userChats', data?.user?.uid), {
                [data?.chatId + '.lastMessage']: {
                  text: imgName,
                  date: serverTimestamp(),
                },
                [data?.chatId + '.date']: serverTimestamp(),
              });

              setIsUploading(false);
              updateUploadingState(false, '', 0);
              resolve('Image sent successfully');
            } catch (error) {
              console.error('Error saving image message:', error);
              setIsUploading(false);
              reject(error);
            }
          }
        );
      });
    };

    return toast.promise(sendImagePromise, {
      pending: '🖼️ Sending image...',
      success: '✅ Image sent!',
      error: '❌ Failed to send image',
    });
  };

  // Professional arrow function to send text only
  const sendTextOnly = async text => {
    const sendTextPromise = async () => {
      await ensureChatExists();

      // Add message to chat
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });

      // Update last message in userChats
      await updateDoc(doc(db, 'userChats', currentUser?.uid), {
        [data?.chatId + '.lastMessage']: {
          text: text,
          date: serverTimestamp(),
        },
        [data?.chatId + '.date']: serverTimestamp(),
      });

      await updateDoc(doc(db, 'userChats', data?.user?.uid), {
        [data?.chatId + '.lastMessage']: {
          text: text,
          date: serverTimestamp(),
        },
        [data?.chatId + '.date']: serverTimestamp(),
      });

      return 'Text message sent successfully';
    };

    return toast.promise(sendTextPromise, {
      pending: '📝 Sending message...',
      success: '✅ Message sent!',
      error: '❌ Failed to send message',
    });
  };

  const updateChatData = async e => {
    if (chatData.imgName === '' && chatData.text === '') {
      toast.warning('Please enter a message or select an image');
      return;
    }

    // Check if user is selected
    if (data.chatId === 'null' || !data.chatId) {
      toast.warning('Please select a user to send a message');
      return;
    }

    try {
      // Send text with image
      if (chatData.text !== '' && chatData.imgName !== '') {
        const text = e.target[0].value;
        const img = e.target[1].files[0];
        const imgName = e.target[1].files[0].name;
        await sendTextWithImage(text, img, imgName);
      }
      // Send image only
      else if (chatData.text === '' && chatData.imgName !== '') {
        const img = e.target[1].files[0];
        const imgName = e.target[1].files[0].name;
        await sendImageOnly(img, imgName);
      }
      // Send text only
      else if (chatData.imgName === '' && chatData.text !== '') {
        const text = e.target[0].value;
        await sendTextOnly(text);
      }
    } catch (error) {
      console.error('Error in updateChatData:', error);
      throw error;
    }
  };

  const handleSubmit = async e => {
    // Prevent multiple simultaneous uploads
    if (isUploading) {
      toast.warning('Please wait for current upload to complete');
      return;
    }

    setLoading(true);
    e.preventDefault();

    try {
      await updateChatData(e);

      // Clear form after successful send
      setChatData({
        text: '',
        img: '',
        imgName: '',
      });

      // Clear file input
      document.getElementById('file').value = '';

      // Reset progress
      setUploadProgress(0);
      updateUploadingState(false, '', 0);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };

  const handleChange = e => {
    setChatData({
      ...chatData,
      [e.target.name]: e.target.value,
    });
  };

  const hadnleImage = event => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (PNG, JPEG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error(
        'File size too large. Please select an image smaller than 10MB'
      );
      return;
    }

    // Clean filename and get extension
    const fileName = file.name;
    const cleanFileName = fileName.replace(/\.[^/.]+$/, ''); // Remove extension

    setChatData({
      ...chatData,
      img: file,
      imgName: cleanFileName,
      text: chatData.text || '', // Don't auto-fill text with filename
    });

    // Show success toast
    toast.success(`📎 Image "${cleanFileName}" selected successfully!`, {
      autoClose: 2000,
      position: 'top-right',
    });
  };

  return (
    <div className="input">
      {/* WhatsApp-style Upload Progress */}
      {/* {isUploading && (
        <div className="whatsapp-upload-overlay">
          <div className="upload-status">
            <div className="upload-spinner">
              <div className="spinner-dot"></div>
              <div className="spinner-dot"></div>
              <div className="spinner-dot"></div>
            </div>
            <div className="upload-text">
              <span className="upload-status-text">Sending image...</span>
              <div className="upload-progress-bar">
                <div
                  className="upload-progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="upload-percentage">{uploadProgress}%</span>
            </div>
          </div>
        </div>
      )} */}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`flex w-full ${isUploading ? 'uploading' : ''}`}
      >
        <input
          type="text"
          name="text"
          placeholder={
            isUploading
              ? 'Sending...'
              : chatData.imgName
                ? `Image selected: ${chatData.imgName} - Add a message (optional)`
                : 'Type a message or select an image...'
          }
          onChange={handleChange}
          value={chatData.text}
          className="flex-1"
          disabled={isUploading}
        />
        <div className="send">
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif, image/webp"
            className="file-input"
            id="file"
            onChange={hadnleImage}
            disabled={isUploading}
            title="Select an image to share"
          />
          <label
            htmlFor="file"
            className={`file-label ${isUploading ? 'disabled' : ''} ${
              chatData.imgName ? 'has-image' : ''
            }`}
            title={
              isUploading
                ? 'Uploading...'
                : chatData.imgName
                  ? `Selected: ${chatData.imgName}`
                  : 'Click to select an image'
            }
          >
            <div className="file-icon">
              {chatData.imgName ? (
                <svg
                  className="image-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              ) : (
                <svg
                  className="attach-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                </svg>
              )}
            </div>

            {chatData.imgName && !isUploading && (
              <div className="file-info">
                <span className="file-name">{chatData.imgName}</span>
                <span className="file-status">✓ Selected</span>
              </div>
            )}

            {!chatData.imgName && !isUploading && (
              <div className="file-hint">
                <span className="hint-text">Attach</span>
              </div>
            )}
          </label>
          <button type="submit" disabled={loading || isUploading}>
            {isUploading ? (
              <div className="button-loading">
                <div className="button-spinner"></div>
                <span>Sending...</span>
              </div>
            ) : loading ? (
              'Sending...'
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Input;
