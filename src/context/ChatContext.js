import { createContext, useContext, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: 'null',
    user: {},
    isUploading: false,
    uploadingImageName: '',
    uploadProgress: 0,
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE_USER':
        // Validate the user object
        if (!action.payload || !action.payload.uid) {
          console.error(
            'Invalid user selected. Please try again.',
            action.payload
          );
          toast.error('Invalid user selected. Please try again.');
          return state;
        }

        const newState = {
          user: action.payload,
          chatId:
            currentUser?.uid > action.payload?.uid
              ? currentUser?.uid + action.payload?.uid
              : action.payload?.uid + currentUser?.uid,
          // Reset upload states when changing users
          isUploading: false,
          uploadingImageName: '',
          uploadProgress: 0,
        };

        // Show user-friendly toast notification
        toast.success(
          `💬 Started chatting with ${action.payload.displayName}`,
          {
            autoClose: 2000,
            position: 'top-center',
          }
        );

        return newState;

      case 'RESET_CHAT':
        return INITIAL_STATE;

      case 'SET_UPLOADING':
        return {
          ...state,
          isUploading: action.payload.isUploading,
          uploadingImageName: action.payload.uploadingImageName || '',
          uploadProgress: action.payload.uploadProgress || 0,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  // Reset chat when current user changes
  useEffect(() => {
    dispatch({ type: 'RESET_CHAT' });
  }, [currentUser?.uid]);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
