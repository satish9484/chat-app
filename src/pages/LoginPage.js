import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const LoginPage = () => {
  const formRef = useRef(null);
  const [err, setErr] = useState(false);
  const [errorInfo, setErrorInfo] = useState('');

  const [user, setUser] = useState({
    email: 'naruto@gmail.com',
    password: 'TestPasss123',
  });
  const navigate = useNavigate();

  useEffect(() => {
    formRef?.current[0].focus();
    return () => {};
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          // Signed in
          const user = userCredential.user;
          console.log('SUCCESSFULLY LOGIN');
          console.log('User login  ' + Object.entries(user));
          navigate('/');
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('User login ErrorCode ' + errorCode);
          console.log('User login  Error Message ' + errorMessage);
          setErr(true);

          if (errorCode === 'auth/user-not-found')
            setErrorInfo('User Not Found');
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleClick = () => {
    setErrorInfo('');
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
        <p>
          You don't have an account? <Link to="/register">Sign Up </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
