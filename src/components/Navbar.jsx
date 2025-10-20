// import { signOut } from 'firebase/auth';
import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
// import { auth } from '../firebase';
import DarkModeToggle from './DarkModeToggle';

const NavigationBar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="navbar-left">
        {/* Mobile menu toggle button */}
        <button
          className="mobile-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className={`hamburger ${isSidebarOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <span className="logo">Chat Web</span>
      </div>
      <div className="user">
        <DarkModeToggle />
        <img src={currentUser.photoURL} alt="" />
        {/* <span>{currentUser.displayName}</span> */}
        {/* <Link to="/login">
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
        </Link> */}
      </div>
    </div>
  );
};

export default NavigationBar;
