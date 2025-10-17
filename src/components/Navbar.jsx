import { signOut } from 'firebase/auth';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../firebase';
import DarkModeToggle from './DarkModeToggle';

const NavigationBar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="logo">Chat Web</span>
      <div className="user">
        <DarkModeToggle />
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <Link to="/login">
          <button
            onClick={() => {
              signOut(auth)
                .then(() => {
                  toast.success('Successfully Signout');
                })
                .catch(error => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  toast.error('User SignOut ErrorCode ' + errorCode);
                  toast.error('User SignOut  Error Message ' + errorMessage);
                });
            }}
          >
            logout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
