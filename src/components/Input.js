import React, { useContext, useRef, useState } from 'react';
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
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
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

  // Ensure chat document exists before sending messages
  const ensureChatExists = async () => {
    try {
      const chatDoc = doc(db, 'chats', data.chatId);
      const chatSnapshot = await getDoc(chatDoc);

      if (!chatSnapshot.exists()) {
        console.log('Creating chat document:', data.chatId);
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

        console.log('Chat document created successfully');
      }
    } catch (error) {
      console.error('Error ensuring chat exists:', error);
      throw error;
    }
  };

  const updateChatData = async e => {
    if (chatData.imgName === '' && chatData.text === '') {
      alert('Enter a message');
      return;
    }

    // Check if user is selected
    if (data.chatId === 'null' || !data.chatId) {
      alert('Select a User to Send a Message');
      return;
    }

    //NOTE:  1 - Send text with image
    if (chatData.text !== '' && chatData.imgName !== '') {
      // Send Messages with User text and photo
      console.log('1 - Sending text with image');
      setIsUploading(true);
      setUploadProgress(0);

      const text = e.target[0].value;
      const img = e.target[1].files[0];
      const imgName = e.target[1].files[0].name;
      updateUploadingState(true, imgName, 0);

      const storageImageName = `${imgName}${uuid()}`;
      const storageRef = ref(storage, `ChatImages/${storageImageName}`);
      const uploadTask = uploadBytesResumable(storageRef, img);

      try {
        uploadTask.on(
          'state_changed',
          snapshot => {
            const progressPercent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(progressPercent);
            updateUploadingState(true, imgName, progressPercent);

            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log(`Upload progress: ${progressPercent}%`);
                break;
              default:
                console.log('Unexpected error while uploading the image');
            }
          },
          error => {
            console.error('Upload error:', error);
            setIsUploading(false);
            throw error;
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('File available at', downloadURL);

              // Ensure chat document exists first
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

              console.log('Image with text message sent successfully');
              setIsUploading(false);
              updateUploadingState(false, '', 0);
            } catch (error) {
              console.error('Error saving message:', error);
              setIsUploading(false);
              throw error;
            }
          }
        );
      } catch (err) {
        console.error('Upload failed:', err);
        setErr(true);
        setIsUploading(false);
        throw err;
      }
    }

    //NOTE:  2 - Send image only
    else if (chatData.text === '' && chatData.imgName !== '') {
      //Send Messages with ImageName and Photo
      console.log('2 - Sending image only');
      setIsUploading(true);
      setUploadProgress(0);

      const img = e.target[1].files[0];
      const imgName = e.target[1].files[0].name;
      updateUploadingState(true, imgName, 0);

      const storageImageName = `${imgName}${uuid()}`;
      const storageRef = ref(storage, `ChatImages/${storageImageName}`);
      const uploadTask = uploadBytesResumable(storageRef, img);

      console.log(img, imgName);
      try {
        uploadTask.on(
          'state_changed',
          snapshot => {
            const progressPercent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(progressPercent);
            updateUploadingState(true, imgName, progressPercent);

            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log(`Upload progress: ${progressPercent}%`);
                break;
              default:
                console.log('Unexpected error while uploading the image');
            }
          },
          error => {
            console.error('Upload error:', error);
            setIsUploading(false);
            throw error;
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('File available at', downloadURL);

              // Ensure chat document exists first
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

              console.log('Image message sent successfully');
              setIsUploading(false);
              updateUploadingState(false, '', 0);
            } catch (error) {
              console.error('Error saving message:', error);
              setIsUploading(false);
              throw error;
            }
          }
        );
      } catch (err) {
        console.error('Upload failed:', err);
        setErr(true);
        setIsUploading(false);
        throw err;
      }
    }
    //NOTE:  3 - Send text only
    else if (chatData.imgName === '' && chatData.text !== '') {
      console.log('3 - Sending text only');
      const text = e.target[0].value;

      try {
        // Ensure chat document exists first
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
        console.log('Updating lastMessage for chatId:', data?.chatId);
        console.log('Message text:', text);

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

        console.log('LastMessage updated successfully');

        console.log('Text message sent successfully');
      } catch (error) {
        console.error('Error sending text message:', error);
        setErr(true);
      }
    }
  };

  const handleSubmit = async e => {
    console.log('We are in');

    // Prevent multiple simultaneous uploads
    if (isUploading) {
      console.log('Upload already in progress, ignoring request');
      return;
    }

    setLoading(true);
    setErr(false);
    setSuccessMessage('');
    e.preventDefault();

    try {
      await updateChatData(e);

      // Show success message
      setSuccessMessage('Message sent successfully!');

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

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setErr(true);

      // Clear error message after 5 seconds
      setTimeout(() => {
        setErr(false);
      }, 5000);
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

    const newImage = file.name.split(' ');
    const newImageWithoutSpace = newImage.join('');
    const onlyImageName = newImageWithoutSpace.split('.');

    setChatData({
      ...chatData,
      img: file,
      imgName: onlyImageName[0],
      text: onlyImageName[0], // Display image name in input field
    });
  };

  return (
    <div className="input">
      {/* Notification Messages */}
      {err && (
        <div className="notification error-notification">
          <span className="notification-icon">⚠️</span>
          <span className="notification-text">
            Failed to send message. Please try again.
          </span>
        </div>
      )}

      {successMessage && (
        <div className="notification success-notification">
          <span className="notification-icon">✓</span>
          <span className="notification-text">{successMessage}</span>
        </div>
      )}

      {/* WhatsApp-style Upload Progress */}
      {isUploading && (
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
      )}

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
              ? 'Uploading...'
              : chatData.imgName
                ? `Image: ${chatData.imgName} - Add message (optional)`
                : 'Type a message...'
          }
          onChange={handleChange}
          value={chatData.text}
          className="flex-1"
          disabled={isUploading}
        />
        <div className="send">
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="file-input"
            id="file"
            onChange={hadnleImage}
            disabled={isUploading}
          />
          <label
            htmlFor="file"
            className={`file-label ${isUploading ? 'disabled' : ''} ${
              chatData.imgName ? 'has-image' : ''
            }`}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCwLypGHmZkQWYbK__Qi19Pc_A5aqyA7Hf_A&usqp=CAU"
              alt=""
            />
            {chatData.imgName && !isUploading && (
              <span className="image-selected-indicator">✓</span>
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
