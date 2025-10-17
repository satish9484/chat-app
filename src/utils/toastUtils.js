import { toast } from 'react-toastify';

/**
 * Professional Toast Utility Functions
 * Provides consistent toast notifications throughout the application
 */

// Generic promise-based toast function
export const toastPromise = (promise, messages) => {
  return toast.promise(promise, {
    pending: messages.pending || '⏳ Processing...',
    success: messages.success || '✅ Operation completed successfully!',
    error: messages.error || '❌ Operation failed',
  });
};

// Authentication related toasts
export const authToasts = {
  login: promise =>
    toastPromise(promise, {
      pending: '🔐 Signing you in...',
      success: '✅ Welcome back!',
      error: '❌ Login failed. Please check your credentials.',
    }),

  logout: promise =>
    toastPromise(promise, {
      pending: '👋 Signing you out...',
      success: '✅ Successfully signed out!',
      error: '❌ Failed to sign out',
    }),

  passwordReset: promise =>
    toastPromise(promise, {
      pending: '📧 Sending password reset email...',
      success: '✅ Password reset email sent! Check your inbox.',
      error: '❌ Failed to send password reset email',
    }),
};

// Chat related toasts
export const chatToasts = {
  sendMessage: promise =>
    toastPromise(promise, {
      pending: '📤 Sending message...',
      success: '✅ Message sent!',
      error: '❌ Failed to send message',
    }),

  loadMessages: promise =>
    toastPromise(promise, {
      pending: '📥 Loading messages...',
      success: '✅ Messages loaded!',
      error: '❌ Failed to load messages',
    }),

  deleteMessage: promise =>
    toastPromise(promise, {
      pending: '🗑️ Deleting message...',
      success: '✅ Message deleted!',
      error: '❌ Failed to delete message',
    }),
};

// Friend management toasts
export const friendToasts = {
  addFriend: promise =>
    toastPromise(promise, {
      pending: '👥 Adding friend...',
      success: '✅ Friend added successfully!',
      error: '❌ Failed to add friend',
    }),

  removeFriend: promise =>
    toastPromise(promise, {
      pending: '👥 Removing friend...',
      success: '✅ Friend removed successfully!',
      error: '❌ Failed to remove friend',
    }),

  blockUser: promise =>
    toastPromise(promise, {
      pending: '🚫 Blocking user...',
      success: '✅ User blocked successfully!',
      error: '❌ Failed to block user',
    }),
};

// File upload toasts
export const fileToasts = {
  uploadImage: promise =>
    toastPromise(promise, {
      pending: '📤 Uploading image...',
      success: '✅ Image uploaded successfully!',
      error: '❌ Failed to upload image',
    }),

  uploadAvatar: promise =>
    toastPromise(promise, {
      pending: '🖼️ Uploading avatar...',
      success: '✅ Avatar updated successfully!',
      error: '❌ Failed to upload avatar',
    }),

  uploadFile: promise =>
    toastPromise(promise, {
      pending: '📁 Uploading file...',
      success: '✅ File uploaded successfully!',
      error: '❌ Failed to upload file',
    }),
};

// Database operation toasts
export const dbToasts = {
  saveData: promise =>
    toastPromise(promise, {
      pending: '💾 Saving data...',
      success: '✅ Data saved successfully!',
      error: '❌ Failed to save data',
    }),

  loadData: promise =>
    toastPromise(promise, {
      pending: '📥 Loading data...',
      success: '✅ Data loaded successfully!',
      error: '❌ Failed to load data',
    }),

  deleteData: promise =>
    toastPromise(promise, {
      pending: '🗑️ Deleting data...',
      success: '✅ Data deleted successfully!',
      error: '❌ Failed to delete data',
    }),

  updateData: promise =>
    toastPromise(promise, {
      pending: '🔄 Updating data...',
      success: '✅ Data updated successfully!',
      error: '❌ Failed to update data',
    }),
};

// Custom toast functions with specific styling
export const customToasts = {
  success: (message, options = {}) => {
    return toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  info: (message, options = {}) => {
    return toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  warning: (message, options = {}) => {
    return toast.warning(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },
};

// Example usage functions
export const exampleUsage = {
  // Example: Login with toast
  loginWithToast: async (email, password, loginFunction) => {
    const loginPromise = () => loginFunction(email, password);
    return authToasts.login(loginPromise);
  },

  // Example: Send message with toast
  sendMessageWithToast: async (messageData, sendFunction) => {
    const sendPromise = () => sendFunction(messageData);
    return chatToasts.sendMessage(sendPromise);
  },

  // Example: Upload file with toast
  uploadFileWithToast: async (file, uploadFunction) => {
    const uploadPromise = () => uploadFunction(file);
    return fileToasts.uploadFile(uploadPromise);
  },
};

const toastUtils = {
  toastPromise,
  authToasts,
  chatToasts,
  friendToasts,
  fileToasts,
  dbToasts,
  customToasts,
  exampleUsage,
};

export default toastUtils;
