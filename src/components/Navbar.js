import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

import { Link } from "react-router-dom";

const NavigationBar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="logo">Chat</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <Link to="/login">
          <button
            onClick={() => {
              signOut(auth)
                .then(() => {
                  console.log("Successfully Signout");
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  console.log("User SignOut ErrorCode " + errorCode);
                  console.log("User SignOut  Error Message " + errorMessage);
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
