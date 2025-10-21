import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from 'firebase/auth';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../firebase';

const PasswordReset = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: Password
  const [userExists, setUserExists] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  // Password strength validation
  const validatePassword = password => {
    const errors = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return errors;
  };

  // Firebase error handler for password reset
  const getPasswordResetErrorMessage = errorCode => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many requests. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/invalid-action-code':
        return 'Invalid reset code. Please request a new password reset.';
      case 'auth/expired-action-code':
        return 'Reset code has expired. Please request a new password reset.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/requires-recent-login':
        return 'Please log in again before changing your password.';
      default:
        return 'Failed to reset password. Please try again.';
    }
  };

  // Step 1: Validate email and check if user exists
  const handleEmailSubmit = async e => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      // Check if user exists
      const signInMethods = await fetchSignInMethodsForEmail(
        auth,
        email.trim()
      );

      // Always proceed to step 2, regardless of whether user exists
      setUserExists(signInMethods.length > 0);
      setCurrentStep(2);

      if (signInMethods.length === 0) {
        toast.info(
          'Email not found in our system. You can still set a new password.',
          {
            position: 'top-center',
            autoClose: 4000,
          }
        );
      } else {
        toast.success('Email verified! Please enter your new password.', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Email validation error:', error);
      // Even if there's an error, allow user to proceed
      setUserExists(false);
      setCurrentStep(2);
      toast.info(
        'Proceeding to password setup. You can still set a new password.',
        {
          position: 'top-center',
          autoClose: 4000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset password
  const handlePasswordSubmit = async e => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const errors = validatePassword(newPassword);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      toast.error('Password does not meet requirements');
      return;
    }

    setIsLoading(true);
    setPasswordErrors([]);

    try {
      if (userExists) {
        // If user exists, send password reset email
        await sendPasswordResetEmail(auth, email.trim());
        toast.success(
          'Password reset email sent! Check your inbox to complete the process.',
          {
            position: 'top-center',
            autoClose: 5000,
          }
        );
      } else {
        // If user doesn't exist, show success message for password setup
        toast.success(
          'Password setup completed! You can now use this password to create a new account.',
          {
            position: 'top-center',
            autoClose: 5000,
          }
        );
      }

      // Close the modal after successful completion
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(getPasswordResetErrorMessage(error.code), {
        position: 'top-center',
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setIsLoading(false);
    setCurrentStep(1);
    setUserExists(false);
    setPasswordErrors([]);
    onClose();
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordErrors([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reset Password</h2>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Progress Indicator */}
          <div className="progress-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Email</span>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Password</span>
            </div>
          </div>

          {/* Step 1: Email Verification */}
          {currentStep === 1 && (
            <>
              <p className="reset-instructions">
                Enter your email address to verify your account and reset your
                password.
              </p>

              <form onSubmit={handleEmailSubmit} className="reset-form">
                <div className="form-group">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="reset-input"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn-secondary"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading || !email.trim()}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Step 2: Password Reset */}
          {currentStep === 2 && (
            <>
              <p className="reset-instructions">
                {userExists
                  ? 'Email verified! Please enter your new password below.'
                  : 'Please enter your new password below. This will be used for your account.'}
              </p>

              <form onSubmit={handlePasswordSubmit} className="reset-form">
                <div className="form-group">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => {
                      setNewPassword(e.target.value);
                      setPasswordErrors([]);
                    }}
                    placeholder="Enter new password"
                    className="reset-input"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => {
                      setConfirmPassword(e.target.value);
                      setPasswordErrors([]);
                    }}
                    placeholder="Confirm new password"
                    className="reset-input"
                    disabled={isLoading}
                  />
                </div>

                {/* Password Requirements */}
                {passwordErrors.length > 0 && (
                  <div className="password-requirements">
                    <h4>Password Requirements:</h4>
                    <ul>
                      {passwordErrors.map((error, index) => (
                        <li key={index} className="requirement-error">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="password-strength">
                  <div className="strength-indicator">
                    <div
                      className={`strength-bar ${newPassword.length >= 8 ? 'strong' : newPassword.length >= 4 ? 'medium' : 'weak'}`}
                    ></div>
                  </div>
                  <span
                    className="strength-text"
                    style={{
                      color:
                        newPassword.length === 0
                          ? 'var(--text-secondary)'
                          : newPassword.length < 4
                            ? 'var(--danger-color)'
                            : newPassword.length < 8
                              ? 'var(--warning-color)'
                              : 'var(--success-color)',
                    }}
                  >
                    {newPassword.length === 0
                      ? 'Enter password'
                      : newPassword.length < 4
                        ? 'Weak'
                        : newPassword.length < 8
                          ? 'Medium'
                          : 'Strong'}
                  </span>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-secondary"
                    disabled={isLoading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading || !newPassword || !confirmPassword}
                  >
                    {isLoading
                      ? 'Processing...'
                      : userExists
                        ? 'Reset Password'
                        : 'Set Password'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
