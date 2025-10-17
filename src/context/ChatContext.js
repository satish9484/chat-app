import { createContext, useContext, useEffect, useReducer } from 'react';
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
        console.log('Changing user to:', action.payload);
        console.log('Current user uid:', currentUser?.uid);
        console.log('Selected user uid:', action.payload?.uid);

        // Validate the user object
        if (!action.payload || !action.payload.uid) {
          console.error('Invalid user object provided:', action.payload);
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
        console.log('New chat state:', newState);
        return newState;

      case 'RESET_CHAT':
        console.log('Resetting chat state');
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
    console.log('Current user changed, resetting chat state');
    dispatch({ type: 'RESET_CHAT' });
  }, [currentUser?.uid]);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
