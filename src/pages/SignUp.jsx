import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, db, storage } from '../firebase';
import Add from '../img/addAvatar.png';

const SignUp = () => {
  const formRef = useRef(null);
  const [err, setErr] = useState(false);
  const [errorInfo, setErrorInfo] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const [user, setUser] = useState({
    displayName: 'TestUser123',
    email: 'testuser@example.com',
    password: 'TestPass123',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    formRef?.current[0].focus();
    return () => {};
  }, []);

  // Validation functions
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = password => {
    const errors = [];
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
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
    return errors;
  };

  const validateDisplayName = name => {
    if (name.trim().length < 2) {
      return 'Display name must be at least 2 characters long';
    }
    if (name.trim().length > 30) {
      return 'Display name must be less than 30 characters';
    }
    return null;
  };

  const validateForm = (displayName, email, password, file) => {
    const errors = {};

    // Validate display name
    const nameError = validateDisplayName(displayName);
    if (nameError) errors.displayName = nameError;

    // Validate email
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate password
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors.join('. ');
    }

    // Validate file
    if (!file) {
      errors.file = 'Please select an avatar image';
    } else if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      errors.file = 'Image size must be less than 5MB';
    } else if (!file.type.startsWith('image/')) {
      errors.file = 'Please select a valid image file';
    }

    return errors;
  };

  // Firebase error handler
  const getFirebaseErrorMessage = errorCode => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or try logging in.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password with at least 6 characters.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An error occurred during registration. Please try again.';
    }
  };

  // Professional arrow function to check if user exists in Firestore database
  const checkUserExists = async displayName => {
    const checkUserPromise = async () => {
      const userDocRef = doc(db, 'users', displayName);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        throw new Error(
          `Username "${displayName}" is already taken. Please choose a different username.`
        );
      }

      return `Username "${displayName}" is available!`;
    };

    return toast.promise(checkUserPromise, {
      pending: '🔍 Checking username availability...',
      success: '✅ Username is available!',
      error: '❌ Username is already taken',
    });
  };

  // Professional arrow function to upload avatar to Firebase Storage
  const uploadAvatar = async (file, displayName) => {
    const uploadPromise = async () => {
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      return { photoURL, success: true };
    };

    return toast.promise(uploadPromise, {
      pending: '📤 Uploading avatar image...',
      success: '✅ Avatar uploaded successfully!',
      error: '⚠️ Avatar upload failed, continuing without avatar',
    });
  };

  // Professional arrow function to create Firebase Auth user
  const createAuthUser = async (email, password) => {
    const createUserPromise = async () => {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      return res;
    };

    return toast.promise(createUserPromise, {
      pending: '🔐 Creating authentication account...',
      success: '✅ Authentication account created successfully!',
      error: '❌ Failed to create authentication account',
    });
  };

  // Professional arrow function to update user profile
  const updateUserProfile = async (user, displayName, photoURL) => {
    const updateProfilePromise = async () => {
      const profileData = {
        displayName,
        ...(photoURL && { photoURL }),
      };

      await updateProfile(user, profileData);
      return 'Profile updated successfully';
    };

    return toast.promise(updateProfilePromise, {
      pending: '👤 Updating user profile...',
      success: '✅ Profile updated successfully!',
      error: '❌ Failed to update profile',
    });
  };

  // Professional arrow function to create user documents in Firestore
  const createUserDocuments = async (user, displayName, email, photoURL) => {
    const createDocumentsPromise = async () => {
      // Create user document in Firestore
      const userData = {
        uid: user.uid,
        displayName,
        email,
        ...(photoURL && { photoURL }),
      };

      await setDoc(doc(db, 'users', displayName), userData);

      // Create empty user chats document
      await setDoc(doc(db, 'userChats', displayName), {});

      return 'User documents created successfully';
    };

    return toast.promise(createDocumentsPromise, {
      pending: '📝 Creating user documents...',
      success: '✅ User documents created successfully!',
      error: '❌ Failed to create user documents',
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Clear previous errors
    setErr(false);
    setErrorInfo('');
    setValidationErrors({});

    const displayName = e.target[0].value.trim();
    const email = e.target[1].value.trim();
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    // Validate form data
    const errors = validateForm(displayName, email, password, file);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Step 1: Check if user already exists
      await checkUserExists(displayName);

      // Step 2: Create Firebase Auth user
      const authResult = await createAuthUser(email, password);

      // Step 3: Upload avatar (optional - won't fail registration if it fails)
      let photoURL = null;
      try {
        const avatarResult = await uploadAvatar(file, displayName);
        photoURL = avatarResult.photoURL;
      } catch (avatarError) {
        // Avatar upload failed, but we continue without it
        // console.warn('Avatar upload failed, continuing without avatar:', avatarError);
      }

      // Step 4: Update user profile
      await updateUserProfile(authResult.user, displayName, photoURL);

      // Step 5: Create user documents in Firestore
      await createUserDocuments(authResult.user, displayName, email, photoURL);

      // Step 6: Show final success message and navigate
      toast.success(
        `🎉 Welcome ${displayName}! Your account has been created successfully.`,
        {
          autoClose: 3000,
          position: 'top-center',
        }
      );

      // Navigate to home page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('❌ Registration error:', err);
      setErr(true);

      if (err.code === 'auth/email-already-in-use') {
        setErrorInfo(
          `Email "${email}" is already registered. Please use a different email or try logging in.`
        );
      } else if (err.message.includes('Username')) {
        setErrorInfo(err.message);
      } else {
        setErrorInfo(getFirebaseErrorMessage(err.code));
      }
      setLoading(false);
    }
  };

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleClick = () => {
    setErrorInfo('');
    setErr(false);
    setValidationErrors({});
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo"> Chat</span>
        <span className="title">Register</span>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div>
            <input
              name="displayName"
              value={user.displayName}
              required
              onChange={handleChange}
              onClick={handleClick}
              type="text"
              placeholder="John Doe"
              style={{
                borderColor: validationErrors.displayName ? '#ff4444' : '',
              }}
            />
            {validationErrors.displayName && (
              <span
                style={{
                  color: '#ff4444',
                  fontSize: '12px',
                  display: 'block',
                  marginTop: '4px',
                }}
              >
                {validationErrors.displayName}
              </span>
            )}
          </div>

          <div>
            <input
              name="email"
              value={user.email}
              required
              onChange={handleChange}
              onClick={handleClick}
              type="email"
              placeholder="john.doe@example.com"
              style={{ borderColor: validationErrors.email ? '#ff4444' : '' }}
            />
            {validationErrors.email && (
              <span
                style={{
                  color: '#ff4444',
                  fontSize: '12px',
                  display: 'block',
                  marginTop: '4px',
                }}
              >
                {validationErrors.email}
              </span>
            )}
          </div>

          <div>
            <input
              name="password"
              value={user.password}
              required
              onChange={handleChange}
              onClick={handleClick}
              type="password"
              placeholder="TestPass123"
              style={{
                borderColor: validationErrors.password ? '#ff4444' : '',
              }}
            />
            {validationErrors.password && (
              <span
                style={{
                  color: '#ff4444',
                  fontSize: '12px',
                  display: 'block',
                  marginTop: '4px',
                }}
              >
                {validationErrors.password}
              </span>
            )}
          </div>

          <div>
            <input
              required
              onChange={handleChange}
              onClick={handleClick}
              style={{ display: 'none' }}
              type="file"
              id="file"
              accept="image/*"
            />
            <label
              htmlFor="file"
              style={{ borderColor: validationErrors.file ? '#ff4444' : '' }}
            >
              <img src={Add} alt="" />
              <span>Add an avatar</span>
            </label>
            {validationErrors.file && (
              <span
                style={{
                  color: '#ff4444',
                  fontSize: '12px',
                  display: 'block',
                  marginTop: '4px',
                }}
              >
                {validationErrors.file}
              </span>
            )}
          </div>

          <button disabled={loading} type="submit">
            {loading ? 'Creating Account...' : 'Sign up'}
          </button>

          {loading && (
            <div
              style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}
            >
              Please wait while we create your account...
            </div>
          )}

          {err && (
            <div
              style={{
                color: '#ff4444',
                textAlign: 'center',
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#ffe6e6',
                borderRadius: '4px',
              }}
            >
              {errorInfo}
            </div>
          )}
        </form>
        <p>
          You do have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
