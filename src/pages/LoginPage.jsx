import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PasswordReset from '../components/PasswordReset';
import { auth } from '../firebase';
import {
  getAdminWelcomeMessage,
  getRedirectPath,
  getRegularWelcomeMessage,
  isAdminUser,
} from '../utils/adminUtils';

const LoginPage = () => {
  const formRef = useRef(null);
  const [err, setErr] = useState(false);
  const [errorInfo, setErrorInfo] = useState('');
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);

  const [user, setUser] = useState({
    email: 'naruto@gmail.com',
    password: 'TestPasss123',
  });
  const navigate = useNavigate();

  useEffect(() => {
    formRef?.current[0].focus();
    return () => {};
  }, []);

  // Professional arrow function for user login with toast promises
  const loginUser = async (email, password) => {
    const loginPromise = async () => {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    };

    return toast.promise(loginPromise, {
      pending: '🔐 Signing you in...',
      success: '✅ Welcome back! Login successful.',
      error: '❌ Login failed. Please check your credentials.',
    });
  };

  // Firebase error handler for login
  const getLoginErrorMessage = errorCode => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'Login failed. Please try again.';
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Clear previous errors
    setErr(false);
    setErrorInfo('');

    const email = e.target[0].value.trim();
    const password = e.target[1].value;

    // Basic validation
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const user = await loginUser(email, password);

      // Check if user is admin and show appropriate message
      const isAdmin = isAdminUser(user.email);
      const welcomeMessage = isAdmin
        ? getAdminWelcomeMessage(user.displayName, user.email)
        : getRegularWelcomeMessage(user.displayName, user.email);

      // Show success message
      toast.success(welcomeMessage, {
        autoClose: 2000,
        position: 'top-center',
      });

      // Navigate to appropriate page based on user type
      setTimeout(() => {
        navigate(getRedirectPath(user.email));
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      setErr(true);
      setErrorInfo(getLoginErrorMessage(error.code));
    }
  };

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleClick = () => {
    setErrorInfo('');
  };

  const handleForgotPassword = () => {
    setIsPasswordResetOpen(true);
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo"> Chat</span>
        <span className="title">Login</span>
        <form ref={formRef} onSubmit={handleSubmit}>
          <input
            name="email"
            value={user.email}
            onChange={handleChange}
            onClick={handleClick}
            type="email"
            placeholder="email"
          />
          <input
            name="password"
            value={user.password}
            onChange={handleChange}
            onClick={handleClick}
            type="password"
            placeholder="password"
          />
          <button>Sign in</button>
          {err && <span>{errorInfo}</span>}
        </form>

        <div className="login-links">
          <button
            type="button"
            className="forgot-password-link"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </button>
          <p>
            You don't have an account? <Link to="/register">Sign Up </Link>
          </p>
        </div>
      </div>

      <PasswordReset
        isOpen={isPasswordResetOpen}
        onClose={() => setIsPasswordResetOpen(false)}
      />
    </div>
  );
};

export default LoginPage;
