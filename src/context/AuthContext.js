import { onAuthStateChanged, signOut } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../firebase';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user);

      if (user) {
        toast.success('User is already logged in', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    });

    return () => {
      unsub();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully', {
        position: 'top-center',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Failed to logout', {
        position: 'top-center',
        autoClose: 3000,
      });
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
